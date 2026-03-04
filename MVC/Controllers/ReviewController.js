import express from "express";
const reviewRouter = express.Router();
import reviewSchema from '../Models/ReviewModel.js';
import { sendErrorResponse, sendResponse, sendValidationResponse, sendDuplicateResponse } from "../MiddleWares/Response.js";
import { checkAuth } from "../MiddleWares/CheckAuth.js";

reviewRouter.post('/create', async (req, res, next) => {
    try {
        const data = req.body || {};
        const response = await reviewSchema.create(data);
        return sendResponse(res, true, 'Rated successfully', response);

    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        if (error.code === 11000) {
            return sendDuplicateResponse(res, "You already reviewed", error.keyValue);
        }
        return sendErrorResponse(res, error.message);
    }
});

export default reviewRouter;