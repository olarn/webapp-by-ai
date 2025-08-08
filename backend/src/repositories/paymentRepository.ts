import * as TE from 'fp-ts/TaskEither';
import { Database } from 'sqlite3';
import { promisify } from 'util';
import type { Payment, CreatePaymentRequest } from '../types/enrollment';

export class PaymentRepository {
  constructor(private db: Database) { }

  private run = promisify(this.db.run.bind(this.db)) as any;
  private get = promisify(this.db.get.bind(this.db)) as any;
  private all = promisify(this.db.all.bind(this.db)) as any;

  createPayment = (data: CreatePaymentRequest): TE.TaskEither<Error, Payment> =>
    TE.tryCatch(
      async () => {
        const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const result = await this.run(
          `INSERT INTO payments (
            payment_id, enrollment_id, amount, payment_method, reference, status
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            paymentId,
            data.enrollment_id,
            data.amount,
            data.payment_method,
            data.reference,
            'pending'
          ]
        );

        const payment = await this.get(
          'SELECT * FROM payments WHERE payment_id = ?',
          [paymentId]
        );

        return payment as Payment;
      },
      (error) => new Error(`Failed to create payment: ${error}`)
    );

  getPaymentById = (paymentId: string): TE.TaskEither<Error, Payment | null> =>
    TE.tryCatch(
      async () => {
        const payment = await this.get(
          'SELECT * FROM payments WHERE payment_id = ?',
          [paymentId]
        );
        return payment as Payment | null;
      },
      (error) => new Error(`Failed to get payment: ${error}`)
    );

  getPaymentsByEnrollmentId = (enrollmentId: string): TE.TaskEither<Error, Payment[]> =>
    TE.tryCatch(
      async () => {
        const payments = await this.all(
          'SELECT * FROM payments WHERE enrollment_id = ? ORDER BY created_at DESC',
          [enrollmentId]
        );
        return payments as Payment[];
      },
      (error) => new Error(`Failed to get payments by enrollment: ${error}`)
    );

  updatePaymentStatus = (
    paymentId: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded',
    transactionId?: string
  ): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      async () => {
        const completedAt = status === 'completed' ? 'CURRENT_TIMESTAMP' : null;
        const transactionIdValue = transactionId || null;

        await this.run(
          `UPDATE payments SET 
            status = ?, 
            transaction_id = ?, 
            completed_at = ${completedAt ? 'CURRENT_TIMESTAMP' : 'NULL'}
           WHERE payment_id = ?`,
          [status, transactionIdValue, paymentId]
        );
      },
      (error) => new Error(`Failed to update payment status: ${error}`)
    );

  completePayment = (paymentId: string, transactionId: string): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      async () => {
        await this.run(
          `UPDATE payments SET 
            status = 'completed', 
            transaction_id = ?, 
            completed_at = CURRENT_TIMESTAMP
           WHERE payment_id = ?`,
          [transactionId, paymentId]
        );
      },
      (error) => new Error(`Failed to complete payment: ${error}`)
    );

  getAllPayments = (): TE.TaskEither<Error, Payment[]> =>
    TE.tryCatch(
      async () => {
        const payments = await this.all(
          'SELECT * FROM payments ORDER BY created_at DESC'
        );
        return payments as Payment[];
      },
      (error) => new Error(`Failed to get all payments: ${error}`)
    );

  getPaymentStats = (): TE.TaskEither<Error, { total: number; completed: number; pending: number; failed: number }> =>
    TE.tryCatch(
      async () => {
        const stats = await this.get(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
          FROM payments
        `);

        return {
          total: (stats as any).total || 0,
          completed: (stats as any).completed || 0,
          pending: (stats as any).pending || 0,
          failed: (stats as any).failed || 0
        };
      },
      (error) => new Error(`Failed to get payment stats: ${error}`)
    );
}
