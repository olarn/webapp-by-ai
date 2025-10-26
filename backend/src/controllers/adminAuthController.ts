import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import { AdminRepository } from '../repositories/adminRepository';

// Pure value objects
export interface UserName {
  readonly value: string;
}

export interface Password {
  readonly value: string;
}

export interface Credentials {
  readonly username: UserName;
  readonly password: Password;
}

interface AuthResponse {
  readonly id: number;
  readonly username: string;
  readonly role: 'admin';
  readonly name: string;
}

interface AuthError {
  readonly status: number;
  readonly message: string;
}

// Pure validation functions
const createUserName = (value: string): E.Either<AuthError, UserName> =>
  value.length === 0
    ? E.left({ status: 400, message: 'Username and password are incorrect.' })
    : E.right({ value });

const createPassword = (value: string): E.Either<AuthError, Password> =>
  value.length === 0
    ? E.left({ status: 400, message: 'Username and password are incorrect.' })
    : E.right({ value });

const createCredentials = (username: UserName, password: Password): E.Either<AuthError, Credentials> =>
  E.right({ username, password });

const validateCredentials = (username: string, password: string): E.Either<AuthError, Credentials> =>
  pipe(
    E.Do,
    E.apS('username', createUserName(username)),
    E.apS('password', createPassword(password)),
    E.chain(({ username, password }) => createCredentials(username, password))
  );

// Pure hash function
const hashPassword = (password: Password, salt: string): string =>
  crypto.createHmac('sha256', salt).update(password.value).digest('hex');

export class AdminAuthController {
  constructor(private adminRepository: AdminRepository) { }

  // Pure authentication logic composed functionally
  private authenticateAdmin = (credentials: Credentials): TE.TaskEither<AuthError, AuthResponse> =>
    pipe(
      this.adminRepository.findByUsername(credentials.username),
      TE.mapLeft(error => ({ status: 500, message: error.message })),
      TE.chain(
        O.fold(
          () => TE.left({ status: 401, message: 'Invalid credentials' }),
          admin => {
            const computed = hashPassword(credentials.password, admin.password_salt);
            return computed !== admin.password_hash
              ? TE.left({ status: 401, message: 'Invalid credentials' })
              : TE.right({
                id: admin.id,
                username: admin.username,
                role: 'admin' as const,
                name: admin.name,
              });
          }
        )
      )
    );

  // Pure composition of validation and authentication
  private loginFlow = (username: string, password: string): TE.TaskEither<AuthError, AuthResponse> =>
    pipe(
      validateCredentials(username, password),
      TE.fromEither,
      TE.chain(this.authenticateAdmin)
    );

  // Side effect only at the edges
  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.loginFlow(req.body.username, req.body.password)();

    pipe(
      result,
      E.fold(
        error => res.status(error.status).json({ success: false, error: error.message }),
        data => res.status(200).json({ success: true, data })
      )
    );
  };
}


