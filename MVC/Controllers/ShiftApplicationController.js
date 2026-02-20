import express from 'express';
import shiftApplicationSchema from '../Models/ShiftApplication.js';
import { sendResponse, sendValidationResponse, sendDuplicateResponse, sendErrorResponse } from '../MiddleWares/Response.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
const shiftApplicationRouter = express.Router();
import mongoose from 'mongoose';

shiftApplicationRouter.post('/showInterest', checkAuth, async (req, res, next) => {
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


shiftApplicationRouter.post("/getById",checkAuth, async (req, res, next) => {
    try {
        const { shiftId } = req.body || {};
        if (!shiftId) {
            return sendValidationResponse(res, "Shift Id is missing");
        }
        const response = await shiftApplicationSchema.aggregate(
            [
                { $match: { "shiftId": new mongoose.Types.ObjectId(shiftId) } },
                {
                    $lookup: {
                        from: "healthcareworkers",
                        as: "userData",
                        let: { query: "$workerId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$query"]
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: 1,
                                    fullName: 1,
                                    imageUrl: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: {
                        path: "$userData",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]);
        return sendResponse(res, true, "Applicants found", response);
    } catch (error) {
        return sendErrorResponse(res, false, error.message);
    }

});


shiftApplicationRouter.post("/punchTime", checkAuth,async (req, res, next) => {
    try {
        const { sId,type } = req.body || {};
        let query = {};
        let message;
        if (type === "PunchIn") {
            query = { "startTime": new Date().toISOString() };
            message = "PunchIn success";
        }
        else if (type === "PunchOut") {
            query = { "endTime": new Date().toISOString() };
            message = "PunchOut success";
        }
        else {
            return sendValidationResponse(res, "Invlid punch type");
        }
        const response = await shiftApplicationSchema.findByIdAndUpdate(sId,{ $set: query }, { runValidators: true, new: true });
        return sendResponse(res, true, message, response);
    } catch (error) {
        return sendErrorResponse(res, false, error.message);
    }
});


export default shiftApplicationRouter;

