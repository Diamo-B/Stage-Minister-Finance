/*
  Warnings:

  - You are about to drop the `_branchetojob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_concourstojob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_gradetojob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_jobtospecialite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_branchetojob` DROP FOREIGN KEY `_brancheTojob_A_fkey`;

-- DropForeignKey
ALTER TABLE `_branchetojob` DROP FOREIGN KEY `_brancheTojob_B_fkey`;

-- DropForeignKey
ALTER TABLE `_concourstojob` DROP FOREIGN KEY `_ConcoursTojob_A_fkey`;

-- DropForeignKey
ALTER TABLE `_concourstojob` DROP FOREIGN KEY `_ConcoursTojob_B_fkey`;

-- DropForeignKey
ALTER TABLE `_gradetojob` DROP FOREIGN KEY `_GradeTojob_A_fkey`;

-- DropForeignKey
ALTER TABLE `_gradetojob` DROP FOREIGN KEY `_GradeTojob_B_fkey`;

-- DropForeignKey
ALTER TABLE `_jobtospecialite` DROP FOREIGN KEY `_jobTospecialite_A_fkey`;

-- DropForeignKey
ALTER TABLE `_jobtospecialite` DROP FOREIGN KEY `_jobTospecialite_B_fkey`;

-- AlterTable
ALTER TABLE `attachment` ADD COLUMN `data_base64` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ville` ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE `_branchetojob`;

-- DropTable
DROP TABLE `_concourstojob`;

-- DropTable
DROP TABLE `_gradetojob`;

-- DropTable
DROP TABLE `_jobtospecialite`;

-- DropTable
DROP TABLE `job`;

-- CreateTable
CREATE TABLE `poste` (
    `id` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ConcoursToposte` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ConcoursToposte_AB_unique`(`A`, `B`),
    INDEX `_ConcoursToposte_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_posteTospecialite` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_posteTospecialite_AB_unique`(`A`, `B`),
    INDEX `_posteTospecialite_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GradeToposte` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_GradeToposte_AB_unique`(`A`, `B`),
    INDEX `_GradeToposte_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_brancheToposte` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_brancheToposte_AB_unique`(`A`, `B`),
    INDEX `_brancheToposte_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ConcoursToposte` ADD CONSTRAINT `_ConcoursToposte_A_fkey` FOREIGN KEY (`A`) REFERENCES `Concours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConcoursToposte` ADD CONSTRAINT `_ConcoursToposte_B_fkey` FOREIGN KEY (`B`) REFERENCES `poste`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_posteTospecialite` ADD CONSTRAINT `_posteTospecialite_A_fkey` FOREIGN KEY (`A`) REFERENCES `poste`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_posteTospecialite` ADD CONSTRAINT `_posteTospecialite_B_fkey` FOREIGN KEY (`B`) REFERENCES `specialite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GradeToposte` ADD CONSTRAINT `_GradeToposte_A_fkey` FOREIGN KEY (`A`) REFERENCES `Grade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GradeToposte` ADD CONSTRAINT `_GradeToposte_B_fkey` FOREIGN KEY (`B`) REFERENCES `poste`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_brancheToposte` ADD CONSTRAINT `_brancheToposte_A_fkey` FOREIGN KEY (`A`) REFERENCES `branche`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_brancheToposte` ADD CONSTRAINT `_brancheToposte_B_fkey` FOREIGN KEY (`B`) REFERENCES `poste`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
