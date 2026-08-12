import { nextTick } from "process";
import { saveOtpService, verifyOtpService, resendOtpService } from "../Services/OtpService.js";
import { conflictResponse, createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";

const saveOtpController = async (req, res, next) => {
    try {
        const otpData = req.body || {};
        const response = await saveOtpService(otpData);
        return createResponse(res, response, "OTP has been sent to your email and mobile number");
    } catch (error) {
        if (error.message === "Existed User") {
            return conflictResponse(res, "Email or mobile number already exists");
        }
        if (error.message === "Email Failed") {
            return conflictResponse(res, "Something went wrong, please try again");
        }
        return next(error);
    }
};

const verifyOtpController = async (req, res, next) => {
    try {
        const otpData = req.body || {};
        const response = await verifyOtpService(otpData);
        return successResponse(res, response, "Otp verified sucessfully");
    } catch (error) {
        const message = error.message;
        if (message === "Invalid otp" || message === "Otp Not Found") {
            return notFoundResponse(res, "Invalid OTP");
        }
        if (message === "Otp Used") {
            return conflictResponse(res, "OTP already used");
        }
        if (message === "Expired otp") {
            return conflictResponse(res, "OTP expired");
        }

        return next(error);
    }
};

const resendOtpController = async (req, res, next) => {
    try {
        const resendOtpData = req.body || {};
        const response = await resendOtpService(resendOtpData);
        if (response === "Email Failed") {
            return conflictResponse(res, null, "Something went wrong, please try again");
        }
        return createResponse(res, null, `OTP has been sent to your ${resendOtpData.mode}`);
    } catch (error) {
        return next(error);
    }
};

export { saveOtpController, verifyOtpController, resendOtpController };