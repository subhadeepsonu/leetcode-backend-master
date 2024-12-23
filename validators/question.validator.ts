import { difficulty } from '@prisma/client';
import z from 'zod';
export const addQuestionValidator = z.object({
    question: z.string().min(10),
    description: z.string(),
    sampleInput1: z.string(),
    sampleInput2: z.string(),
    sampleOutput1: z.string(),
    sampleOutput2: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"])
});
export const updateQuestionValidator = z.object({
    questionId: z.string().uuid(),
    question: z.string().min(10),
    description: z.string(),
    sampleInput1: z.string(),
    sampleInput2: z.string(),
    sampleOutput1: z.string(),
    sampleOutput2: z.string()
});
export const deleteQuestionValidator = z.object({
    questionId: z.string().uuid(),
});
export const getQuestionValidator = z.object({
    questionId: z.string().uuid(),
});