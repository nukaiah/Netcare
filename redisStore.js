import redisClient from "./src/config/RedisConfig.js";
import express from "express";
import { successResponse } from "./src/Utils/Response.js";

const redisRouter = express.Router();

redisRouter.post("/storeData", async (req, res, next) => {
    try {
        const identifier = "8978511783";
        const key = `otps:${identifier}`;
        const OTP_EXPIRY_SECONDS = 300;
        const otpData = {
            type: "ForgotPassword",
            mode: "Email",
            emailMobile: identifier,
            otp: "657456",
            isUsed: false,
            expireDate: new Date(Date.now() + OTP_EXPIRY_SECONDS * 1000).toISOString(),
        };

        const response = await redisClient.json.set(
            key,
            "$",
            otpData,
            {
                EX: OTP_EXPIRY_SECONDS
            }
        );
        console.log(response);
        const result = await redisClient.expire(key, 300);
        console.log(result);
        return successResponse(
            res,
            response,
            "OTP saved successfully"
        );
    } catch (error) {
        next(error);
    }
});

redisRouter.post("/getStoreData", async (req, res, next) => {
    try {
        const identifier = "8978511783";
        const key = `otps:${identifier}`;
        const response = await redisClient.json.get(key);
        console.log(response);
        return successResponse(
            res,
            response,
            "OTP saved successfully"
        );
    } catch (error) {
        next(error);
    }
});

export default redisRouter;