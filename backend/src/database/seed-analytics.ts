import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { createDatabaseConnection, runQuery } from './connection';
import { initializeDatabase } from './init';

const DB_PATH = '../data/courses.db';

const ym = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
const ymdhms = (y: number, m1: number, d: number, h = 12, min = 0, s = 0) =>
  `${y}-${String(m1).padStart(2, '0')}-${String(d).padStart(2, '0')} ${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

const main = () =>
  pipe(
    createDatabaseConnection(DB_PATH),
    TE.chain((conn) =>
      pipe(
        initializeDatabase(conn),
        TE.map(() => conn)
      )
    ),
    TE.chain((conn) =>
      // Remove previous sample rows for idempotency
      pipe(
        runQuery(conn, `DELETE FROM courses WHERE title LIKE '[Sample] %'`),
        TE.chain(() => runQuery(conn, `DELETE FROM payments WHERE payment_id LIKE 'PAY-SEED-%'`)),
        TE.chain(() => runQuery(conn, `DELETE FROM enrollments WHERE enrollment_id LIKE 'ENR-SEED-%'`)),
        TE.map(() => conn)
      )
    ),
    TE.chain((conn) =>
      TE.tryCatch(async () => {
        const now = new Date();
        const months: Array<{ y: number; m1: number; label: string }> = [2, 1, 0].map((offset) => {
          const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
          return { y: d.getUTCFullYear(), m1: d.getUTCMonth() + 1, label: ym(d) };
        });

        // Seed courses across last 3 months
        for (const { y, m1, label } of months) {
          const createdAt1 = ymdhms(y, m1, 5, 10);
          const createdAt2 = ymdhms(y, m1, 14, 11);
          const createdAt3 = ymdhms(y, m1, 23, 15);
          await new Promise<void>((resolve, reject) => {
            conn.db.run(
              `INSERT INTO courses (title, description, image_url, instructor, price, category, teacher_id, status, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?),
                      (?, ?, ?, ?, ?, ?, ?, 'active', ?),
                      (?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
              [
                `[Sample] FP Essentials ${label}`, 'Sample FP course', '/images/fp-course.svg', 'Dr. Sample', 79.99, 'Functional Programming', 1, createdAt1,
                `[Sample] Web Dev ${label}`, 'Sample web dev course', '/images/web-development.svg', 'Dr. Sample', 99.99, 'Web Development', 1, createdAt2,
                `[Sample] Data Science ${label}`, 'Sample DS course', '/images/data-science.svg', 'Dr. Sample', 119.99, 'Data Science', 2, createdAt3,
              ],
              (err) => (err ? reject(err) : resolve())
            );
          });
        }

        // Ensure we have at least one course id to reference in enrollments
        const firstCourseId: number = await new Promise((resolve, reject) => {
          conn.db.get('SELECT id FROM courses ORDER BY id ASC LIMIT 1', (err: Error | null, row?: { id?: number }) => {
            if (err) reject(err);
            else resolve(row?.id ?? 1);
          });
        });

        // Seed enrollments and payments across months
        let seedCounter = 1;
        for (const { y, m1, label } of months) {
          // Completed payments (income)
          for (const day of [6, 16, 26]) {
            const enrId = `ENR-SEED-${label}-${seedCounter}`;
            const payId = `PAY-SEED-${label}-${seedCounter}`;
            seedCounter += 1;
            const createdAt = ymdhms(y, m1, day, 9);
            await new Promise<void>((resolve, reject) => {
              conn.db.run(
                `INSERT INTO enrollments (enrollment_id, course_id, first_name, last_name, email, agree_to_terms, status, created_at)
                 VALUES (?, ?, 'Seed', 'User', ?, 1, 'confirmed', ?)`,
                [enrId, firstCourseId, `seed${seedCounter}@example.com`, createdAt],
                (err) => (err ? reject(err) : resolve())
              );
            });
            await new Promise<void>((resolve, reject) => {
              conn.db.run(
                `INSERT INTO payments (payment_id, enrollment_id, amount, payment_method, reference, status, created_at)
                 VALUES (?, ?, ?, 'card', 'REF-${label}', 'completed', ?)`,
                [payId, enrId, 50 + Math.floor(Math.random() * 150), createdAt],
                (err) => (err ? reject(err) : resolve())
              );
            });
          }

          // Pending enrollments (no payment yet)
          for (const day of [8, 18]) {
            const enrId = `ENR-SEED-${label}-P-${seedCounter}`;
            seedCounter += 1;
            const createdAt = ymdhms(y, m1, day, 13);
            await new Promise<void>((resolve, reject) => {
              conn.db.run(
                `INSERT INTO enrollments (enrollment_id, course_id, first_name, last_name, email, agree_to_terms, status, created_at)
                 VALUES (?, ?, 'Pending', 'User', ?, 1, 'pending', ?)`,
                [enrId, firstCourseId, `pending${seedCounter}@example.com`, createdAt],
                (err) => (err ? reject(err) : resolve())
              );
            });
          }
        }
      }, (e) => new Error(String(e)))
    )
  );

main()().then((res) => {
  if (res._tag === 'Left') {
    console.error('Seed analytics failed:', res.left.message);
    process.exit(1);
  } else {
    console.log('Seed analytics completed');
    process.exit(0);
  }
});


