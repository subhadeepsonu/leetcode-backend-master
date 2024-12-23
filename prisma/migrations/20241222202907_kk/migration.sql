-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_questionId_fkey";

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
