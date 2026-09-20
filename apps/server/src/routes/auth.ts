import { eq, or } from 'drizzle-orm'
import { Router } from 'express-zod'
import { db } from '../db/index.js'
import { userProfiles, users } from '../db/schema.js'
import { hashPassword, verifyPassword } from '../auth/password.js'
import { signToken } from '../auth/token.js'
import { authResponseSchema, errorSchema } from '../schemas/auth.js'
import z from 'zod'

const registerBody = z.object({
    username: z.string().min(1).max(255),
    email: z.email(),
    password: z.string().min(8).max(72),
})

const loginBody = z.object({
    email: z.email(),
    password: z.string(),
})

async function userAlreadyExists(username: string, email: string) {
    const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(or(eq(users.username, username), eq(users.email, email)))
        .limit(1)
    return existing.length > 0
}

export const authRouter = new Router({ prefix: '/auth' })
    .post(
        '/register',
        {
            body: registerBody,
            responses: {
                201: authResponseSchema,
                400: errorSchema,
                409: errorSchema,
            },
            meta: { summary: 'Register a new user' },
        },
        async (req, res) => {
            if (await userAlreadyExists(req.body.username, req.body.email)) {
                res.status(409).json({
                    error: 'Username or email already registered',
                })
                return
            }

            const passwordHash = await hashPassword(req.body.password)
            const now = new Date()
            const [inserted] = await db
                .insert(users)
                .values({
                    username: req.body.username,
                    email: req.body.email,
                    password: passwordHash,
                    createdAt: now,
                    updatedAt: now,
                })
                .$returningId()

            await db.insert(userProfiles).values({ userId: inserted.id })

            res.status(201).json({
                token: signToken(inserted.id),
                user: {
                    id: inserted.id,
                    username: req.body.username,
                    email: req.body.email,
                    createdAt: now,
                    updatedAt: now,
                },
            })
        }
    )
    .post(
        '/login',
        {
            body: loginBody,
            responses: {
                200: authResponseSchema,
                400: errorSchema,
                401: errorSchema,
            },
            meta: { summary: 'Log in with email and password' },
        },
        async (req, res) => {
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.email, req.body.email))
                .limit(1)
            if (!user) {
                res.status(401).json({ error: 'Invalid credentials' })
                return
            }

            const verified = await verifyPassword(
                req.body.password,
                user.password
            )
            if (!verified) {
                res.status(401).json({ error: 'Invalid credentials' })
                return
            }

            res.json({
                token: signToken(user.id),
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            })
        }
    )
