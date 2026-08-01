/*
  Warnings:

  - Added the required column `quantity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `sku` VARCHAR(191) NOT NULL;
