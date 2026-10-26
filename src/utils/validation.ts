import { z } from 'zod';

export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  roleId: z.string().uuid('roleId must be a valid UUID'),
});

export const UserAuthenticateSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const UserUpdateSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .optional(),
  roleId: z.string().uuid('roleId must be a valid UUID').optional(),
});

export type UserCreateInput = z.infer<typeof UserCreateSchema>;
export type UserAuthenticateInput = z.infer<typeof UserAuthenticateSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;
