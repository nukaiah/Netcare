import mongoose from "mongoose";
import ShiftApplication from "../Models/ShiftApplicantionModel.js";
import UserModels from "../Models/UserModels.js";
import { sendBulkNotification } from '../Utils/fcm.js';
import Shifts from "../Models/ShiftPostModel.js";



const GetHopitalShiftApplicantsService = async () => {
    const response = await ShiftApplication.aggregate([
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
        }
    ]);

    return response;
};


const applyShiftService = async (res, applicationData) => {
    const { hospitalId } = applicationData;

    const [response, hospitalData] = await Promise.all([
        ShiftApplication.create(applicationData),
        UserModels.findById(hospitalId).select("fcm")
    ]);

    if (hospitalData?.fcm) {
        try {
            await sendBulkNotification(
                res,
                hospitalData.fcm,
                "New Shift Application",
                "A healthcare worker has applied for your shift. Please review the application."
            );
        } catch (error) {
            console.error("FCM Notification Error:", error.message);
        }
    }

    return response;
};


const cancelShiftByAdminService = async (res, shiftId) => {
    const response = await Shifts.findByIdAndUpdate(shiftId, { $set: { "status": "Cancelled" } }, { runValidators: true });
    if (!response) {
        throw new Error("Shift not found.");
    }
    const applications = await ShiftApplication.find({ shiftId, status: "Approved" }).select("workerId");
    const workerIds = applications.map(item => item.workerId);
    const usersData = await UserModels.find({ _id: { $in: workerIds } }).select("fcm");
    const userFcms = usersData.flatMap(user => user.fcm || []);
    await sendBulkNotification(
        res,
        userFcms,
        "Shift Cancelled",
        "This shift has been cancelled by the Hospital Admin."
    );
    return response;
};

const cancelShiftByWorkerService = async (res, workerCancellationData) => {
    const { shiftId, workerId, hospitalId, reason } = workerCancellationData;

    // Get Shift
    const shift = await Shifts.findById(shiftId)
        .select("shiftStartDate startTime payRate");

    if (!shift) {
        throw new Error("Shift not found.");
    }

    // Create Shift Start DateTime
    const shiftDate = shift.shiftStartDate.toISOString().split("T")[0];
    const shiftStart = new Date(`${shiftDate}T${shift.startTime}:00`);

    const now = new Date();
    console.log("Date:", shiftDate);
    console.log("Time:", shift.startTime);
    console.log("Combined:", `${shiftDate}T${shift.startTime}:00`);


    // Prevent cancellation after shift start
    if (now >= shiftStart) {
        throw new Error("Shift has already started.");
    }

    // Calculate Notice Hours
    const noticeHours = Number(
        ((shiftStart.getTime() - now.getTime()) / (1000 * 60 * 60)).toFixed(2)
    );

    const penaltyApplicable = noticeHours < 4;
    console.log(noticeHours);

    const cancellationData = {
        isCancelled: true,
        cancelledBy: "Worker",
        cancelledById: workerId,
        cancelledAt: new Date(),
        reason,
        noticeHours,
        penaltyApplicable,
        penaltyHours: penaltyApplicable ? 4 : 0,
        penaltyAmount: penaltyApplicable ? shift.payRate * 4 : 0
    };
    console.log(cancellationData);

    const response = await ShiftApplication.findOneAndUpdate(
        {
            shiftId,
            workerId,
        },
        {
            $set: {
                status: "Cancelled",
                cancellation: cancellationData
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!response) {
        throw new Error("Approved shift application not found.");
    }

    // Notify Hospital
    const hospital = await UserModels.findById(hospitalId).select("fcm");

    if (hospital?.fcm?.length) {
        try {
            await sendBulkNotification(
                res,
                hospital.fcm,
                "Shift Cancelled",
                "A healthcare worker has cancelled an approved shift."
            );
        } catch (error) {
            console.error("Notification Error:", error.message);
        }
    }

    return response;
};


const actionService = async (res, actionData) => {
    const { sId, status, userId, hospitalName, shiftDate } = actionData;
    const response = await ShiftApplication.findByIdAndUpdate(
        sId,
        {
            $set: {
                status
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
    const response = await ShiftApplication.aggregate([
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


const punchTimeService = async (res, punchData) => {
    const { sId, type, workerId } = punchData

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

    const response = await ShiftApplication.findByIdAndUpdate(
        sId,
        {
            $set: update
        },
        {
            new: true,
            runValidators: true
        }
    );

    const userData = await UserModels.findById(workerId);
    console.log(userData);
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



export {
    GetHopitalShiftApplicantsService,
    applyShiftService,
    cancelShiftByAdminService,
    cancelShiftByWorkerService,
    actionService,
    getApplicantsService,
    punchTimeService
};
