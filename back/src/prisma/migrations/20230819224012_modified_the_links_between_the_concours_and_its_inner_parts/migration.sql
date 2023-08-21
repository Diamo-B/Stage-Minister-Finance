/*
  Warnings:

  - You are about to alter the column `status` on the `concours` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the `_branchetoposte` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_concourstoposte` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_gradetoposte` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_postetospecialite` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `brancheId` to the `Concours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeId` to the `Concours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posteId` to the `Concours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialiteId` to the `Concours` table without a default value. This is not possible if the table is not empty.
  - Made the column `directionId` on table `concours` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_branchetoposte` DROP FOREIGN KEY `_brancheToposte_A_fkey`;

-- DropForeignKey
ALTER TABLE `_branchetoposte` DROP FOREIGN KEY `_brancheToposte_B_fkey`;

-- DropForeignKey
ALTER TABLE `_concourstoposte` DROP FOREIGN KEY `_ConcoursToposte_A_fkey`;

-- DropForeignKey
ALTER TABLE `_concourstoposte` DROP FOREIGN KEY `_ConcoursToposte_B_fkey`;

-- DropForeignKey
ALTER TABLE `_gradetoposte` DROP FOREIGN KEY `_GradeToposte_A_fkey`;

-- DropForeignKey
ALTER TABLE `_gradetoposte` DROP FOREIGN KEY `_GradeToposte_B_fkey`;

-- DropForeignKey
ALTER TABLE `_postetospecialite` DROP FOREIGN KEY `_posteTospecialite_A_fkey`;

-- DropForeignKey
ALTER TABLE `_postetospecialite` DROP FOREIGN KEY `_posteTospecialite_B_fkey`;

-- DropForeignKey
ALTER TABLE `concours` DROP FOREIGN KEY `Concours_directionId_fkey`;

-- AlterTable
ALTER TABLE `concours` ADD COLUMN `brancheId` VARCHAR(191) NOT NULL,
    ADD COLUMN `gradeId` VARCHAR(191) NOT NULL,
    ADD COLUMN `posteId` VARCHAR(191) NOT NULL,
    ADD COLUMN `specialiteId` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('Disabled', 'enabled', 'ended') NOT NULL DEFAULT 'enabled',
    MODIFY `directionId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_branchetoposte`;

-- DropTable
DROP TABLE `_concourstoposte`;

-- DropTable
DROP TABLE `_gradetoposte`;

-- DropTable
DROP TABLE `_postetospecialite`;

-- AddForeignKey
ALTER TABLE `Concours` ADD CONSTRAINT `Concours_directionId_fkey` FOREIGN KEY (`directionId`) REFERENCES `direction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Concours` ADD CONSTRAINT `Concours_posteId_fkey` FOREIGN KEY (`posteId`) REFERENCES `poste`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Concours` ADD CONSTRAINT `Concours_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Concours` ADD CONSTRAINT `Concours_specialiteId_fkey` FOREIGN KEY (`specialiteId`) REFERENCES `specialite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Concours` ADD CONSTRAINT `Concours_brancheId_fkey` FOREIGN KEY (`brancheId`) REFERENCES `branche`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
