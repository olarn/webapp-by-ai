import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DatabaseConnection, runQuery } from './connection';
import { migrate } from './migrate';

export const initializeDatabase = (
  connection: DatabaseConnection
): TE.TaskEither<Error, void> =>
  pipe(
    // Create teachers table
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
    ),
    TE.chain(() =>
      // Update courses table to include teacher_id and status
      runQuery(
        connection,
        `CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          image_url TEXT NOT NULL,
          instructor TEXT NOT NULL,
          price REAL NOT NULL,
          category TEXT NOT NULL,
          teacher_id INTEGER NOT NULL,
          status TEXT NOT NULL DEFAULT 'active',
          created_at TEXT NOT NULL,
          FOREIGN KEY (teacher_id) REFERENCES teachers (id)
        )`
      )
    ),
    TE.chain(() =>
      // Add indexes for better performance
      runQuery(
        connection,
        'CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses (teacher_id)'
      )
    ),
    TE.chain(() =>
      runQuery(
        connection,
        'CREATE INDEX IF NOT EXISTS idx_courses_status ON courses (status)'
      )
    ),
    TE.chain(() =>
      runQuery(
        connection,
        'CREATE INDEX IF NOT EXISTS idx_teachers_username ON teachers (username)'
      )
    ),
    TE.chain(() =>
      runQuery(
        connection,
        'CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers (email)'
      )
    ),
    TE.chain(() =>
      // Run enrollment and payment migration
      TE.tryCatch(
        async () => {
          await migrate(connection.db);
        },
        (error) => new Error(`Migration failed: ${error}`)
      )
    )
  );
