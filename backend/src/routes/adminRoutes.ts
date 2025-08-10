import { Router } from 'express';
import { AdminController } from '../controllers/adminController';

export const createAdminRoutes = (controller: AdminController) => {
  const router = Router();

  // Overview stats
  router.get('/overview', controller.getOverview);

  return router;
};


