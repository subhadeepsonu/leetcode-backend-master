import z from "zod"
export const addSubmissionValidator = z.object({
    code: z.string(),
    language: z.string(),
    questionId: z.string().uuid(),
})
export const editSubmissionValidator = z.object({
    passedcases: z.number(),
    failedcases: z.number(),
    totalcases: z.number(),
    correct: z.boolean()
})
