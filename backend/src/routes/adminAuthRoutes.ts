import { Router } from 'express';
import { AdminAuthController } from '../controllers/adminAuthController';

export const createAdminAuthRoutes = (controller: AdminAuthController) => {
  const router = Router();

  router.post('/login', controller.login);

  return router;
};


