import { Router } from "express";
import { UserLogin, UserRegister } from "../controllers/user.controller";
export const userRouter = Router();
userRouter.post("/user/login", UserLogin)
userRouter.post("/user/register", UserRegister)