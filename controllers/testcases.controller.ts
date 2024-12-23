import { Request, Response } from "express"
import { addTestCaseValidator, updateTestCaseValidator } from "../validators/testcase.validator";
import prisma from "../db";
import { redisClient } from "..";
export async function AddTestcase(req: Request, res: Response) {
    try {
        const body = req.body;
        const check = addTestCaseValidator.safeParse(body);
        if (!check.success) {
            res.status(400).json({
                success: false,
                message: check.error
            });
            return
        }
        await redisClient.del(`question:${check.data.questionId}`)
        await prisma.testcases.create({
            data: {
                input: check.data.input,
                output: check.data.output,
                questionId: check.data.questionId
            }
        })
        res.status(200).json({
            success: true,
            message: "Testcase added successfully"
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

export async function GetTestcase(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Testcase id is required"
            });
            return
        }
        const testcase = await prisma.testcases.findMany({
            where: {
                questionId: id
            }
        });
        res.status(200).json({
            success: true,
            message: "Testcase fetched successfully",
            data: testcase
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

export async function UpdateTestcase(req: Request, res: Response) {
    try {
        const body = req.body;
        const check = updateTestCaseValidator.safeParse(body);
        if (!check.success) {
            res.status(400).json({
                success: false,
                message: check.error
            });
            return
        }
        await prisma.testcases.update({
            where: {
                id: req.params.id
            },
            data: {
                input: check.data.input,
                output: check.data.output
            }
        })
        res.status(200).json({
            success: true,
            message: "Testcase updated successfully"
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

export async function DeleteTestcase(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({
                success: false,
                message: "Testcase id is required"
            });
            return
        }
        await prisma.testcases.delete({
            where: {
                id: id
            }
        });
        res.status(200).json({
            success: true,
            message: "Testcase deleted successfully"
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