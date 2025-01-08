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
        await Promise.all(
            testcases.map(async (testcase: any) => {
                let code = "const a = require('fs').readFileSync('/dev/stdin').toString().trim().startsWith('[') && require('fs').readFileSync('/dev/stdin').toString().trim().endsWith(']') ? JSON.parse(require('fs').readFileSync('/dev/stdin').toString().trim()) : !isNaN(require('fs').readFileSync('/dev/stdin').toString().trim()) ? Number(require('fs').readFileSync('/dev/stdin').toString().trim()) : require('fs').readFileSync('/dev/stdin').toString().trim();" + check.data.code
                const body = {
                    language_id: parseInt(check.data.language),
                    source_code: code,
                    stdin: testcase.input,
                    expected_output: testcase.output,
                };
                try {
                    const response = await axios.post("http://3.110.188.231:2358/submissions", body, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    while (true) {
                        const resposne2 = await axios.get(`http://3.110.188.231:2358/submissions/${response.data.token}`);
                        console.log(resposne2.data)
                        if (resposne2.data.status.description === "Accepted" || resposne2.data.status.description === "Wrong Answer") {

                            if (resposne2.data.status.description === "Accepted") {
                                console.log(result)
                                result.passedCases += 1;
                            } else {
                                result.failedCases += 1;
                            }
                            break;
                        }

                    }

                } catch (err) {
                    console.error("Error processing submission:", err);
                    result.failedCases += 1;
                }
            })
        );
        console.log("exit promoise all")
        result.correct = (result.passedCases == result.totalCases) ? true : false
        try {
            const reponse = await axios.put(`http://13.201.4.190:3000/api/v1/submission/${submission.id}`, {
                passedcases: result.passedCases,
                failedcases: result.failedCases,
                totalcases: result.totalCases,
                correct: result.correct,
                userId: submission.userId
            });
            console.log(reponse.data)
        } catch (err: any) {
            console.error("Error updating submission result:", err.response?.data || err.message || err);
        }

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