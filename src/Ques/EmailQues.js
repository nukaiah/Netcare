import { Queue } from "bullmq";
import redisClient from "../config/RedisConfig.js";

const emailQueue = new Queue("email-queue", {
    connection: redisClient,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000
        },
        removeOnComplete:true,
        removeOnFail:true
    }
});

emailQueue.on("error", (error) => {
    console.error("Email Queue Error:", error);
});

export default emailQueue;
