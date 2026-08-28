import { createBankService, getAllBanksService } from "../Services/BankServices.js"
import { createResponse, successResponse } from "../Utils/Response.js";
import sendMobileSmsOtp from "../Utils/MobileOtp.js";
import generateOtp from "../Utils/GenerateOtp.js"

const createBankController = async (req, res, next) => {
    try {
        const bankData = req.body || {};
        const result = await createBankService(bankData);
        return createResponse(res, result, "Bank created successfully");
    } catch (error) {
        return next(error);
    }
};

const getAllBanksController = async (req, res, next) => {
    try {
        const result = await getAllBanksService();
        return successResponse(res, result, "Banks data found");
    } catch (error) {
        return next(error);
    }
}

const sendOtpController = async (req, res, next) => {
    try {
        const {mobile } = req.body || {};
        const otp = await generateOtp();
        console.log(otp);
        const response = await sendMobileSmsOtp(mobile, otp);
        return successResponse(res, response, "Otp sent successfully");
    } catch (error) {
        return next(error);
    }
};

export { createBankController, getAllBanksController,sendOtpController };