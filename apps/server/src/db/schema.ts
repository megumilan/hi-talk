import { char, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core'
import { createId } from '@paralleldrive/cuid2'

export const users = mysqlTable('users', {
    id: char('id', { length: 24 })
        .primaryKey()
        .$defaultFn(() => createId()),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})
