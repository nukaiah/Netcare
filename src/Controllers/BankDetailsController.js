import { createBankDetailsService, getBankDetailsByIdService, getBankDetailsByUserIdService, updateBankDetailsService } from "../Services/BankDetailsService.js";
import { conflictResponse, createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";

const createBankDetailsController = async (req, res, next) => {
    try {
        const bankDetails = req.body || {};
        const response = await createBankDetailsService(bankDetails);
        return createResponse(res, response, "Bank details created successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Bank details already existed");
        }
        return next(error);
    }
};

const getBankDetailsByIdController = async (req, res, next) => {
    try {
        const { id } = req.body || {};
        const response = await getBankDetailsByIdService(id);
        return successResponse(res, response, "Bank details found");
    } catch (error) {
        if (error.message === "Not Found") {
            return notFoundResponse(res, "No bank details found");
        }
        return next(error);
    }
};

const getBankDetailsByUserIdController = async (req, res, next) => {
    try {
        const { userId } = req.body || {};
        const response = await getBankDetailsByUserIdService(userId);
        return successResponse(res, response, "Bank details found");
    } catch (error) {
        if (error.message === "Not Found") {
            return notFoundResponse(res, "No bank details found");
        }
        return next(error);
    }
};

const updateBankDetailsController = async (req, res, next) => {
    try {
        const bankDetails = req.body || {};
        const response = await updateBankDetailsService(bankDetails);
        return createResponse(res, response, "Bank details updated successfully");
    } catch (error) {
        if (error.message === "Not Found") {
            return notFoundResponse(res, "No bank details found");
        }
        return next(error);
    }
};

export {
    createBankDetailsController,
    getBankDetailsByIdController,
    getBankDetailsByUserIdController,
    updateBankDetailsController
};