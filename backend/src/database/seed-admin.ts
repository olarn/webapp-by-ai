import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { createDatabaseConnection } from './connection';
import { AdminRepository } from '../repositories/adminRepository';
import { initializeDatabase } from './init';
import * as crypto from 'crypto';

const hashWithSalt = (password: string, salt: string) =>
  crypto.createHmac('sha256', salt).update(password).digest('hex');

const seed = () =>
  pipe(
    createDatabaseConnection('../data/courses.db'),
    TE.chain((conn) =>
      pipe(
        initializeDatabase(conn),
        TE.map(() => conn)
      )
    ),
    TE.chain((conn) =>
      TE.tryCatch(async () => {
        const repo = new AdminRepository(conn.db);
        const defaultUser = process.env.ADMIN_USER || 'admin';
        const defaultPass = process.env.ADMIN_PASS || 'admin123';
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = hashWithSalt(defaultPass, salt);
        const existing = await repo.findByUsername(defaultUser)();
        if (existing._tag === 'Right' && existing.right._tag === 'Some') {
          console.log('Admin already exists');
          return;
        }
        const created = await repo.create({
          username: defaultUser,
          name: 'Site Administrator',
          password_hash: hash,
          password_salt: salt
        })();
        if (created._tag === 'Left') {
          throw created.left;
        }
        console.log('Seeded admin:', created.right.username);
      }, (e) => new Error(String(e)))
    )
  );

seed()().then((res) => {
  if (res._tag === 'Left') {
    console.error('Seed admin failed:', res.left.message);
    process.exit(1);
  } else {
    console.log('Seed admin completed');
    process.exit(0);
  }
});


