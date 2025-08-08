import * as TE from 'fp-ts/TaskEither';
import { Database } from 'sqlite3';
import { promisify } from 'util';
import type { Enrollment, CreateEnrollmentRequest } from '../types/enrollment';

export class EnrollmentRepository {
  constructor(private db: Database) {}

  private run = promisify(this.db.run.bind(this.db)) as any;
  private get = promisify(this.db.get.bind(this.db)) as any;
  private all = promisify(this.db.all.bind(this.db)) as any;

  createEnrollment = (data: CreateEnrollmentRequest): TE.TaskEither<Error, Enrollment> =>
    TE.tryCatch(
      async () => {
        const enrollmentId = `ENR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const result = await this.run(
          `INSERT INTO enrollments (
            enrollment_id, course_id, first_name, last_name, email, phone, company, agree_to_terms, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            enrollmentId,
            data.course_id,
            data.first_name,
            data.last_name,
            data.email,
            data.phone || null,
            data.company || null,
            data.agree_to_terms,
            'pending'
          ]
        );

        const enrollment = await this.get(
          'SELECT * FROM enrollments WHERE enrollment_id = ?',
          [enrollmentId]
        );

        return enrollment as Enrollment;
      },
      (error) => new Error(`Failed to create enrollment: ${error}`)
    );

  getEnrollmentById = (enrollmentId: string): TE.TaskEither<Error, Enrollment | null> =>
    TE.tryCatch(
      async () => {
        const enrollment = await this.get(
          'SELECT * FROM enrollments WHERE enrollment_id = ?',
          [enrollmentId]
        );
        return enrollment as Enrollment | null;
      },
      (error) => new Error(`Failed to get enrollment: ${error}`)
    );

  getEnrollmentsByEmail = (email: string): TE.TaskEither<Error, Enrollment[]> =>
    TE.tryCatch(
      async () => {
        const enrollments = await this.all(
          'SELECT * FROM enrollments WHERE email = ? ORDER BY created_at DESC',
          [email]
        );
        return enrollments as Enrollment[];
      },
      (error) => new Error(`Failed to get enrollments by email: ${error}`)
    );

  getEnrollmentsByCourseId = (courseId: number): TE.TaskEither<Error, Enrollment[]> =>
    TE.tryCatch(
      async () => {
        const enrollments = await this.all(
          'SELECT * FROM enrollments WHERE course_id = ? ORDER BY created_at DESC',
          [courseId]
        );
        return enrollments as Enrollment[];
      },
      (error) => new Error(`Failed to get enrollments by course: ${error}`)
    );

  updateEnrollmentStatus = (enrollmentId: string, status: 'pending' | 'confirmed' | 'cancelled'): TE.TaskEither<Error, void> =>
    TE.tryCatch(
      async () => {
        await this.run(
          'UPDATE enrollments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE enrollment_id = ?',
          [status, enrollmentId]
        );
      },
      (error) => new Error(`Failed to update enrollment status: ${error}`)
    );

  getAllEnrollments = (): TE.TaskEither<Error, Enrollment[]> =>
    TE.tryCatch(
      async () => {
        const enrollments = await this.all(
          'SELECT * FROM enrollments ORDER BY created_at DESC'
        );
        return enrollments as Enrollment[];
      },
      (error) => new Error(`Failed to get all enrollments: ${error}`)
    );
}
