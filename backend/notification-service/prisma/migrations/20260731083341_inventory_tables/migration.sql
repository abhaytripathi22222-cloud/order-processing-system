/*
  Warnings:

  - You are about to drop the column `productId` on the `Inventory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sku` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Inventory` DROP COLUMN `productId`,
    ADD COLUMN `sku` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Reservation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `orderNumber` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Inventory_sku_key` ON `Inventory`(`sku`);
