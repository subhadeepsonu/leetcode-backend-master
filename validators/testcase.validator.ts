import z from 'zod';
export const addTestCaseValidator = z.object({
    input: z.any(),
    output: z.string(),
    questionId: z.string().uuid()
});
export const updateTestCaseValidator = z.object({
    input: z.string(),
    output: z.string(),
    questionId: z.string()
});
export const getTestCaseValidator = z.object({
    questionId: z.string()
});
export const deleteTestCaseValidator = z.object({
    testcaseId: z.string()
});