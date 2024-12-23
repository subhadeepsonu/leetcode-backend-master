/*
  Warnings:

  - You are about to drop the `_questionsTotags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_questionsTotags" DROP CONSTRAINT "_questionsTotags_A_fkey";

-- DropForeignKey
ALTER TABLE "_questionsTotags" DROP CONSTRAINT "_questionsTotags_B_fkey";

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "tagid" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "_questionsTotags";

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_tagid_fkey" FOREIGN KEY ("tagid") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
