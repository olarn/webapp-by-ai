import { Router } from 'express';
import { CourseController } from '../controllers/courseController';

export const createCourseRoutes = (courseController: CourseController): Router => {
  const router = Router();

  // Public routes
  // GET /api/courses - Get all courses
  router.get('/', courseController.getAllCourses);

  // GET /api/courses/active - Get active courses only
  router.get('/active', courseController.getActiveCourses);

  // GET /api/courses/:id - Get course by ID
  router.get('/:id', courseController.getCourseById);

  // Teacher routes
  // GET /api/courses/teacher/courses - Get teacher's courses
  router.get('/teacher/courses', courseController.getTeacherCourses);

  // GET /api/courses/teacher/search - Search teacher's courses
  router.get('/teacher/search', courseController.searchTeacherCourses);

  // POST /api/courses - Create new course
  router.post('/', courseController.createCourse);

  // PUT /api/courses/:id - Update course
  router.put('/:id', courseController.updateCourse);

  // PATCH /api/courses/:id/status - Update course status
  router.patch('/:id/status', courseController.updateCourseStatus);

  // DELETE /api/courses/:id - Delete course
  router.delete('/:id', courseController.deleteCourse);

  return router;
};
