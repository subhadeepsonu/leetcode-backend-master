import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(400).json({
                success: false,
                message: "Token is required"
            });
            return
        }
        const admin: any = jwt.verify(token, process.env.JWT_SECRET!);
        if (!admin) {
            res.status(400).json({
                success: false,
                message: "Invalid token"
            });
            return
        }
        if (admin.role !== 'admin') {
            res.status(400).json({
                success: false,
                message: "You are not authorized"
            });
            return
        }
        req.body.id = admin.id;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
        return
    }
}