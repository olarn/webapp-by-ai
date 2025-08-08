import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { DatabaseConnection, allQuery, getQuery, runQuery } from '../database/connection';
import { Course, CourseCreate, CourseUpdate, CourseSchema } from '../types/course';

export interface CourseRepository {
  findAll: () => TE.TaskEither<Error, Course[]>;
  findActive: () => TE.TaskEither<Error, Course[]>;
  findById: (id: number) => TE.TaskEither<Error, O.Option<Course>>;
  findByTeacher: (teacherId: number) => TE.TaskEither<Error, Course[]>;
  searchByTeacher: (teacherId: number, keyword: string) => TE.TaskEither<Error, Course[]>;
  create: (course: CourseCreate) => TE.TaskEither<Error, Course>;
  update: (id: number, course: CourseUpdate) => TE.TaskEither<Error, O.Option<Course>>;
  updateStatus: (id: number, teacherId: number, status: 'active' | 'disabled') => TE.TaskEither<Error, O.Option<Course>>;
  delete: (id: number, teacherId: number) => TE.TaskEither<Error, boolean>;
}

export const createCourseRepository = (
  connection: DatabaseConnection
): CourseRepository => ({
  findAll: () =>
    TE.tryCatch(
      async () => {
        const courses = await new Promise<Course[]>((resolve, reject) => {
          connection.db.all('SELECT * FROM courses ORDER BY created_at DESC', (err, rows) => {
            if (err) {
              reject(err);
            } else {
              const validatedCourses: Course[] = [];
              for (const row of rows) {
                const result = CourseSchema.decode(row);
                if (result._tag === 'Right') {
                  validatedCourses.push(result.right);
                } else {
                  reject(new Error(`Validation error: ${JSON.stringify(result.left)}`));
                  return;
                }
              }
              resolve(validatedCourses);
            }
          });
        });
        return courses;
      },
      (error) => new Error(`Failed to fetch courses: ${error}`)
    ),

  findActive: () =>
    TE.tryCatch(
      async () => {
        const courses = await new Promise<Course[]>((resolve, reject) => {
          connection.db.all('SELECT * FROM courses WHERE status = "active" ORDER BY created_at DESC', (err, rows) => {
            if (err) {
              reject(err);
            } else {
              const validatedCourses: Course[] = [];
              for (const row of rows) {
                const result = CourseSchema.decode(row);
                if (result._tag === 'Right') {
                  validatedCourses.push(result.right);
                } else {
                  reject(new Error(`Validation error: ${JSON.stringify(result.left)}`));
                  return;
                }
              }
              resolve(validatedCourses);
            }
          });
        });
        return courses;
      },
      (error) => new Error(`Failed to fetch active courses: ${error}`)
    ),

  findById: (id: number) =>
    TE.tryCatch(
      async () => {
        const course = await new Promise<Course | null>((resolve, reject) => {
          connection.db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
            if (err) {
              reject(err);
            } else if (row) {
              const result = CourseSchema.decode(row);
              if (result._tag === 'Right') {
                resolve(result.right);
              } else {
                reject(new Error(`Validation error: ${JSON.stringify(result.left)}`));
              }
            } else {
              resolve(null);
            }
          });
        });
        return course ? O.some(course) : O.none;
      },
      (error) => new Error(`Failed to fetch course: ${error}`)
    ),

  findByTeacher: (teacherId: number) =>
    TE.tryCatch(
      async () => {
        const courses = await new Promise<Course[]>((resolve, reject) => {
          connection.db.all('SELECT * FROM courses WHERE teacher_id = ? ORDER BY created_at DESC', [teacherId], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              const validatedCourses: Course[] = [];
              for (const row of rows) {
                const result = CourseSchema.decode(row);
                if (result._tag === 'Right') {
                  validatedCourses.push(result.right);
                } else {
                  reject(new Error(`Validation error: ${JSON.stringify(result.left)}`));
                  return;
                }
              }
              resolve(validatedCourses);
            }
          });
        });
        return courses;
      },
      (error) => new Error(`Failed to fetch teacher courses: ${error}`)
    ),

  searchByTeacher: (teacherId: number, keyword: string) =>
    TE.tryCatch(
      async () => {
        const courses = await new Promise<Course[]>((resolve, reject) => {
          const searchPattern = `%${keyword}%`;
          connection.db.all(
            'SELECT * FROM courses WHERE teacher_id = ? AND (title LIKE ? OR description LIKE ? OR category LIKE ?) ORDER BY created_at DESC',
            [teacherId, searchPattern, searchPattern, searchPattern],
            (err, rows) => {
              if (err) {
                reject(err);
              } else {
                const validatedCourses: Course[] = [];
                for (const row of rows) {
                  const result = CourseSchema.decode(row);
                  if (result._tag === 'Right') {
                    validatedCourses.push(result.right);
                  } else {
                    reject(new Error(`Validation error: ${JSON.stringify(result.left)}`));
                    return;
                  }
                }
                resolve(validatedCourses);
              }
            }
          );
        });
        return courses;
      },
      (error) => new Error(`Failed to search teacher courses: ${error}`)
    ),

  create: (courseData: CourseCreate) =>
    TE.tryCatch(
      async () => {
        return new Promise<Course>((resolve, reject) => {
          connection.db.run(
            'INSERT INTO courses (title, description, image_url, instructor, price, category, teacher_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              courseData.title,
              courseData.description,
              courseData.image_url,
              courseData.instructor,
              courseData.price,
              courseData.category,
              courseData.teacher_id,
              'active' // Default status
            ],
            function (err) {
              if (err) {
                reject(err);
              } else {
                // Get the created course
                connection.db.get('SELECT * FROM courses WHERE id = ?', [this.lastID], (err, row) => {
                  if (err) {
                    reject(err);
                  } else if (row) {
                    const result = CourseSchema.decode(row);
                    if (result._tag === 'Right') {
                      resolve(result.right);
                    } else {
                      reject(new Error(`Validation error: ${JSON.stringify(result.left)}`));
                    }
                  } else {
                    reject(new Error('Failed to retrieve created course'));
                  }
                });
              }
            }
          );
        });
      },
      (error) => new Error(`Failed to create course: ${error}`)
    ),

  update: (id: number, courseData: CourseUpdate) =>
    TE.tryCatch(
      async () => {
        // First get the existing course
        const existingCourse = await new Promise<Course | null>((resolve, reject) => {
          connection.db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
            if (err) {
              reject(err);
            } else if (row) {
              const result = CourseSchema.decode(row);
              if (result._tag === 'Right') {
                resolve(result.right);
              } else {
                reject(new Error(`Validation error: ${JSON.stringify(result.left)}`));
              }
            } else {
              resolve(null);
            }
          });
        });

        if (!existingCourse) {
          return O.none;
        }

        // Update the course
        const updatedCourse = { ...existingCourse, ...courseData };
        const updateFields = Object.keys(courseData)
          .map((key) => `${key} = ?`)
          .join(', ');
        const updateValues = Object.values(courseData);

        await new Promise<void>((resolve, reject) => {
          connection.db.run(
            `UPDATE courses SET ${updateFields} WHERE id = ?`,
            [...updateValues, id],
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });

        return O.some(updatedCourse);
      },
      (error) => new Error(`Failed to update course: ${error}`)
    ),

  updateStatus: (id: number, teacherId: number, status: 'active' | 'disabled') =>
    TE.tryCatch(
      async () => {
        // First verify the course belongs to the teacher
        const existingCourse = await new Promise<Course | null>((resolve, reject) => {
          connection.db.get('SELECT * FROM courses WHERE id = ? AND teacher_id = ?', [id, teacherId], (err, row) => {
            if (err) {
              reject(err);
            } else if (row) {
              const result = CourseSchema.decode(row);
              if (result._tag === 'Right') {
                resolve(result.right);
              } else {
                reject(new Error(`Validation error: ${JSON.stringify(result.left)}`));
              }
            } else {
              resolve(null);
            }
          });
        });

        if (!existingCourse) {
          return O.none;
        }

        // Update the status
        await new Promise<void>((resolve, reject) => {
          connection.db.run(
            'UPDATE courses SET status = ? WHERE id = ? AND teacher_id = ?',
            [status, id, teacherId],
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });

        return O.some({ ...existingCourse, status });
      },
      (error) => new Error(`Failed to update course status: ${error}`)
    ),

  delete: (id: number, teacherId: number) =>
    TE.tryCatch(
      async () => {
        return new Promise<boolean>((resolve, reject) => {
          connection.db.run('DELETE FROM courses WHERE id = ? AND teacher_id = ?', [id, teacherId], function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.changes > 0);
            }
          });
        });
      },
      (error) => new Error(`Failed to delete course: ${error}`)
    )
});
