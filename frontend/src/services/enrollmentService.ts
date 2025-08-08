import { api } from './api';

export interface EnrollmentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  agreeToTerms: boolean;
  courseId: number;
}

export interface PaymentData {
  enrollmentId: string;
  amount: number;
  paymentMethod: string;
  reference: string;
}

export const enrollmentService = {
  // Create enrollment
  async createEnrollment(data: EnrollmentData): Promise<any> {
    try {
      const response = await api.post('/enrollments', {
        course_id: data.courseId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company || undefined,
        agree_to_terms: data.agreeToTerms
      });

      return response.data.data;
    } catch (error) {
      console.error('Enrollment creation error:', error);
      throw new Error('Failed to create enrollment');
    }
  },

  // Process payment
  async processPayment(data: PaymentData): Promise<any> {
    try {
      const response = await api.post('/payments', {
        enrollment_id: data.enrollmentId,
        amount: data.amount,
        payment_method: data.paymentMethod,
        reference: data.reference
      });

      return response.data.data;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw new Error('Payment processing failed');
    }
  },

  // Complete payment
  async completePayment(paymentId: string, transactionId: string): Promise<any> {
    try {
      const response = await api.post(`/payments/${paymentId}/complete`, {
        transactionId
      });

      return response.data.data;
    } catch (error) {
      console.error('Payment completion error:', error);
      throw new Error('Payment completion failed');
    }
  },

  // Get enrollment by ID
  async getEnrollment(id: string): Promise<any> {
    try {
      const response = await api.get(`/enrollments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Get enrollment error:', error);
      throw new Error('Failed to get enrollment');
    }
  },

  // Get user enrollments
  async getUserEnrollments(email: string): Promise<any[]> {
    try {
      const response = await api.get(`/enrollments/email/${encodeURIComponent(email)}`);
      return response.data.data;
    } catch (error) {
      console.error('Get user enrollments error:', error);
      throw new Error('Failed to get user enrollments');
    }
  },

  // Get payment by ID
  async getPayment(id: string): Promise<any> {
    try {
      const response = await api.get(`/payments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Get payment error:', error);
      throw new Error('Failed to get payment');
    }
  }
};
