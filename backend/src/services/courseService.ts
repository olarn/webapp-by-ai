import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CourseRepository } from '../repositories/courseRepository';
import { Course, CourseCreate, CourseUpdate } from '../types/course';

export interface CourseService {
  getAllCourses: () => TE.TaskEither<Error, Course[]>;
  getActiveCourses: () => TE.TaskEither<Error, Course[]>;
  getCourseById: (id: number) => TE.TaskEither<Error, O.Option<Course>>;
  getTeacherCourses: (teacherId: number) => TE.TaskEither<Error, Course[]>;
  searchTeacherCourses: (teacherId: number, keyword: string) => TE.TaskEither<Error, Course[]>;
  createCourse: (course: CourseCreate) => TE.TaskEither<Error, Course>;
  updateCourse: (id: number, teacherId: number, course: CourseUpdate) => TE.TaskEither<Error, O.Option<Course>>;
  updateCourseStatus: (id: number, teacherId: number, status: 'active' | 'disabled') => TE.TaskEither<Error, O.Option<Course>>;
  deleteCourse: (id: number, teacherId: number) => TE.TaskEither<Error, boolean>;
}

export const createCourseService = (
  courseRepository: CourseRepository
): CourseService => ({
  getAllCourses: () =>
    pipe(
      courseRepository.findAll(),
      TE.map((courses) =>
        courses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      )
    ),

  getActiveCourses: () =>
    pipe(
      courseRepository.findActive(),
      TE.map((courses) =>
        courses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      )
    ),

  getCourseById: (id: number) =>
    pipe(
      TE.fromEither(E.fromPredicate(
        (id: number) => id > 0,
        () => new Error('Invalid course ID')
      )(id)),
      TE.chain(() => courseRepository.findById(id))
    ),

  getTeacherCourses: (teacherId: number) =>
    pipe(
      TE.fromEither(E.fromPredicate(
        (teacherId: number) => teacherId > 0,
        () => new Error('Invalid teacher ID')
      )(teacherId)),
      TE.chain(() => courseRepository.findByTeacher(teacherId))
    ),

  searchTeacherCourses: (teacherId: number, keyword: string) =>
    pipe(
      TE.fromEither(E.fromPredicate(
        (teacherId: number) => teacherId > 0,
        () => new Error('Invalid teacher ID')
      )(teacherId)),
      TE.chain(() =>
        TE.fromEither(E.fromPredicate(
          (keyword: string) => keyword.trim().length > 0,
          () => new Error('Search keyword cannot be empty')
        )(keyword))
      ),
      TE.chain((validKeyword) => courseRepository.searchByTeacher(teacherId, validKeyword))
    ),

  createCourse: (courseData: CourseCreate) =>
    pipe(
      TE.fromEither(E.fromPredicate(
        (course: CourseCreate) => course.title.trim().length > 0,
        () => new Error('Course title cannot be empty')
      )(courseData)),
      TE.chain(() =>
        TE.fromEither(E.fromPredicate(
          (course: CourseCreate) => course.price >= 0,
          () => new Error('Course price cannot be negative')
        )(courseData))
      ),
      TE.chain(() =>
        TE.fromEither(E.fromPredicate(
          (course: CourseCreate) => course.teacher_id > 0,
          () => new Error('Invalid teacher ID')
        )(courseData))
      ),
      TE.chain(() => courseRepository.create(courseData))
    ),

  updateCourse: (id: number, teacherId: number, courseData: CourseUpdate) =>
    pipe(
      TE.fromEither(E.fromPredicate(
        (id: number) => id > 0,
        () => new Error('Invalid course ID')
      )(id)),
      TE.chain(() =>
        TE.fromEither(E.fromPredicate(
          (teacherId: number) => teacherId > 0,
          () => new Error('Invalid teacher ID')
        )(teacherId))
      ),
      TE.chain(() =>
        pipe(
          courseData,
          (data) => {
            if (data.title !== undefined && data.title.trim().length === 0) {
              return TE.left(new Error('Course title cannot be empty'));
            }
            if (data.price !== undefined && data.price < 0) {
              return TE.left(new Error('Course price cannot be negative'));
            }
            return TE.right(data);
          }
        )
      ),
      TE.chain((validatedData) => courseRepository.update(id, validatedData))
    ),

  updateCourseStatus: (id: number, teacherId: number, status: 'active' | 'disabled') =>
    pipe(
      TE.fromEither(E.fromPredicate(
        (id: number) => id > 0,
        () => new Error('Invalid course ID')
      )(id)),
      TE.chain(() =>
        TE.fromEither(E.fromPredicate(
          (teacherId: number) => teacherId > 0,
          () => new Error('Invalid teacher ID')
        )(teacherId))
      ),
      TE.chain(() => courseRepository.updateStatus(id, teacherId, status))
    ),

  deleteCourse: (id: number, teacherId: number) =>
    pipe(
      TE.fromEither(E.fromPredicate(
        (id: number) => id > 0,
        () => new Error('Invalid course ID')
      )(id)),
      TE.chain(() =>
        TE.fromEither(E.fromPredicate(
          (teacherId: number) => teacherId > 0,
          () => new Error('Invalid teacher ID')
        )(teacherId))
      ),
      TE.chain(() => courseRepository.delete(id, teacherId))
    )
});
