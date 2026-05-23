import { z } from 'zod';

/**
 * POST /api/payments/create-order
 */
export const createOrderSchema = z.object({
  proposalId: z
    .string({ required_error: 'proposalId is required' })
    .min(1, 'proposalId cannot be empty'),
});

/**
 * POST /api/payments/verify-payment
 */
export const verifyPaymentSchema = z.object({
  razorpay_order_id: z
    .string({ required_error: 'razorpay_order_id is required' })
    .min(1, 'razorpay_order_id cannot be empty'),
  razorpay_payment_id: z
    .string({ required_error: 'razorpay_payment_id is required' })
    .min(1, 'razorpay_payment_id cannot be empty'),
  razorpay_signature: z
    .string({ required_error: 'razorpay_signature is required' })
    .min(1, 'razorpay_signature cannot be empty'),
  proposalId: z
    .string({ required_error: 'proposalId is required' })
    .min(1, 'proposalId cannot be empty'),
  feedback: z.string().optional(),
});
