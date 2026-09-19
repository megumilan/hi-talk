import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema.js'

const url = process.env.DATABASE_URL ?? 'mysql://root@localhost:3306/hitalk'

export const pool = mysql.createPool(url)
export const db = drizzle(pool, { schema, mode: 'default' })
