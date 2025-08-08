import * as t from 'io-ts';

// Teacher type definition
export interface Teacher {
  id: number;
  username: string;
  email: string;
  name: string;
  background?: string;
  portrait_url?: string;
  specialties?: string[];
  created_at: string;
}

// Course type definition
export interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  instructor: string;
  price: number;
  category: string;
  created_at: string;
  teacher_id: number;
  status: 'active' | 'disabled';
}

// io-ts schema for runtime validation
export const TeacherSchema = t.type({
  id: t.number,
  username: t.string,
  email: t.string,
  name: t.string,
  background: t.union([t.string, t.undefined]),
  portrait_url: t.union([t.string, t.undefined]),
  specialties: t.union([t.array(t.string), t.undefined]),
  created_at: t.string
});

export const CourseSchema = t.type({
  id: t.number,
  title: t.string,
  description: t.string,
  image_url: t.string,
  instructor: t.string,
  price: t.number,
  category: t.string,
  created_at: t.string,
  teacher_id: t.number,
  status: t.union([t.literal('active'), t.literal('disabled')])
});

export const CourseCreateSchema = t.type({
  title: t.string,
  description: t.string,
  image_url: t.string,
  instructor: t.string,
  price: t.number,
  category: t.string,
  teacher_id: t.number
});

export const CourseUpdateSchema = t.partial({
  title: t.string,
  description: t.string,
  image_url: t.string,
  instructor: t.string,
  price: t.number,
  category: t.string,
  status: t.union([t.literal('active'), t.literal('disabled')])
});

export const TeacherLoginSchema = t.type({
  username: t.string,
  password: t.string
});

export const TeacherRegisterSchema = t.type({
  username: t.string,
  email: t.string,
  password: t.string,
  name: t.string
});

export type CourseCreate = t.TypeOf<typeof CourseCreateSchema>;
export type CourseUpdate = t.TypeOf<typeof CourseUpdateSchema>;
export type TeacherLogin = t.TypeOf<typeof TeacherLoginSchema>;
export type TeacherRegister = t.TypeOf<typeof TeacherRegisterSchema>;
