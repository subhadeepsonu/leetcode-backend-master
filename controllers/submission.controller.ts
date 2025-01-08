import { Request, Response } from 'express';
import { addSubmissionValidator, editSubmissionValidator } from '../validators/submission.validator';
import prisma from '../db';
import { redisClient } from '..';
import axios from 'axios';
export async function GetAllSubmissions(req: Request, res: Response) {
    try {
        const { id } = req.query
        if (!id) {
            res.status(400).json({
                success: false,
                message: "id is required"
            });
            return
        }
        const submissions = await prisma.submissions.findMany({
            where: {
                userId: req.body.id,
                questionId: id.toString(),
                completed: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.status(200).json({
            success: true,
            message: "Submissions fetched successfully",
            data: submissions
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
export async function AddSubmission(req: Request, res: Response) {
    try {
        const body = req.body;
        const check = addSubmissionValidator.safeParse(body);
        if (!check.success) {
            res.status(400).json({
                success: false,
                message: check.error
            });
            return
        }
        const submission = await prisma.submissions.create({
            data: {
                code: check.data.code,
                language: check.data.language,
                questionId: check.data.questionId,
                userId: req.body.id
            }
        })
        const testcases = await prisma.testcases.findMany({
            where: {
                questionId: check.data.questionId
            }
        })
        let result = {
            passedCases: 0,
            failedCases: 0,
            totalCases: testcases.length,
            correct: false,
            userId: submission.userId
        };

        redisClient.lPush("submissions", JSON.stringify({
            userId: submission.userId,
            submissionId: submission.id,
            code: check.data.code,
            langId: 63,
            testcases
        }))
        res.status(200).json({
            success: true,
            message: "Submission added successfully",
            data: submission.id
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
export async function GetSubmission(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Submission id is required"
            });
            return
        }
        const submission = await prisma.submissions.findUnique({
            where: {
                id: id
            }
        });
        if (!submission) {
            res.status(400).json({
                success: false,
                message: "Submission not found"
            });
            return
        }
        res.status(200).json({
            success: true,
            message: "Submission fetched successfully",
            data: submission
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
export async function UpdateSubmission(req: Request, res: Response) {
    try {
        const body = req.body;
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "id required"
            });
            return
        }
        const check = editSubmissionValidator.safeParse(body);
        if (!check.success) {
            res.status(400).json({
                success: false,
                message: check.error.message
            });
            return
        }
        const submission = await prisma.submissions.findUnique({
            where: {
                id: id
            }
        })
        if (!submission) {
            res.status(400).json({
                success: false,
                message: "submission not found"
            });
            return
        }
        if (submission.userId != check.data.userId) {

            res.status(400).json({
                success: false,
                message: "Not authorized"
            });
            return
        }
        await prisma.submissions.update({
            where: {
                id: id
            },
            data: {
                failedcases: check.data.failedcases,
                passedcases: check.data.passedcases,
                totalcases: check.data.totalcases,
                correct: check.data.correct,
                completed: true
            }
        })
        res.status(200).json({
            success: true,
            message: "Submission updated successfully"
        });
        return
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
        return
    }
}