import { Request, Response } from 'express';
import { addQuestionValidator, updateQuestionValidator } from '../validators/question.validator';
import prisma from '../db';
import { redisClient } from '..';
export async function AddQuestion(req: Request, res: Response) {
    try {
        const body = req.body;
        const check = addQuestionValidator.safeParse(body);
        if (!check.success) {
            res.status(400).json({
                success: false,
                message: check.error
            });
            return
        }
        await redisClient.del("questions")
        await prisma.questions.create({
            data: {
                question: check.data.question,
                description: check.data.description,
                sampleInput1: check.data.sampleInput1,
                sampleInput2: check.data.sampleInput2,
                sampleOutput1: check.data.sampleOutput1,
                sampleOutput2: check.data.sampleOutput2,
                difficulty: check.data.difficulty
            }
        })
        res.status(200).json({
            success: true,
            message: "Question added successfully"
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
        return
    }

}
export async function GetQuestions(req: Request, res: Response) {
    try {
        const question = await redisClient.get("questions");
        if (question) {
            console.log("from redis")
            res.status(200).json({
                success: true,
                message: "Questions fetched successfully",
                data: JSON.parse(question)
            });
            return
        }
        console.log("from db")
        const questions = await prisma.questions.findMany();
        redisClient.set("questions", JSON.stringify(questions))
        res.status(200).json({
            success: true,
            message: "Questions fetched successfully",
            data: questions
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
        return
    }

}
export async function GetSpcificQuestion(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Question id is required"
            });
            return
        }
        const questions = await redisClient.get(`question:${id}`)

        if (questions) {
            console.log("from redis")
            res.status(200).json({
                success: true,
                message: "Question fetched successfully",
                data: JSON.parse(questions)
            });
            return
        }
        console.log("from db")
        const question = await prisma.questions.findUnique({
            where: {
                id: id
            },
            include: {
                testcases: {
                    select: {
                        input: true,
                        output: true
                    }
                }
            }
        });
        await redisClient.set(`question:${id}`, JSON.stringify(question))
        res.status(200).json({
            success: true,
            message: "Question fetched successfully",
            data: question
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
        return
    }

}
export async function EditQuestion(req: Request, res: Response) {
    try {
        const body = req.body;
        const check = updateQuestionValidator.safeParse(body);
        if (!check.success) {
            res.status(400).json({
                success: false,
                message: check.error
            });
            return
        }
        await redisClient.del("questions")
        await redisClient.del(`question:${check.data.questionId}`)
        await prisma.questions.update({
            where: {
                id: check.data.questionId
            },
            data: {
                question: check.data.question,
                description: check.data.description,
                sampleInput1: check.data.sampleInput1,
                sampleInput2: check.data.sampleInput2,
                sampleOutput1: check.data.sampleOutput1,
                sampleOutput2: check.data.sampleOutput2
            }
        })
        res.status(200).json({
            success: true,
            message: "Question updated successfully"
        });
        return
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
        return
    }

}
export async function DeleteQuestion(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Question id is required"
            });
            return
        }
        await redisClient.del("questions")
        await prisma.questions.delete({
            where: {
                id: id
            }
        })
        res.status(200).json({
            success: true,
            message: "Question deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
        return
    }

}