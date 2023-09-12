/*
  Warnings:

  - You are about to drop the column `data_base64` on the `attachment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attachment` DROP COLUMN `data_base64`,
    ADD COLUMN `file_data` LONGBLOB NULL;
