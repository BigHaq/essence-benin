CREATE TABLE `stationStatusUpdates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stationId` int NOT NULL,
	`product` enum('essence','gasoil') NOT NULL,
	`status` enum('available','out','unknown') NOT NULL,
	`source` enum('admin','partner','user','official_api') NOT NULL,
	`note` text,
	`actorUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stationStatusUpdates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`operator` varchar(120) NOT NULL DEFAULT 'Bénin Petro',
	`city` varchar(120) NOT NULL,
	`district` varchar(160),
	`address` text,
	`phone` varchar(40),
	`latitude` varchar(32) NOT NULL,
	`longitude` varchar(32) NOT NULL,
	`essenceStatus` enum('available','out','unknown') NOT NULL DEFAULT 'unknown',
	`gasoilStatus` enum('available','out','unknown') NOT NULL DEFAULT 'unknown',
	`confidence` enum('official','partner','user','stale') NOT NULL DEFAULT 'official',
	`sourceLabel` varchar(255) NOT NULL,
	`sourceUrl` varchar(500),
	`sourceUpdatedAt` timestamp,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stations_id` PRIMARY KEY(`id`),
	CONSTRAINT `stations_sourceId_unique` UNIQUE(`sourceId`)
);
