import { z } from 'zod';

export const bondCalculatorSchema = z.object({
  faceValue: z
    .number({
      required_error: 'Face value is required',
      invalid_type_error: 'Face value must be a number',
    })
    .positive('Face value must be a positive number')
    .min(1, 'Face value must be at least $1')
    .max(10_000_000, 'Face value cannot exceed $10,000,000'),

  couponRate: z
    .number({
      required_error: 'Coupon rate is required',
      invalid_type_error: 'Coupon rate must be a number',
    })
    .min(0, 'Coupon rate cannot be negative')
    .max(100, 'Coupon rate cannot exceed 100%'),

  marketPrice: z
    .number({
      required_error: 'Market price is required',
      invalid_type_error: 'Market price must be a number',
    })
    .positive('Market price must be a positive number')
    .min(0.01, 'Market price must be at least $0.01')
    .max(10_000_000, 'Market price cannot exceed $10,000,000'),

  yearsToMaturity: z
    .number({
      required_error: 'Years to maturity is required',
      invalid_type_error: 'Years to maturity must be a number',
    })
    .int('Years to maturity must be a whole number')
    .positive('Years to maturity must be a positive number')
    .min(1, 'Years to maturity must be at least 1')
    .max(100, 'Years to maturity cannot exceed 100'),

  couponFrequency: z.enum(['monthly', 'quarterly', 'semi-annual', 'annual'], {
    required_error: 'Coupon frequency is required',
    invalid_type_error: 'Invalid coupon frequency',
  }),
});

export type BondCalculatorInput = z.infer<typeof bondCalculatorSchema>;
