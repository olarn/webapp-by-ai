import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { Database } from 'sqlite3';
import { promisify } from 'util';
import type { Admin } from '../types/admin';

export class AdminRepository {
  constructor(private db: Database) { }

  private get = promisify(this.db.get.bind(this.db)) as any;
  private run = promisify(this.db.run.bind(this.db)) as any;

  findByUsername = (username: string): TE.TaskEither<Error, O.Option<Admin>> =>
    TE.tryCatch(
      async () => {
        const row = await this.get('SELECT * FROM admins WHERE username = ?', [username]);
        return row ? O.some(row as Admin) : O.none;
      },
      (error) => new Error(`Failed to find admin by username: ${error}`)
    );

  create = (admin: { username: string; name: string; password_hash: string; password_salt: string }): TE.TaskEither<Error, Admin> =>
    TE.tryCatch(
      async () => {
        await this.run(
          `INSERT INTO admins (username, name, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [admin.username, admin.name, admin.password_hash, admin.password_salt]
        );
        const row = await this.get('SELECT * FROM admins WHERE username = ?', [admin.username]);
        return row as Admin;
      },
      (error) => new Error(`Failed to create admin: ${error}`)
    );
}


