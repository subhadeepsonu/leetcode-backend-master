import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
export async function userMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            res.status(400).json({
                success: false,
                message: "Token is required"
            });
            return
        }

        const user: any = jwt.verify(token, process.env.JWT_SECRET!);
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid token"
            });
            return
        }
        req.body.id = user.id;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
        return
    }
}