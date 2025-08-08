import * as sqlite3 from 'sqlite3';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';

export interface DatabaseConnection {
  db: sqlite3.Database;
}

export const createDatabaseConnection = (
  databasePath: string
): TE.TaskEither<Error, DatabaseConnection> =>
  TE.tryCatch(
    () =>
      new Promise<DatabaseConnection>((resolve, reject) => {
        const db = new sqlite3.Database(databasePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve({ db });
          }
        });
      }),
    (error) => new Error(`Failed to connect to database: ${error}`)
  );

export const closeDatabaseConnection = (
  connection: DatabaseConnection
): TE.TaskEither<Error, void> =>
  TE.tryCatch(
    () =>
      new Promise<void>((resolve, reject) => {
        connection.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }),
    (error) => new Error(`Failed to close database connection: ${error}`)
  );

export const runQuery = (
  connection: DatabaseConnection,
  sql: string,
  params: any[] = []
): TE.TaskEither<Error, void> =>
  TE.tryCatch(
    () =>
      new Promise<void>((resolve, reject) => {
        connection.db.run(sql, params, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }),
    (error) => new Error(`Query execution failed: ${error}`)
  );

export const getQuery = <T>(
  connection: DatabaseConnection,
  sql: string,
  params: any[] = []
): TE.TaskEither<Error, O.Option<T>> =>
  TE.tryCatch(
    () =>
      new Promise<O.Option<T>>((resolve, reject) => {
        connection.db.get(sql, params, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(O.fromNullable(row as T));
          }
        });
      }),
    (error) => new Error(`Query execution failed: ${error}`)
  );

export const allQuery = <T>(
  connection: DatabaseConnection,
  sql: string,
  params: any[] = []
): TE.TaskEither<Error, T[]> =>
  TE.tryCatch(
    () =>
      new Promise<T[]>((resolve, reject) => {
        connection.db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows as T[]);
          }
        });
      }),
    (error) => new Error(`Query execution failed: ${error}`)
  );
