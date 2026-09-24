import { Worker } from "bullmq";
import { redis } from "../config/redis.config";
import { sendEmail, sendTaskEmail } from "../services/email.service";
import logger from "../config/logger.config";

const emailWorker = new Worker(
    "email", 
    async (job) => {
        const { to, subject, message } = job.data;
        await sendEmail(to, subject, message);
    },
    {
        connection: redis
    }
);

emailWorker.on("ready", () => {
    logger.info(`Email worker ready`);
});

emailWorker.on("completed", (job) => {
    logger.info(`Email job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
    logger.error(`Email job ${job?.id} failed: ${err}`);
});