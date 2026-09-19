import { char, timestamp } from 'drizzle-orm/mysql-core'
import { createId } from '@paralleldrive/cuid2'

export const commonFields = {
    id: char('id', { length: 24 })
        .primaryKey()
        .$defaultFn(() => createId()),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().onUpdateNow(),
}
