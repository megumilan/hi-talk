import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { Application } from 'express-zod'
import { openapi } from '@express-zod/openapi'
import { db } from './db/index.js'

const port = Number(process.env.PORT ?? 3000)

const docs = openapi({
    openapi: '3.0.1',
    info: {
        title: 'HiTalk API',
        version: '0.0.1',
    },
})

const app = new Application()
    .use(cors())
    .use(express.json())
    .use(docs)
    .get(
        '/health',
        {
            responses: {
                200: z.object({ status: z.literal('ok'), db: z.literal('up') }),
                503: z.object({
                    status: z.literal('degraded'),
                    db: z.literal('down'),
                    error: z.string(),
                }),
            },
            meta: { summary: 'Health check' },
        },
        async (_req, res) => {
            try {
                await db.execute(sql`SELECT 1`)
                res.json({ status: 'ok', db: 'up' })
            } catch (error) {
                res.status(503).json({
                    status: 'degraded',
                    db: 'down',
                    error: (error as Error).message,
                })
            }
        }
    )

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
