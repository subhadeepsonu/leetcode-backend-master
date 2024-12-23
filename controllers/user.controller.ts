import { Request, Response } from 'express';
import { userLoginValidator, userRegisterValidator } from '../validators/user.validator';
import prisma from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export async function UserLogin(req: Request, res: Response) {
    try {
        const body = req.body;
        const check = userLoginValidator.safeParse(body);
        if (!check.success) {
            res.status(400).json({
                success: false,
                message: check.error
            });
            return
        }
        const user = await prisma.user.findFirst({
            where: {
                email: check.data.email,
            }
        });
        if (!user) {
            res.json({
                success: false,
                message: "User not found"
            });
            return
        }
        const checkPassword = await bcrypt.compare(check.data.password, user.password);

        if (!checkPassword) {
            res.json({
                success: false,
                message: "Password is incorrect"
            });
            return
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
        res.json({
            success: true,
            message: "User logged in successfully",
            data: token
        });
        return
    } catch (error) {
        res.json({
            success: false,
            message: error
        });
        return
    }

}

export async function UserRegister(req: Request, res: Response) {
    try {
        const body = req.body;
        const check = userRegisterValidator.safeParse(body);
        if (!check.success) {
            res.json({
                success: false,
                message: check.error
            });
            return
        }
        const checkUser = await prisma.user.findFirst({
            where: {
                email: check.data.email,
            }
        });

        if (checkUser) {
            res.json({
                success: false,
                message: "User already exists"
            });
            return
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(check.data.password, salt);
        const user = await prisma.user.create({
            data: {
                email: check.data.email,
                password: hashedPassword,
                username: check.data.username
            }
        })
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
        res.json({
            success: true,
            message: "User registered successfully",
            data: token
        });
        return
    } catch (error) {
        res.json({
            success: false,
            message: error
        });
        return
    }

}
export async function UserProfile(req: Request, res: Response) {
    try {
        const response = await prisma.user.findUnique({
            where: {
                id: req.body.id
            }
        })
        const submissions = await prisma.submissions.findMany({
            where: {
                userId: req.body.id
            }
        })
        const correctsubmissions = await prisma.submissions.findMany({
            where: {
                userId: req.body.id,
                correct: true
            }
        })
        const correct = await prisma.submissions.groupBy({
            by: ["questionId"],
            where: {
                userId: req.body.id,
                correct: true
            }
        })
        const recent = await prisma.submissions.findMany({
            where: {
                userId: req.body.id,
            },
            include: {
                question: {
                    select: {
                        question: true
                    }
                }
            },
            take: 5,
            orderBy: {
                createdAt: "desc"
            }
        })
        res.json({
            success: true,
            data: {
                response,
                submissions: submissions.length,
                correct: correct.length,
                correctsubmissions: correctsubmissions.length,
                recent
            },

        })
        return
    } catch (error) {
        res.json({
            success: false,
            message: error
        });
        return
    }
}