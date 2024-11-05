import { Router } from "express";
import { AdminLogin } from "../controllers/admin.controller";
const adminRouter = Router();
adminRouter.post("/login", AdminLogin)