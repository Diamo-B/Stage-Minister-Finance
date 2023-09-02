-- AlterTable
ALTER TABLE `candidat` ADD COLUMN `status` ENUM('None', 'Verified', 'Registred', 'Active') NOT NULL DEFAULT 'None';
