import z from 'zod';
export const addQuestionValidator = z.object({
    question: z.string().min(10),
});
export const updateQuestionValidator = z.object({
    questionId: z.string().uuid(),
    question: z.string().min(10),
});
export const deleteQuestionValidator = z.object({
    questionId: z.string().uuid(),
});
export const getQuestionValidator = z.object({
    questionId: z.string().uuid(),
});