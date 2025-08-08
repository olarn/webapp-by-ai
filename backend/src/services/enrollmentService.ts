import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { PaymentRepository } from '../repositories/paymentRepository';
import type { 
  Enrollment, 
  CreateEnrollmentRequest, 
  Payment, 
  CreatePaymentRequest 
} from '../types/enrollment';

export class EnrollmentService {
  constructor(
    private enrollmentRepository: EnrollmentRepository,
    private paymentRepository: PaymentRepository
  ) {}

  createEnrollment = (data: CreateEnrollmentRequest): TE.TaskEither<Error, Enrollment> =>
    pipe(
      this.validateEnrollmentData(data),
      TE.chain(() => this.enrollmentRepository.createEnrollment(data))
    );

  getEnrollmentById = (enrollmentId: string): TE.TaskEither<Error, Enrollment | null> =>
    this.enrollmentRepository.getEnrollmentById(enrollmentId);

  getEnrollmentsByEmail = (email: string): TE.TaskEither<Error, Enrollment[]> =>
    pipe(
      this.validateEmail(email),
      TE.chain(() => this.enrollmentRepository.getEnrollmentsByEmail(email))
    );

  getEnrollmentsByCourseId = (courseId: number): TE.TaskEither<Error, Enrollment[]> =>
    this.enrollmentRepository.getEnrollmentsByCourseId(courseId);

  updateEnrollmentStatus = (
    enrollmentId: string, 
    status: 'pending' | 'confirmed' | 'cancelled'
  ): TE.TaskEither<Error, void> =>
    this.enrollmentRepository.updateEnrollmentStatus(enrollmentId, status);

  getAllEnrollments = (): TE.TaskEither<Error, Enrollment[]> =>
    this.enrollmentRepository.getAllEnrollments();

  // Payment methods
  createPayment = (data: CreatePaymentRequest): TE.TaskEither<Error, Payment> =>
    pipe(
      this.validatePaymentData(data),
      TE.chain(() => this.paymentRepository.createPayment(data))
    );

  getPaymentById = (paymentId: string): TE.TaskEither<Error, Payment | null> =>
    this.paymentRepository.getPaymentById(paymentId);

  getPaymentsByEnrollmentId = (enrollmentId: string): TE.TaskEither<Error, Payment[]> =>
    this.paymentRepository.getPaymentsByEnrollmentId(enrollmentId);

  completePayment = (paymentId: string, transactionId: string): TE.TaskEither<Error, void> =>
    pipe(
      this.paymentRepository.completePayment(paymentId, transactionId),
      TE.chain(() => this.updateEnrollmentStatusAfterPayment(paymentId))
    );

  getAllPayments = (): TE.TaskEither<Error, Payment[]> =>
    this.paymentRepository.getAllPayments();

  getPaymentStats = () =>
    this.paymentRepository.getPaymentStats();

  // Combined enrollment and payment flow
  enrollAndPay = (
    enrollmentData: CreateEnrollmentRequest,
    paymentData: Omit<CreatePaymentRequest, 'enrollment_id'>
  ): TE.TaskEither<Error, { enrollment: Enrollment; payment: Payment }> =>
    pipe(
      this.createEnrollment(enrollmentData),
      TE.chain((enrollment) =>
        pipe(
          this.createPayment({
            ...paymentData,
            enrollment_id: enrollment.enrollment_id
          }),
          TE.map((payment) => ({ enrollment, payment }))
        )
      )
    );

  // Private validation methods
  private validateEnrollmentData = (data: CreateEnrollmentRequest): TE.TaskEither<Error, void> =>
    TE.fromEither(
      pipe(
        E.fromPredicate(
          (d: CreateEnrollmentRequest) => d.first_name.trim().length > 0,
          () => new Error('First name is required')
        )(data),
        E.chain(() =>
          E.fromPredicate(
            (d: CreateEnrollmentRequest) => d.last_name.trim().length > 0,
            () => new Error('Last name is required')
          )(data)
        ),
        E.chain(() =>
          E.fromPredicate(
            (d: CreateEnrollmentRequest) => this.isValidEmail(d.email),
            () => new Error('Invalid email format')
          )(data)
        ),
        E.chain(() =>
          E.fromPredicate(
            (d: CreateEnrollmentRequest) => d.agree_to_terms,
            () => new Error('Terms and conditions must be agreed to')
          )(data)
        ),
        E.map(() => void 0)
      )
    );

  private validatePaymentData = (data: CreatePaymentRequest): TE.TaskEither<Error, void> =>
    TE.fromEither(
      pipe(
        E.fromPredicate(
          (d: CreatePaymentRequest) => d.amount > 0,
          () => new Error('Payment amount must be greater than 0')
        )(data),
        E.chain(() =>
          E.fromPredicate(
            (d: CreatePaymentRequest) => d.payment_method.trim().length > 0,
            () => new Error('Payment method is required')
          )(data)
        ),
        E.chain(() =>
          E.fromPredicate(
            (d: CreatePaymentRequest) => d.reference.trim().length > 0,
            () => new Error('Payment reference is required')
          )(data)
        ),
        E.map(() => void 0)
      )
    );

  private validateEmail = (email: string): TE.TaskEither<Error, void> =>
    TE.fromEither(
      pipe(
        E.fromPredicate(
          (e: string) => this.isValidEmail(e),
          () => new Error('Invalid email format')
        )(email),
        E.map(() => void 0)
      )
    );

  private isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  private updateEnrollmentStatusAfterPayment = (paymentId: string): TE.TaskEither<Error, void> =>
    pipe(
      this.paymentRepository.getPaymentById(paymentId),
      TE.chain((payment) =>
        payment 
          ? this.enrollmentRepository.updateEnrollmentStatus(payment.enrollment_id, 'confirmed')
          : TE.left(new Error('Payment not found'))
      )
    );
}
