import { createReviewService, paymentService } from "../Services/ReviewService.js";
import { successResponse, createResponse, conflictResponse } from "../Utils/Response.js";

const createReviewControler = async (req, res, next) => {
    try {
        const reviewData = req.body || {};
        const response = await createReviewService(reviewData);
        return createResponse(res, response, "Reviewd successfully")
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "You reviewd alreay.");
        }
        return next(error);
    }
};

const paymentController = async (req, res, next) => {
    try {
        const response = await paymentService();
        return successResponse(res, response, "Payment paid successfully")
    } catch (error) {
        return next(error);
    }
};



export { createReviewControler,paymentController};