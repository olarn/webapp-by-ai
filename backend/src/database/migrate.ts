import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { createDatabaseConnection } from './connection';
import { runQuery } from './connection';

const migrateDatabase = () =>
  pipe(
    createDatabaseConnection('../data/courses.db'),
    TE.chain((connection) =>
      pipe(
        // Add teacher_id column if it doesn't exist
        TE.tryCatch(
          () => new Promise<void>((resolve, reject) => {
            connection.db.run(
              'ALTER TABLE courses ADD COLUMN teacher_id INTEGER DEFAULT 1',
              (err) => {
                if (err && !err.message.includes('duplicate column name')) {
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          }),
          (error) => new Error(`Failed to add teacher_id column: ${error}`)
        ),
        TE.chain(() =>
          // Add status column if it doesn't exist
          TE.tryCatch(
            () => new Promise<void>((resolve, reject) => {
              connection.db.run(
                'ALTER TABLE courses ADD COLUMN status TEXT DEFAULT "active"',
                (err) => {
                  if (err && !err.message.includes('duplicate column name')) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            }),
            (error) => new Error(`Failed to add status column: ${error}`)
          )
        ),
        TE.chain(() =>
          // Create teachers table if it doesn't exist
          runQuery(
            connection,
            `CREATE TABLE IF NOT EXISTS teachers (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE NOT NULL,
              email TEXT UNIQUE NOT NULL,
              password_hash TEXT NOT NULL,
              name TEXT NOT NULL,
              created_at TEXT NOT NULL
            )`
          )
        ),
        TE.chain(() =>
          // Insert default teachers
          runQuery(
            connection,
            `INSERT OR IGNORE INTO teachers (id, username, email, password_hash, name, created_at) VALUES 
             (1, 'teacher1', 'teacher1@example.com', 'password123', 'John Doe', datetime('now')),
             (2, 'teacher2', 'teacher2@example.com', 'password123', 'Jane Smith', datetime('now'))`
          )
        ),
        TE.map(() => {
          console.log('Database migration completed successfully');
          return connection;
        })
      )
    )
  );

// Run migration
migrateDatabase()().then(
  (result) => {
    if (result._tag === 'Left') {
      console.error('Migration failed:', result.left.message);
      process.exit(1);
    } else {
      console.log('Migration successful');
      process.exit(0);
    }
  }
);
