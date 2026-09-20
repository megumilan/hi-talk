import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

const url = process.env.DATABASE_URL
if (!url) {
    throw new Error('DATABASE_URL is not set')
}

export const connection = await mysql.createConnection(url)
export const db = drizzle({ client: connection })
