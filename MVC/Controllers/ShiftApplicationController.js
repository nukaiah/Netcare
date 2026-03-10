import express from 'express';
import shiftApplicationSchema from '../Models/ShiftApplication.js';
import { sendResponse, sendValidationResponse, sendDuplicateResponse, sendErrorResponse } from '../MiddleWares/Response.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
const shiftApplicationRouter = express.Router();
import mongoose from 'mongoose';
import healthCareWorkerSchema from '../Models/HealthCareWorkerModel.js';
import { sendBulkNotification } from '../MiddleWares/fcm.js';



shiftApplicationRouter.post('/showInterest', checkAuth, async (req, res) => {
    try {

        const { hospitalId, ...applicationData } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
            return sendValidationResponse(res, "Invalid hospitalId");
        }

        const hospitalData = await healthCareWorkerSchema.findById(hospitalId);

        if (!hospitalData) {
            return sendValidationResponse(res, "Hospital not found");
        }

        const response = await shiftApplicationSchema.create(applicationData);

        await sendBulkNotification(
            res,
            hospitalData.fcm,
            "New Shift Application",
            "A new user has applied for the shift. Please review the application."
        );

        return sendResponse(res, true, "Applied successful", response);

    } catch (error) {

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));
            return sendValidationResponse(res, errors);
        }

        if (error.code === 11000) {
            return sendValidationResponse(res, "You already applied for this shift");
        }

        return sendErrorResponse(res, error.message);
    }
});


shiftApplicationRouter.post('/action', checkAuth, async (req, res) => {
    try {

        const { sId, status, userId, hospitalName, shiftDate } = req.body || {};

        const response = await shiftApplicationSchema.findByIdAndUpdate(
            sId,
            { $set: { status: status, shiftStatus: "Yet To Start" } },
            { runValidators: true, new: true }
        );

        const userData = await healthCareWorkerSchema.findById(userId);

        if (status === "Approved") {
            await sendBulkNotification(
                res,
                userData.fcm,
                "Shift Application Approved 🎉",
                `Good news! Your application for ${hospitalName} on ${shiftDate} has been approved.`
            );
        } else {
            await sendBulkNotification(
                res,
                userData.fcm,
                "Shift Application Update",
                `Your application for ${hospitalName} on ${shiftDate} was not selected this time.`
            );
        }

        return sendResponse(res, true, "Status updated", response);

    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});


shiftApplicationRouter.post("/getById", checkAuth, async (req, res, next) => {
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
        return sendErrorResponse(res, error.message);
    }

});


shiftApplicationRouter.post("/punchTime", checkAuth, async (req, res, next) => {
    try {
        const { sId, type, workerId } = req.body || {};
        let query = {};
        let message;
        if (type === "PunchIn") {
            query = { "shiftStatus": "Ongoing", "startTime": new Date().toISOString() };
            message = "PunchIn success";
        }
        else if (type === "PunchOut") {
            query = { "shiftStatus": "Completed", "endTime": new Date().toISOString() };
            message = "PunchOut success";
        }
        else {
            return sendValidationResponse(res, "Invlid punch type");
        }
        const response = await shiftApplicationSchema.findByIdAndUpdate(sId, { $set: query }, { runValidators: true, new: true });
        const userData = await healthCareWorkerSchema.findById(workerId);
        if (type === "PunchIn") {
            await sendBulkNotification(res, userData.fcm, "Shift Punch-In Alert", `${userData.fullName} has punched in and started the scheduled shift.`);
        }
        else {
            await sendBulkNotification(res, userData.fcm, "Shift Punch-Out Alert", `${userData.fullName} has punched out and completed the scheduled shift.`);
        }
        return sendResponse(res, true, message, response);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});


export default shiftApplicationRouter;

