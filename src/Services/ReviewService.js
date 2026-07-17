import ReviewModel from "../Models/ReviewModel.js";
import CountersModel from "../Models/CounterModel.js";
import { generateSequence } from "../Utils/SequenceGenerator.js";
import { createInvestigationService } from "./InvestigationService.js";
import ShiftApplication from "../Models/ShiftApplicantsModel.js";

const createReviewService = async (reviewData) => {
    console.log(reviewData);
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
            "createdBy":reviewData.reviewerId
        };
        const invesrtigationResponse = await createInvestigationService(investigationData);
        
    }
    let query = {};
    if (reviewData.reviewerType === "facility") {
        query = { isAdminReview: true };
    }
    if (reviewData.reviewerType === "worker") {
        query = { isUserReview: true };
    }
    const result = await ShiftApplication.findByIdAndUpdate(reviewData.shiftApplicationId, { $set: query });

    return response;
};

const paymentService = async () => {
    var instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = {
        amount: 100 * 100,
        currency: "INR",
        receipt: "receipt_"
    };
    const response = await instance.orders.create({
        "amount": 50000,
        "currency": "INR",
        "receipt": "receipt#1",
        "partial_payment": false,
        "notes": {
            "key1": "value3",
            "key2": "value2"
        }
    });
    const order = await instance.orders.all();
    return response;
};



export { createReviewService, paymentService }



