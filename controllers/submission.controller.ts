import { Request, Response } from 'express';
import { addSubmissionValidator, editSubmissionValidator } from '../validators/submission.validator';
import prisma from '../db';
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
        await prisma.submissions.create({
            data: {
                code: check.data.code,
                language: check.data.language,
                questionId: req.params.id,
                userId: req.body.id
            }
        })
        res.status(200).json({
            success: true,
            message: "Submission added successfully"
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
        const submission = await prisma.submissions.findMany({
            where: {
                id: id
            }
        });
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
        const check = editSubmissionValidator.safeParse(body);
        if (!check.success) {
            res.status(400).json({
                success: false,
                message: check.error
            });
            return
        }
        await prisma.submissions.update({
            where: {
                id: req.params.id
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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
        return
    }
}