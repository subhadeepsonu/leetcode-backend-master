import { Router } from "express";
import { UserLogin, UserProfile, UserRegister } from "../controllers/user.controller";
import { userMiddleware } from "../middleware/user.middleware";
export const userRouter = Router();
userRouter.post("/user/login", UserLogin)
userRouter.post("/user/register", UserRegister)
userRouter.get("/user/profile", userMiddleware, UserProfile)