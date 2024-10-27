import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  completed: z.boolean().optional(),
})

export type TodoValidationSchema = z.infer<typeof todoSchema>

export const todoInputSchema = todoSchema.omit({ id: true })

export type TodoInputValidationSchema = z.infer<typeof todoInputSchema>