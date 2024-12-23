-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "sampleInput1" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sampleInput2" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sampleOutput1" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sampleOutput2" TEXT NOT NULL DEFAULT '';
