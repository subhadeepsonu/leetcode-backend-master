import { NextFunction, Request, Response } from "express";

export async function userMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
        return
    }
}