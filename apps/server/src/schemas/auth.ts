import { z } from 'zod'

export const errorSchema = z.object({ error: z.string() })

export const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    email: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const authResponseSchema = z.object({
    token: z.string(),
    user: userSchema,
})
