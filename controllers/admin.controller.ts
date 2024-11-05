import { Request, Response } from 'express';
import prisma from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminLoginValidator } from '../validators/admin.validator';
export async function AdminLogin(req: Request, res: Response) {
    try {
        const body = req.body;
        const check = adminLoginValidator.safeParse(body);
        if (!check.success) {
            res.status(400).json({
                success: false,
                message: check.error
            });
            return
        }
        const admin = await prisma.admin.findFirst({
            where: {
                email: check.data.email
            }
        });
        if (!admin) {
            res.status(400).json({
                success: false,
                message: "Admin not found"
            });
            return
        }
        const checkPassword = await bcrypt.compare(check.data.password, admin.password);
        if (!checkPassword) {
            res.status(400).json({
                success: false,
                message: "Password is incorrect"
            });
            return
        }
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET!);
        res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            data: token
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
export async function Adminregister(req: Request, res: Response) {
    try {
        const body = req.body;
        const check = adminLoginValidator.safeParse(body);
        if (!check.success) {
            res.status(400).json({
                success: false,
                message: check.error
            });
            return
        }
        const checkadmin = await prisma.admin.findFirst({
            where: {
                email: check.data.email
            }
        });
        if (checkadmin) {
            res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
            return
        }
        const hashedPassword = await bcrypt.hash(check.data.password, 10);
        const admin = await prisma.admin.create({
            data: {
                email: check.data.email,
                password: hashedPassword
            }
        });
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET!);
        res.status(200).json({
            success: true,
            message: "Admin registered successfully",
            data: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
        return
    }

}