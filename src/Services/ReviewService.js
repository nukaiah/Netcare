import ReviewModel from "../Models/ReviewModel.js";
import { generateSequence } from "../Utils/SequenceGenerator.js";
import { createInvestigationService } from "./InvestigationService.js";
import ShiftApplication from "../Models/ShiftApplicantionModel.js";
import Razorpay from "razorpay";
import dotenv from 'dotenv';
dotenv.config();

const createReviewService = async (reviewData) => {
    const { rating } = reviewData || {};
    const response = await ReviewModel.create(reviewData);
    if (rating < 3) {
        const investigationId = await generateSequence("INVESTIGATION");
        const investigationData = {
            "investigationId": investigationId,
            "reviewId": response._id,
            "shiftId": reviewData.shiftId,
            "shiftApplicationId": reviewData.shiftApplicationId,
            "hospitalId": reviewData.reviewerId,
            "healthcareWorkerId": reviewData.targetId,
            "incidentTypes": reviewData.incidentTypes,
            "reason": reviewData.message,
            "createdBy": reviewData.reviewerId
        };
        const invesrtigationResponse = await createInvestigationService(investigationData);
    }
    let query = {};
    if (reviewData.reviewerType === "facility") {
        query = { isHospitalReview: true };
    }
    if (reviewData.reviewerType === "worker") {
        query = { isWorkerReview: true };
    }
    const result = await ShiftApplication.findByIdAndUpdate(reviewData.shiftApplicationId, { $set: query }, { runValidators: true, returnDocument: 'after' });
    return response;
};

const getReviewsService = async (shiftApplicationId) => {
    const result = await ReviewModel.find({ "shiftApplicationId": shiftApplicationId });
    return result;
};

const paymentService = async () => {
    try {
        const instance = new Razorpay({
            key_id: "rzp_test_TMorDBxuKw6Y2w",
            key_secret: "5XrV6O50i0eAqLEz0QxMJk5h",
        });
        const order = await instance.orders.create({
            amount: 50000, // ₹500.00 (amount is in paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            partial_payment: false,
            notes: {
                key1: "value1",
                key2: "value2",
            },
        });

        return order;
    } catch (error) {
        console.error("Razorpay Error:", error);
        throw error;
    }
};



export { createReviewService, getReviewsService, paymentService }



