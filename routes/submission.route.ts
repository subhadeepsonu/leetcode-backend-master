import { Router } from "express";
import { userMiddleware } from "../middleware/user.middleware";
import { AddSubmission, GetAllSubmissions, GetSubmission, UpdateSubmission } from "../controllers/submission.controller";
export const submissionRouter = Router();
submissionRouter.post("/submission", userMiddleware, AddSubmission);
submissionRouter.get("/submission/:id", userMiddleware, GetSubmission);
submissionRouter.put("/submission/:id", UpdateSubmission)
submissionRouter.get("/submission", userMiddleware, GetAllSubmissions)