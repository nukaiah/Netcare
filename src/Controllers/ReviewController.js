import { createReviewService, getReviewsService, paymentService } from "../Services/ReviewService.js";
import { successResponse, createResponse, conflictResponse } from "../Utils/Response.js";

const createReviewControler = async (req, res, next) => {
    try {
        const reviewData = req.body || {};
        const response = await createReviewService(reviewData);
        return createResponse(res, response, "Reviewed successfully")
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "You reviewed already.");
        }
        return next(error);
    }
};

const getReviewsController = async (req, res, next) => {
    try {
        const { shiftApplicationId } = req.body || {};
        const response = await getReviewsService(shiftApplicationId);
        return successResponse(res, response, "Review found successfully")
    } catch (error) {
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



export { createReviewControler, getReviewsController, paymentController };