import express from "express";
const reviewRouter = express.Router();
import reviewSchema from '../Models/ReviewModel.js';
import { sendErrorResponse, sendResponse, sendValidationResponse, sendDuplicateResponse } from "../MiddleWares/Response.js";
import { checkAuth } from "../MiddleWares/CheckAuth.js";
// import ShiftApplication from "../Models/ShiftApplication.js";
import Razorpay from "razorpay";
import dotenv from 'dotenv';
dotenv.config();

reviewRouter.post('/create', async (req, res, next) => {
    try {
        const { shiftApplicationId, ...data } = req.body || {};
        let query = {};
        const response = await reviewSchema.create(data);
        console.log(data.reviewerType);
        if (data.reviewerType === "facility") {
            query = { isAdminReview: true };
        }
        if (data.reviewerType === "worker") {
            query = { isUserReview: true };
        }
        console.log(query);
        const result = await ShiftApplication.findByIdAndUpdate(shiftApplicationId, { $set: query });
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

reviewRouter.post('/openPayment', async (req, res, next) => {
    try {
        var instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const options = {
            amount: 100 * 100,
            currency: "INR",
            receipt: "receipt_"
        };
        console.log(instance.paymentLink);
        const response = await instance.orders.create({
            "amount": 50000,
            "currency": "INR",
            "receipt": "receipt#1",
            "partial_payment": false,
            "notes": {
                "key1": "value3",
                "key2": "value2"
            }
        })

        // const order = await instance.orders.all();
        // console.log(order);
        return sendResponse(res, true, "Paid Sucessfully", response);


    } catch (error) {
        return sendErrorResponse(res, error.message, error);
    }

});


export default reviewRouter;