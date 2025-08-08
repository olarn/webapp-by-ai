import axios from 'axios';
import type {
  Course,
  CourseCreate,
  CourseUpdate,
  Teacher,
  TeacherLogin,
  TeacherRegister,
  ApiResponse
} from '../types/course';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add teacher ID to requests when available
api.interceptors.request.use((config) => {
  const teacherId = localStorage.getItem('teacherId');
  if (teacherId) {
    config.headers['x-teacher-id'] = teacherId;
  }
  return config;
});

export const courseApi = {
  async getAllCourses(): Promise<Course[]> {
    try {
      const response = await api.get<ApiResponse<Course[]>>('/courses');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses');
    }
  },

  async getActiveCourses(): Promise<Course[]> {
    try {
      const response = await api.get<ApiResponse<Course[]>>('/courses/active');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching active courses:', error);
      throw new Error('Failed to fetch active courses');
    }
  },

  async getCourseById(id: number): Promise<Course> {
    try {
      const response = await api.get<ApiResponse<Course>>(`/courses/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course');
    }
  },

  async getTeacherCourses(): Promise<Course[]> {
    try {
      const response = await api.get<ApiResponse<Course[]>>('/courses/teacher/courses');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      throw new Error('Failed to fetch teacher courses');
    }
  },

  async searchTeacherCourses(keyword: string): Promise<Course[]> {
    try {
      const response = await api.get<ApiResponse<Course[]>>('/courses/teacher/search', {
        params: { keyword }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching teacher courses:', error);
      throw new Error('Failed to search teacher courses');
    }
  },

  async createCourse(course: CourseCreate): Promise<Course> {
    try {
      const response = await api.post<ApiResponse<Course>>('/courses', course);
      return response.data.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course');
    }
  },

  async updateCourse(id: number, course: CourseUpdate): Promise<Course> {
    try {
      const response = await api.put<ApiResponse<Course>>(`/courses/${id}`, course);
      return response.data.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Failed to update course');
    }
  },

  async updateCourseStatus(id: number, status: 'active' | 'disabled'): Promise<Course> {
    try {
      const response = await api.patch<ApiResponse<Course>>(`/courses/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating course status:', error);
      throw new Error('Failed to update course status');
    }
  },

  async deleteCourse(id: number): Promise<boolean> {
    try {
      const response = await api.delete<ApiResponse<{ deleted: boolean }>>(`/courses/${id}`);
      return response.data.data.deleted;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw new Error('Failed to delete course');
    }
  },
};

export const teacherApi = {
  async login(credentials: TeacherLogin): Promise<Teacher> {
    try {
      const response = await api.post<ApiResponse<Teacher>>('/teachers/login', credentials);
      return response.data.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Invalid credentials');
    }
  },

  async register(teacherData: TeacherRegister): Promise<Teacher> {
    try {
      const response = await api.post<ApiResponse<Teacher>>('/teachers/register', teacherData);
      return response.data.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw new Error('Failed to register teacher');
    }
  },

  async getTeacherById(id: number): Promise<Teacher> {
    try {
      const response = await api.get<ApiResponse<Teacher>>(`/teachers/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching teacher:', error);
      throw new Error('Failed to fetch teacher');
    }
  },
};
