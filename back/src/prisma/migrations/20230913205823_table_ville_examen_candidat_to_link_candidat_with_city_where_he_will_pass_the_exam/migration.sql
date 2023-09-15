/*
  Warnings:

  - The values [Disabled] on the enum `Concours_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `concours` MODIFY `status` ENUM('disabled', 'enabled', 'ended') NOT NULL DEFAULT 'enabled';

-- CreateTable
CREATE TABLE `ville_examen_candidat` (
    `id` VARCHAR(191) NOT NULL,
    `villeExamenId` VARCHAR(191) NOT NULL,
    `candidatId` VARCHAR(191) NOT NULL,
    `concoursId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ville_examen_candidat` ADD CONSTRAINT `ville_examen_candidat_villeExamenId_fkey` FOREIGN KEY (`villeExamenId`) REFERENCES `Ville`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ville_examen_candidat` ADD CONSTRAINT `ville_examen_candidat_candidatId_fkey` FOREIGN KEY (`candidatId`) REFERENCES `Candidat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ville_examen_candidat` ADD CONSTRAINT `ville_examen_candidat_concoursId_fkey` FOREIGN KEY (`concoursId`) REFERENCES `Concours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
