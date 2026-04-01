/*
  Warnings:

  - You are about to drop the column `userId` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `email` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Otp` DROP FOREIGN KEY `Otp_userId_fkey`;

-- DropIndex
DROP INDEX `Otp_userId_fkey` ON `Otp`;

-- AlterTable
ALTER TABLE `Otp` DROP COLUMN `userId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;
