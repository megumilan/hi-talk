import cors from 'cors'
import express from 'express'
import { z } from 'zod'
import { Application } from 'express-zod'
import { openapi } from '@express-zod/openapi'

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
                200: z.object({ status: z.literal('ok') }),
            },
            meta: { summary: 'Health check' },
        },
        (_req, res) => {
            res.json({ status: 'ok' })
        }
    )

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
