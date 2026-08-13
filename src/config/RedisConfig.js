import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();


const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        tls: process.env.REDIS_TLS
    }
});

redisClient.on("ready", () => {
    console.log("Redis connected successfully ✅");
});

redisClient.on("error", (error) => {
    console.error("Redis Client Error:", error);
});

redisClient.on("reconnecting", () => {
    console.log("Redis reconnecting...");
});


export default redisClient;

