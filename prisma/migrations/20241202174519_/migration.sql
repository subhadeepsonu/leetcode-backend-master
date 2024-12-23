/*
  Warnings:

  - You are about to drop the column `tagid` on the `questions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_tagid_fkey";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "tagid";

-- CreateTable
CREATE TABLE "_questionsTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_questionsTotags_AB_unique" ON "_questionsTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_questionsTotags_B_index" ON "_questionsTotags"("B");

-- AddForeignKey
ALTER TABLE "_questionsTotags" ADD CONSTRAINT "_questionsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_questionsTotags" ADD CONSTRAINT "_questionsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
