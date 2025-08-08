import * as t from 'io-ts';

// Enrollment types
export interface Enrollment {
  id?: number;
  enrollment_id: string;
  course_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  agree_to_terms: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface CreateEnrollmentRequest {
  course_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  agree_to_terms: boolean;
}

// Payment types
export interface Payment {
  id?: number;
  payment_id: string;
  enrollment_id: string;
  amount: number;
  payment_method: string;
  reference: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at?: string;
  completed_at?: string;
}

export interface CreatePaymentRequest {
  enrollment_id: string;
  amount: number;
  payment_method: string;
  reference: string;
}

// Validation schemas
export const CreateEnrollmentRequestSchema = t.type({
  course_id: t.number,
  first_name: t.string,
  last_name: t.string,
  email: t.string,
  phone: t.union([t.string, t.undefined]),
  company: t.union([t.string, t.undefined]),
  agree_to_terms: t.boolean
});

export const CreatePaymentRequestSchema = t.type({
  enrollment_id: t.string,
  amount: t.number,
  payment_method: t.string,
  reference: t.string
});

export const EnrollmentSchema = t.type({
  id: t.union([t.number, t.undefined]),
  enrollment_id: t.string,
  course_id: t.number,
  first_name: t.string,
  last_name: t.string,
  email: t.string,
  phone: t.union([t.string, t.undefined]),
  company: t.union([t.string, t.undefined]),
  agree_to_terms: t.boolean,
  status: t.union([t.literal('pending'), t.literal('confirmed'), t.literal('cancelled')]),
  created_at: t.union([t.string, t.undefined]),
  updated_at: t.union([t.string, t.undefined])
});

export const PaymentSchema = t.type({
  id: t.union([t.number, t.undefined]),
  payment_id: t.string,
  enrollment_id: t.string,
  amount: t.number,
  payment_method: t.string,
  reference: t.string,
  transaction_id: t.union([t.string, t.undefined]),
  status: t.union([t.literal('pending'), t.literal('completed'), t.literal('failed'), t.literal('refunded')]),
  created_at: t.union([t.string, t.undefined]),
  completed_at: t.union([t.string, t.undefined])
});
