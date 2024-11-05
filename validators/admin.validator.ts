import z from 'zod';
export const adminLoginValidator = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
