import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { TeacherRepository } from '../repositories/teacherRepository';
import { Teacher, TeacherLogin, TeacherRegister } from '../types/course';

export interface TeacherService {
  register: (teacher: TeacherRegister) => TE.TaskEither<Error, Teacher>;
  login: (credentials: TeacherLogin) => TE.TaskEither<Error, Teacher>;
  getTeacherById: (id: number) => TE.TaskEither<Error, O.Option<Teacher>>;
}

export const createTeacherService = (
  teacherRepository: TeacherRepository
): TeacherService => ({
  register: (teacherData: TeacherRegister) =>
    pipe(
      TE.fromEither(E.fromPredicate(
        (teacher: TeacherRegister) => teacher.username.trim().length > 0,
        () => new Error('Username cannot be empty')
      )(teacherData)),
      TE.chain(() =>
        TE.fromEither(E.fromPredicate(
          (teacher: TeacherRegister) => teacher.email.includes('@'),
          () => new Error('Invalid email format')
        )(teacherData))
      ),
      TE.chain(() =>
        TE.fromEither(E.fromPredicate(
          (teacher: TeacherRegister) => teacher.password.length >= 6,
          () => new Error('Password must be at least 6 characters')
        )(teacherData))
      ),
      TE.chain(() =>
        TE.fromEither(E.fromPredicate(
          (teacher: TeacherRegister) => teacher.name.trim().length > 0,
          () => new Error('Name cannot be empty')
        )(teacherData))
      ),
      TE.chain(() => teacherRepository.create(teacherData))
    ),

  login: (credentials: TeacherLogin) =>
    pipe(
      TE.fromEither(E.fromPredicate(
        (creds: TeacherLogin) => creds.username.trim().length > 0,
        () => new Error('Username cannot be empty')
      )(credentials)),
      TE.chain(() =>
        TE.fromEither(E.fromPredicate(
          (creds: TeacherLogin) => creds.password.length > 0,
          () => new Error('Password cannot be empty')
        )(credentials))
      ),
      TE.chain(() => teacherRepository.authenticate(credentials)),
      TE.chain((teacherOption) =>
        pipe(
          teacherOption,
          O.fold(
            () => TE.left(new Error('Invalid credentials')),
            (teacher) => TE.right(teacher)
          )
        )
      )
    ),

  getTeacherById: (id: number) =>
    pipe(
      TE.fromEither(E.fromPredicate(
        (id: number) => id > 0,
        () => new Error('Invalid teacher ID')
      )(id)),
      TE.chain(() => teacherRepository.findById(id))
    )
});
