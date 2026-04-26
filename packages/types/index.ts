import { z } from 'zod';

// --- Base User Schema ---
export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().optional(),
  password: z.string().min(8), // Only handled on the backend
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// --- Safe User Schema (For Frontend) ---
// We OMIT the password to ensure it NEVER reaches the client
export const SafeUserSchema = UserSchema.omit({ password: true });

// --- API Response Wrapper ---
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    status: z.number(),
  });

// --- TypeScript Types (Derived from Zod) ---
export type User = z.infer<typeof UserSchema>;
export type SafeUser = z.infer<typeof SafeUserSchema>;

// Example of a Paginated Response type
export type UserResponse = z.infer<ReturnType<typeof ApiResponseSchema<typeof SafeUserSchema>>>;

export * from './products';
export * from './inventory';
export * from './scans';
