import express from 'express';
import shiftApplicationSchema from '../Models/ShiftApplication.js';
import { sendResponse, sendValidationResponse, sendDuplicateResponse, sendErrorResponse } from '../MiddleWares/Response.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
const shiftApplicationRouter = express.Router();

shiftApplicationRouter.post('/showInterest',checkAuth, async (req, res, next) => {
    try {
        const applicationData = req.body;
        const response = await shiftApplicationSchema.insertOne(applicationData);
        return sendResponse(res, true, "Applied successful", response);
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return sendDuplicateResponse(res, `${field} "${value}" already exists`, error.keyValue);
        }
        return sendErrorResponse(res, false, error.message);
    }
});

export default shiftApplicationRouter;