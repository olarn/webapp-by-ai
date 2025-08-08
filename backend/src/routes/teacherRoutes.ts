import { Router } from 'express';
import { TeacherController } from '../controllers/teacherController';

export const createTeacherRoutes = (teacherController: TeacherController): Router => {
  const router = Router();

  // POST /api/teachers/register - Register new teacher
  router.post('/register', teacherController.register);

  // POST /api/teachers/login - Teacher login
  router.post('/login', teacherController.login);

  // GET /api/teachers/:id - Get teacher by ID
  router.get('/:id', teacherController.getTeacherById);

  return router;
};
