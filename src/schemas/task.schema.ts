import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'DONE']).optional(),
  }),
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid task ID format'),
  }),
});