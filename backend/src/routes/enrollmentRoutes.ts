import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollmentController';

export const createEnrollmentRoutes = (enrollmentController: EnrollmentController): Router => {
  const router = Router();

  // Enrollment routes
  router.post('/enrollments', enrollmentController.createEnrollment);
  router.get('/enrollments', enrollmentController.getAllEnrollments);
  router.get('/enrollments/:id', enrollmentController.getEnrollmentById);
  router.get('/enrollments/email/:email', enrollmentController.getEnrollmentsByEmail);
  router.get('/enrollments/course/:courseId', enrollmentController.getEnrollmentsByCourseId);

  // Payment routes
  router.post('/payments', enrollmentController.createPayment);
  router.get('/payments', enrollmentController.getAllPayments);
  router.get('/payments/:id', enrollmentController.getPaymentById);
  router.get('/payments/enrollment/:enrollmentId', enrollmentController.getPaymentsByEnrollmentId);
  router.post('/payments/:paymentId/complete', enrollmentController.completePayment);
  router.get('/payments/stats/overview', enrollmentController.getPaymentStats);

  return router;
};
