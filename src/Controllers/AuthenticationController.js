import { registrationService, loginService, forgotPasswordService, resetPassworService, updatePasswordService } from "../Services/AuthenticationService.js";
import { conflictResponse, createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";


const registrationController = async (req, res, next) => {
    try {
        const userData = req.body || {};
        const response = await registrationService(userData);
        return createResponse(res, response, "Welcome! You have been onboarded successfully.Your account is now active.");
    } catch (error) {
        return next(error);
    }
};


const loginController = async (req, res, next) => {
    try {
        const loginCreds = req.body || {};
        const response = await loginService(loginCreds);
        return successResponse(res, response, "Welcome back! Login successful");
    } catch (error) {
        const message = error.message;
        if (message === "Not Found") {
            return notFoundResponse(res, "We couldn't find an account with this email");
        }
        if (message === "Account Suspended/Inactive") {
            return conflictResponse(res, "Your acoount is Suspended/Inactive.Please contact admin.");
        }
        if (message === "Password Incorrect") {
            return conflictResponse(res, "Invalid email or password");
        }
        return next(error);
    }
};


const forgotPasswordController = async (req, res, next) => {
    try {
        const emailData = req.body || {};
        const response = await forgotPasswordService(emailData);
        return createResponse(res, response, "Please check your email for the OTP to reset your password");
    } catch (error) {
        if (error.message === "Not Found") {
            return notFoundResponse(res, "We couldn't find an account with this email");
        }
        return next(error);
    }
};


const resetPasswordController = async (req, res, next) => {
    try {
        const resetPasswordData = req.body || {};
        const response = await resetPassworService(resetPasswordData);
        return successResponse(res, null, "Your password has been reset successfully. Please log in with your new password");
    } catch (error) {
        if (error.message === "Not Found") {
            return notFoundResponse(res, "We couldn't find an account with this email");
        }
        return next(error);
    }
};


const updatePasswordController = async (req, res, next) => {
    try {
        const changePasswordData = req.body || {};
        const response = await updatePasswordService(changePasswordData);
        return successResponse(res, null, "Password updated successfully");
    } catch (error) {
        if (error.message === "Not Found") {
            return notFoundResponse(res, "Account not found. Please check your details and try again");
        }
        if (error.message === "Password Incorrect") {
            return conflictResponse(res, "Current password is incorrect");
        }
        return next(error);
    }
};


export { registrationController, loginController, forgotPasswordController, resetPasswordController, updatePasswordController };