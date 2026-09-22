import express, { type NextFunction, type Response, type Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pinoHttp } from "pino-http";
import logger from "./config/logger.config";
import webhookRouter from "./routes/webhooks.routes";
import { clerkMiddleware, getAuth } from "@clerk/express";
import lawyerRouter from "./routes/lawyers.routes";
import caseRouter from "./routes/cases.routes";
import notifRouter from "./routes/notifications.routes";

//get auth is used for const { userId, orgId } = getAuth(req);

dotenv.config();

const app = express();

app.use(clerkMiddleware());

app.use(pinoHttp({ logger: logger }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use("/api/webhooks", webhookRouter);

app.use(express.json());

app.get("/api/health", (req, res) => {

    req.log.info("Health check");
    res.status(200).json({
        status: "Ok",
        message: "Server is running"
    });

});

app.use("/api/organization", lawyerRouter);
app.use("/api/cases", caseRouter);
app.use("/api/notifications", notifRouter)

export default app;