
import { z } from 'zod';

// Executive roles with Guest option
export const EXECUTIVE_ROLES = [
  'CEO',
  'CTO', 
  'CFO',
  'COO',
  'VP of Engineering',
  'VP of Sales',
  'VP of Marketing',
  'Director',
  'Manager',
  'Senior Associate',
  'Associate',
  'Guest'
] as const;

export type ExecutiveRole = typeof EXECUTIVE_ROLES[number];

// Organization validation schema
export const organizationSchema = z.object({
  name: z.string()
    .min(1, 'Organization name is required')
    .max(100, 'Organization name must be less than 100 characters')
    .refine(val => val.trim().length > 0, 'Organization name cannot be empty'),
  founding_year: z.number()
    .int('Founding year must be a whole number')
    .min(1800, 'Founding year cannot be before 1800')
    .max(new Date().getFullYear(), 'Founding year cannot be in the future')
    .optional(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
});

// User info validation schema
export const userInfoSchema = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .max(50, 'Full name must be less than 50 characters')
    .refine(val => val.trim().length > 0, 'Full name cannot be empty'),
  executiveRole: z.enum(EXECUTIVE_ROLES, {
    errorMap: () => ({ message: 'Please select a valid executive role' })
  })
});

// Organization code validation schema
export const orgCodeSchema = z.string()
  .min(1, 'Organization code is required')
  .refine(val => val.trim().length > 0, 'Organization code cannot be empty');

export type OrganizationData = z.infer<typeof organizationSchema>;
export type UserInfoData = z.infer<typeof userInfoSchema>;
