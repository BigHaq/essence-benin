ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','partner') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `stationId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `accessExpiresAt` timestamp;