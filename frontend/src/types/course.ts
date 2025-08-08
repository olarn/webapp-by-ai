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

export interface CourseCreate {
  title: string;
  description: string;
  image_url: string;
  instructor: string;
  price: number;
  category: string;
  teacher_id: number;
}

export interface CourseUpdate {
  title?: string;
  description?: string;
  image_url?: string;
  instructor?: string;
  price?: number;
  category?: string;
  status?: 'active' | 'disabled';
}

export interface TeacherLogin {
  username: string;
  password: string;
}

export interface TeacherRegister {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
