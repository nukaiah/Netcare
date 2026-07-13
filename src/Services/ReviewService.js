import ReviewModel from "../Models/ReviewModel.js";

const createReviewService = async (data) => {
    const response = await ReviewModel.create(data);
    let query = {};
    if (data.reviewerType === "facility") {
        query = { isAdminReview: true };
    }
    if (data.reviewerType === "worker") {
        query = { isUserReview: true };
    }
    const result = await ShiftApplication.findByIdAndUpdate(data.shiftApplicationId, { $set: query });
    return result;
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

