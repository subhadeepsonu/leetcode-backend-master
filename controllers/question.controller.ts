import { Request, Response } from 'express';
import { addQuestionValidator, updateQuestionValidator } from '../validators/question.validator';
import prisma from '../db';
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
        await prisma.questions.create({
            data: {
                question: check.data.question,
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
        const questions = await prisma.questions.findMany();
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
        const question = await prisma.questions.findUnique({
            where: {
                id: id
            }
        });
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
        await prisma.questions.update({
            where: {
                id: check.data.questionId
            },
            data: {
                question: check.data.question
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