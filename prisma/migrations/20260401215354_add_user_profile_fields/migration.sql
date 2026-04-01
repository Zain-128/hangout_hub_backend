-- AlterTable
ALTER TABLE `User` ADD COLUMN `bio` VARCHAR(191) NULL,
    ADD COLUMN `eventsOfInterest` VARCHAR(191) NULL,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL;
