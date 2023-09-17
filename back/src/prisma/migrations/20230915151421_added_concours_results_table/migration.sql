-- AlterTable
ALTER TABLE `attachment` ADD COLUMN `concoursResultId` VARCHAR(191) NULL,
    MODIFY `type` ENUM('CIN', 'CV', 'DIPLOME', 'AVIS', 'summonedCandidats', 'writtenExamResults', 'resultatFinal', 'AUTRE') NOT NULL;

-- CreateTable
CREATE TABLE `ConcoursResult` (
    `id` VARCHAR(191) NOT NULL,
    `concoursId` VARCHAR(191) NULL,

    UNIQUE INDEX `ConcoursResult_concoursId_key`(`concoursId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ConcoursResult` ADD CONSTRAINT `ConcoursResult_concoursId_fkey` FOREIGN KEY (`concoursId`) REFERENCES `Concours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_concoursResultId_fkey` FOREIGN KEY (`concoursResultId`) REFERENCES `ConcoursResult`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
