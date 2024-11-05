import { Router } from "express";
import { userMiddleware } from "../middleware/user.middleware";
import { AddSubmission, GetSubmission } from "../controllers/submission.controller";
export const submissionRouter = Router();
submissionRouter.post("/submission/:id", userMiddleware, AddSubmission);
submissionRouter.get("/submission/:id", userMiddleware, GetSubmission);