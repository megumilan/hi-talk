import {
    char,
    index,
    json,
    mysqlEnum,
    mysqlTable,
    timestamp,
    uniqueIndex,
    varchar,
} from 'drizzle-orm/mysql-core'
import { commonFields } from './common.js'

export const users = mysqlTable('users', {
    ...commonFields,
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
})

export const userProfiles = mysqlTable(
    'user_profiles',
    {
        ...commonFields,
        userId: char('user_id', { length: 24 })
            .notNull()
            .unique()
            .references(() => users.id, { onDelete: 'cascade' }),
        avatarUrl: varchar('avatar_url', { length: 1024 }),
        region: varchar('region', { length: 255 }),
        gender: mysqlEnum('gender', ['male', 'female', 'other']),
        bio: varchar('bio', { length: 500 }),
    },
    (table) => [index('user_profiles_user_idx').on(table.userId)]
)

export const friendships = mysqlTable(
    'friendships',
    {
        ...commonFields,
        userId: char('user_id', { length: 24 })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        friendId: char('friend_id', { length: 24 })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        requesterId: char('requester_id', { length: 24 })
            .notNull()
            .references(() => users.id),
        status: mysqlEnum('status', ['pending', 'accepted', 'blocked'])
            .default('pending')
            .notNull(),
    },
    (table) => [
        uniqueIndex('friendships_pair_unique').on(table.userId, table.friendId),
        index('friendships_user_idx').on(table.userId),
        index('friendships_friend_idx').on(table.friendId),
    ]
)

export const conversations = mysqlTable(
    'conversations',
    {
        ...commonFields,
        type: mysqlEnum('type', ['private', 'group'])
            .default('private')
            .notNull(),
        name: varchar('name', { length: 255 }),
        avatarUrl: varchar('avatar_url', { length: 1024 }),
        ownerId: char('owner_id', { length: 24 }).references(() => users.id, {
            onDelete: 'set null',
        }),
        lastMessageId: char('last_message_id', { length: 24 }),
        lastMessageAt: timestamp('last_message_at'),
    },
    (table) => [index('conversations_updated_idx').on(table.updatedAt)]
)

export const conversationMembers = mysqlTable(
    'conversation_members',
    {
        ...commonFields,
        conversationId: char('conversation_id', { length: 24 })
            .notNull()
            .references(() => conversations.id, { onDelete: 'cascade' }),
        userId: char('user_id', { length: 24 })
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        lastReadMessageId: char('last_read_message_id', { length: 24 }),
    },
    (table) => [
        uniqueIndex('conversation_members_pair_unique').on(
            table.conversationId,
            table.userId
        ),
        index('conversation_members_user_idx').on(table.userId),
    ]
)

export const messages = mysqlTable(
    'messages',
    {
        ...commonFields,
        conversationId: char('conversation_id', { length: 24 })
            .notNull()
            .references(() => conversations.id, { onDelete: 'cascade' }),
        senderId: char('sender_id', { length: 24 })
            .notNull()
            .references(() => users.id),
        type: mysqlEnum('type', [
            'text',
            'image',
            'video',
            'audio',
            'file',
            'location',
            'system',
        ])
            .default('text')
            .notNull(),
        content: json('content').notNull(),
        replyToMessageId: char('reply_to_message_id', { length: 24 }),
    },
    (table) => [
        index('messages_conversation_idx').on(table.conversationId),
        index('messages_sender_idx').on(table.senderId),
    ]
)
