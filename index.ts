import express from "express"
import { userRouter } from "./routes/user.route"
import { adminRouter } from "./routes/admin.route"
import { questionRouter } from "./routes/question.route"
import { submissionRouter } from "./routes/submission.route"
import { testCaseRouter } from "./routes/testcase.route"
import { createClient } from 'redis';
import { Request, Response } from 'express';
import cors from "cors"
const redisClient = createClient({
    username: 'default',
    password: process.env.password,
    socket: {
        host: process.env.host,
        port: 19616
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

redisClient.connect();


const app = express()
const allowedOrigins = [
    'http://localhost:5173',  // Your frontend URL during development
    'https://leetcode-clone-user-website.vercel.app',  // Your production frontend domain
];

const corsOptions = {
    origin: (origin: string | undefined, callback: Function) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);  // Allow requests from the allowed origins
        } else {
            callback(new Error('Not allowed by CORS'));  // Block requests from other origins
        }
    },
    credentials: true,  // If you need to allow credentials (cookies, headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
};
app.use(express.json())


app.get("/ping", (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "pong"
    })
})
app.use("/api/v1", userRouter)
app.use("/api/v1", adminRouter)
app.use("/api/v1", questionRouter)
app.use("/api/v1", submissionRouter)
app.use("/api/v1", testCaseRouter)
app.listen(3000, () => {
    console.log("Server is running on port 3000")
}
)
export { redisClient }