import { Router } from "express";
import { adminMiddleware } from "../middleware/admin.middleware";
import { AddTestcase, DeleteTestcase, GetTestcase, UpdateTestcase } from "../controllers/testcases.controller";
import { userMiddleware } from "../middleware/user.middleware";
export const testCaseRouter = Router();
testCaseRouter.post("/testcase", adminMiddleware, AddTestcase);
testCaseRouter.get("/testcase/:id", userMiddleware, GetTestcase);
testCaseRouter.put("/testcase", adminMiddleware, UpdateTestcase);
testCaseRouter.delete("/testcase/:id", adminMiddleware, DeleteTestcase);