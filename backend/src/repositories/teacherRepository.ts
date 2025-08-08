import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { Teacher, TeacherLogin, TeacherRegister } from '../types/course';

export interface TeacherRepository {
  findById: (id: number) => TE.TaskEither<Error, O.Option<Teacher>>;
  findByUsername: (username: string) => TE.TaskEither<Error, O.Option<Teacher>>;
  findByEmail: (email: string) => TE.TaskEither<Error, O.Option<Teacher>>;
  create: (teacher: TeacherRegister) => TE.TaskEither<Error, Teacher>;
  authenticate: (credentials: TeacherLogin) => TE.TaskEither<Error, O.Option<Teacher>>;
}

// In-memory implementation for development
export const createInMemoryTeacherRepository = (): TeacherRepository => {
  const teachers: Teacher[] = [
    {
      id: 1,
      username: 'teacher1',
      email: 'teacher1@example.com',
      name: 'John Doe',
      background: 'Dr. John Doe is a senior software engineer with over 10 years of experience in functional programming and software architecture. He has worked at leading tech companies and has published several papers on functional programming patterns.',
      portrait_url: '/images/teacher-john-doe.jpg',
      specialties: ['Functional Programming', 'Software Architecture', 'Haskell', 'Scala'],
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      username: 'teacher2',
      email: 'teacher2@example.com',
      name: 'Jane Smith',
      background: 'Prof. Jane Smith is an expert in object-oriented programming and design patterns. She has taught at prestigious universities and has authored multiple books on OOP best practices.',
      portrait_url: '/images/teacher-jane-smith.jpg',
      specialties: ['Object-Oriented Programming', 'Design Patterns', 'Java', 'C++'],
      created_at: new Date().toISOString()
    }
  ];

  return {
    findById: (id: number) =>
      TE.tryCatch(
        async () => {
          const teacher = teachers.find(t => t.id === id);
          return O.fromNullable(teacher);
        },
        (error) => new Error(`Failed to find teacher by ID: ${error}`)
      ),

    findByUsername: (username: string) =>
      TE.tryCatch(
        async () => {
          const teacher = teachers.find(t => t.username === username);
          return O.fromNullable(teacher);
        },
        (error) => new Error(`Failed to find teacher by username: ${error}`)
      ),

    findByEmail: (email: string) =>
      TE.tryCatch(
        async () => {
          const teacher = teachers.find(t => t.email === email);
          return O.fromNullable(teacher);
        },
        (error) => new Error(`Failed to find teacher by email: ${error}`)
      ),

    create: (teacherData: TeacherRegister) =>
      TE.tryCatch(
        async () => {
          const newTeacher: Teacher = {
            id: teachers.length + 1,
            username: teacherData.username,
            email: teacherData.email,
            name: teacherData.name,
            created_at: new Date().toISOString()
          };
          teachers.push(newTeacher);
          return newTeacher;
        },
        (error) => new Error(`Failed to create teacher: ${error}`)
      ),

    authenticate: (credentials: TeacherLogin) =>
      TE.tryCatch(
        async () => {
          // In a real implementation, you would hash the password and compare
          const teacher = teachers.find(t => t.username === credentials.username);
          return O.fromNullable(teacher);
        },
        (error) => new Error(`Failed to authenticate teacher: ${error}`)
      )
  };
};
