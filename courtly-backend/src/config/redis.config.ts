import { Redis } from "ioredis";
import logger from './logger.config';

const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;

export const redis = new Redis({
    host: "localhost",
    port: REDIS_PORT,
    maxRetriesPerRequest: null
});

redis.on("connect", () => {
    logger.info("Connected to Redis server");
});

redis.on("error", (error) => {
    logger.error(`Redis error: ${error.message}`);
});