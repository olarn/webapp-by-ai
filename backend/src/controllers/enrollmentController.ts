import { Request, Response } from 'express';
import { EnrollmentService } from '../services/enrollmentService';
import {
  CreateEnrollmentRequestSchema,
  CreatePaymentRequestSchema
} from '../types/enrollment';
import type { CreateEnrollmentRequest, CreatePaymentRequest } from '../types/enrollment';

export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) { }

  // Create enrollment
  createEnrollment = async (req: Request, res: Response): Promise<void> => {
    try {
      const validationResult = CreateEnrollmentRequestSchema.decode(req.body);
      if (validationResult._tag === 'Left') {
        res.status(400).json({
          success: false,
          message: `Validation error: ${JSON.stringify(validationResult.left)}`,
          data: null
        });
        return;
      }

      const enrollment = await this.enrollmentService.createEnrollment(validationResult.right)();
      if (enrollment._tag === 'Left') {
        console.error('Enrollment creation error:', enrollment.left);
        res.status(400).json({
          success: false,
          message: enrollment.left.message,
          data: null
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Enrollment created successfully',
        data: enrollment.right
      });
    } catch (error) {
      console.error('Enrollment creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  // Get enrollment by ID
  getEnrollmentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const enrollment = await this.enrollmentService.getEnrollmentById(id)();

      if (enrollment._tag === 'Left') {
        console.error('Get enrollment error:', enrollment.left);
        res.status(400).json({
          success: false,
          message: enrollment.left.message,
          data: null
        });
        return;
      }

      if (!enrollment.right) {
        res.status(404).json({
          success: false,
          message: 'Enrollment not found',
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Enrollment retrieved successfully',
        data: enrollment.right
      });
    } catch (error) {
      console.error('Get enrollment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  // Get enrollments by email
  getEnrollmentsByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.params;
      const enrollments = await this.enrollmentService.getEnrollmentsByEmail(email)();

      if (enrollments._tag === 'Left') {
        console.error('Get enrollments by email error:', enrollments.left);
        res.status(400).json({
          success: false,
          message: enrollments.left.message,
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Enrollments retrieved successfully',
        data: enrollments.right
      });
    } catch (error) {
      console.error('Get enrollments by email error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  // Get enrollments by course ID
  getEnrollmentsByCourseId = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = parseInt(req.params.courseId);

      if (isNaN(courseId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course ID',
          data: null
        });
        return;
      }

      const enrollments = await this.enrollmentService.getEnrollmentsByCourseId(courseId)();

      if (enrollments._tag === 'Left') {
        console.error('Get enrollments by course error:', enrollments.left);
        res.status(400).json({
          success: false,
          message: enrollments.left.message,
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Enrollments retrieved successfully',
        data: enrollments.right
      });
    } catch (error) {
      console.error('Get enrollments by course error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  // Get all enrollments
  getAllEnrollments = async (req: Request, res: Response): Promise<void> => {
    try {
      const enrollments = await this.enrollmentService.getAllEnrollments()();

      if (enrollments._tag === 'Left') {
        console.error('Get all enrollments error:', enrollments.left);
        res.status(400).json({
          success: false,
          message: enrollments.left.message,
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Enrollments retrieved successfully',
        data: enrollments.right
      });
    } catch (error) {
      console.error('Get all enrollments error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  // Create payment
  createPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const validationResult = CreatePaymentRequestSchema.decode(req.body);
      if (validationResult._tag === 'Left') {
        res.status(400).json({
          success: false,
          message: `Validation error: ${JSON.stringify(validationResult.left)}`,
          data: null
        });
        return;
      }

      const payment = await this.enrollmentService.createPayment(validationResult.right)();
      if (payment._tag === 'Left') {
        console.error('Payment creation error:', payment.left);
        res.status(400).json({
          success: false,
          message: payment.left.message,
          data: null
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment.right
      });
    } catch (error) {
      console.error('Payment creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  // Complete payment
  completePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentId } = req.params;
      const { transactionId } = req.body;

      if (!transactionId) {
        res.status(400).json({
          success: false,
          message: 'Transaction ID is required',
          data: null
        });
        return;
      }

      const result = await this.enrollmentService.completePayment(paymentId, transactionId)();
      if (result._tag === 'Left') {
        console.error('Payment completion error:', result.left);
        res.status(400).json({
          success: false,
          message: result.left.message,
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment completed successfully',
        data: { paymentId, transactionId }
      });
    } catch (error) {
      console.error('Payment completion error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  // Get payment by ID
  getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const payment = await this.enrollmentService.getPaymentById(id)();

      if (payment._tag === 'Left') {
        console.error('Get payment error:', payment.left);
        res.status(400).json({
          success: false,
          message: payment.left.message,
          data: null
        });
        return;
      }

      if (!payment.right) {
        res.status(404).json({
          success: false,
          message: 'Payment not found',
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment retrieved successfully',
        data: payment.right
      });
    } catch (error) {
      console.error('Get payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  // Get payments by enrollment ID
  getPaymentsByEnrollmentId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { enrollmentId } = req.params;
      const payments = await this.enrollmentService.getPaymentsByEnrollmentId(enrollmentId)();

      if (payments._tag === 'Left') {
        console.error('Get payments by enrollment error:', payments.left);
        res.status(400).json({
          success: false,
          message: payments.left.message,
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payments retrieved successfully',
        data: payments.right
      });
    } catch (error) {
      console.error('Get payments by enrollment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  // Get all payments
  getAllPayments = async (req: Request, res: Response): Promise<void> => {
    try {
      const payments = await this.enrollmentService.getAllPayments()();

      if (payments._tag === 'Left') {
        console.error('Get all payments error:', payments.left);
        res.status(400).json({
          success: false,
          message: payments.left.message,
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payments retrieved successfully',
        data: payments.right
      });
    } catch (error) {
      console.error('Get all payments error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };

  // Get payment statistics
  getPaymentStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.enrollmentService.getPaymentStats()();

      if (stats._tag === 'Left') {
        console.error('Get payment stats error:', stats.left);
        res.status(400).json({
          success: false,
          message: stats.left.message,
          data: null
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Payment statistics retrieved successfully',
        data: stats.right
      });
    } catch (error) {
      console.error('Get payment stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };
}
