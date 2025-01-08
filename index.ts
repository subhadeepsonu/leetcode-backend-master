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


app.use(cors({
    origin: "https://meetcode-user.subhadeep.xyz"
}));
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.json({
        success: true,
        message: "health check"
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