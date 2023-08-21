-- AlterTable
ALTER TABLE `campagne` MODIFY `datePublication` VARCHAR(191) NOT NULL,
    MODIFY `dateLimiteInscription` VARCHAR(191) NOT NULL,
    MODIFY `dateConcours` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `concours` MODIFY `datePublication` VARCHAR(191) NULL,
    MODIFY `dateLimiteInscription` VARCHAR(191) NULL,
    MODIFY `dateConcours` VARCHAR(191) NULL;
