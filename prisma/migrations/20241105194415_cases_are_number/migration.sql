/*
  Warnings:

  - The `passedcases` column on the `submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `failedcases` column on the `submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `totalcases` column on the `submissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "passedcases",
ADD COLUMN     "passedcases" INTEGER,
DROP COLUMN "failedcases",
ADD COLUMN     "failedcases" INTEGER,
DROP COLUMN "totalcases",
ADD COLUMN     "totalcases" INTEGER;
