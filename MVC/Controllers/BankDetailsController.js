import express from 'express';
import bankSchema from '../Models/BankDetailsModels.js';
import { sendResponse, sendValidationResponse, sendErrorResponse, sendDuplicateResponse } from '../MiddleWares/Response.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js'
const bankRouter = express.Router();

bankRouter.post('/insertUpdate', checkAuth, async (req, res, next) => {
    try {
        const {sId,...bankData} = req.body||{};
        let response;
        if (!sId) {
            response = await bankSchema.insertOne(bankData);
            return sendResponse(res, true, "Bank details added successfully", response);
        }
        else {
            response = await bankSchema.findByIdAndUpdate(sId, { $set: bankData }, { new: true, runValidators: true });
            return sendResponse(res, true, "Bank updated successfully", response);
        }

    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return sendDuplicateResponse(res, "Duplicate bank detials found", error.keyValue);
        }
        return sendErrorResponse(res, error.message);
    }
});


export default bankRouter;

