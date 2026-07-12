import ShiftApplicants from "../Models/ShiftApplicantsModel.js";
import mongoose from "mongoose";
import UserModels from "../Models/UserModels.js";
import { sendBulkNotification } from '../Utils/fcm.js';

const GetHopitalShiftApplicantsService = async () => {
    const response = await ShiftApplicants.aggregate([
        // Applicant
        {
            $lookup: {
                from: "users",
                localField: "workerId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                        }
                    }
                ],
                as: "applicant"
            }
        },
        {
            $unwind: {
                path: "$applicant",
                preserveNullAndEmptyArrays: true
            }
        },

        // Shift
        {
            $lookup: {
                from: "shifts",
                localField: "shiftId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            departmentId: 1,
                            designationId: 1,
                            payRate: 1
                        }
                    }
                ],
                as: "shift"
            }
        },
        {
            $unwind: {
                path: "$shift",
                preserveNullAndEmptyArrays: true
            }
        },

        // Department
        {
            $lookup: {
                from: "departments",
                localField: "shift.departmentId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            departmentName: 1
                        }
                    }
                ],
                as: "department"
            }
        },
        {
            $unwind: {
                path: "$department",
                preserveNullAndEmptyArrays: true
            }
        },

        // Designation
        {
            $lookup: {
                from: "designations",
                localField: "shift.designationId",
                foreignField: "_id",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            designationName: 1
                        }
                    }
                ],
                as: "designation"
            }
        },
        {
            $unwind: {
                path: "$designation",
                preserveNullAndEmptyArrays: true
            }
        },
    ]);

    return response;
};


const showInterestService = async (applicationData) => {
    const { hospitalId, ...data } = applicationData;
    const hospitalData = await UserModels.findById(hospitalId);
    const response = await ShiftApplicants.create(data);
    await sendBulkNotification(
        res,
        hospitalData.fcm,
        "New Shift Application",
        "A new user has applied for the shift. Please review the application."
    );
    return {
        response,
        hospitalData
    };
};


const actionService = async (actionData) => {
    const { sId, status, userId, hospitalName, shiftDate } = actionData;
    const response = await ShiftApplicants.findByIdAndUpdate(
        sId,
        {
            $set: {
                status,
                shiftStatus: "Yet To Start"
            }
        },
        {
            new: true,
            runValidators: true
        }
    );
    const userData = await UserModels.findById(userId);
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
    return {
        response,
        userData
    };
};


const getApplicantsService = async (shiftId) => {
    const response = await shiftApplicationSchema.aggregate([
        {
            $match: {
                shiftId: new mongoose.Types.ObjectId(shiftId)
            }
        },
        {
            $lookup: {
                from: "users",
                as: "userData",
                let: {
                    workerId: "$workerId"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$workerId"]
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
    return response;
};


const punchTimeService = async ({ id, type, workerId }) => {

    let update = {};

    if (type === "PunchIn") {
        update = {
            shiftStatus: "Ongoing",
            startTime: new Date().toISOString()
        };
    } else if (type === "PunchOut") {
        update = {
            shiftStatus: "Completed",
            endTime: new Date().toISOString()
        };
    } else {
        throw new Error("Invalid punch type");
    }

    const response = await ShiftApplicants.findByIdAndUpdate(
        id,
        {
            $set: update
        },
        {
            new: true,
            runValidators: true
        }
    );

    const userData = await UserModels.findById(workerId);
    if (type === "PunchIn") {
        await sendBulkNotification(res, userData.fcm, "Shift Punch-In Alert", `${userData.fullName} has punched in and started the scheduled shift.`);
    }
    else {
        await sendBulkNotification(res, userData.fcm, "Shift Punch-Out Alert", `${userData.fullName} has punched out and completed the scheduled shift.`);
    }
    return {
        response,
        userData
    };
};




export { GetHopitalShiftApplicantsService, showInterestService, actionService, getApplicantsService, punchTimeService };
