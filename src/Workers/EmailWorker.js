import { Worker } from "bullmq";
import redisClient from "../config/RedisConfig.js";
import { sendEmail } from "../Utils/Email.js";

const emailWorker = new Worker(
    "email-queue",
    async (job) => {
        const {email,subject,html} = job.data;
        await sendEmail(email,subject,html);
    },
    {
        connection: redisClient
    }
);



emailWorker.on("completed", (job) => {
    console.log(`Email job completed: ${job.id}`);
});

emailWorker.on("failed", (job, error) => {
    console.error(
        `Email job failed: ${job?.id}`,
        error.message
    );
});

export default emailWorker;