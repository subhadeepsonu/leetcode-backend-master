-- DropForeignKey
ALTER TABLE "testcases" DROP CONSTRAINT "testcases_questionId_fkey";

-- AddForeignKey
ALTER TABLE "testcases" ADD CONSTRAINT "testcases_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
