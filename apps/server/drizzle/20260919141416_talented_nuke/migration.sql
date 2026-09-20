CREATE TABLE `user_profiles` (
	`id` char(24) PRIMARY KEY,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`user_id` char(24) NOT NULL,
	`avatar_url` varchar(1024),
	`region` varchar(255),
	`gender` enum('male','female','other'),
	`bio` varchar(500),
	CONSTRAINT `user_id_unique` UNIQUE INDEX(`user_id`),
	CONSTRAINT `user_profiles_user_id_users_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `name` TO `username`;--> statement-breakpoint
CREATE UNIQUE INDEX `username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE INDEX `user_profiles_user_idx` ON `user_profiles` (`user_id`);