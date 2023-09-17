/*
  Warnings:

  - The values [resultatFinal] on the enum `Attachment_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `attachment` MODIFY `type` ENUM('CIN', 'CV', 'DIPLOME', 'AVIS', 'summonedCandidats', 'writtenExamResults', 'finalResults', 'accessPlan', 'AUTRE') NOT NULL;
