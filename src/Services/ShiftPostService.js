import Shifts from "../Models/ShiftPostModel.js";
import ShiftApplication from "../Models/ShiftApplicantionModel.js";
import Preference from "../Models/PreferenceModel.js";
import { sendBulkNotification } from "../Utils/fcm.js";
import mongoose from "mongoose";

const createShiftService = async (shiftData, res) => {
    const { locationId, departmentId } = shiftData || {};
    const response = await Shifts.create(shiftData);
    const usersData = await Preference.aggregate([
        {
            $match: {
                "preferredLocation.id": new mongoose.Types.ObjectId(locationId),
                "preferredDepartments.id": new mongoose.Types.ObjectId(departmentId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "users"
            }
        },
        { $unwind: "$users" },
        { $project: { fcm: "$users.fcm" } }
    ]);
    const tokens = [
        ...new Set(
            usersData
                .filter(e => e.fcm?.length)
                .flatMap(e => e.fcm)
        )
    ];
    
    await sendBulkNotification(res, tokens, "🏥 Shift Match Found", `A ${response.departmentName} shift in ${response.locationName} matches your preferences.`);
    return response;
};


const getWebShiftService = async (paginatedData) => {
    console.log(paginatedData);
    const page = Number(paginatedData.page) || 1;
    const limit = Math.min(Number(paginatedData.limit) || 10, 100);
    const skip = (page - 1) * limit;
    const hospitalId = new mongoose.Types.ObjectId(paginatedData.id);
    const response = await Shifts.aggregate([
        { $match: { hospitalId } },
        {
            $facet: {
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $lookup: {
                            from: "shiftapplications",
                            let: { shiftId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$shiftId", "$$shiftId"] }
                                    }
                                },
                                { $limit: 3 },

                                {
                                    $lookup: {
                                        from: "healthcareworkers",
                                        let: { workerId: "$workerId" },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: { $eq: ["$_id", "$$workerId"] }
                                                }
                                            },
                                            {
                                                $project: {
                                                    _id: 1,
                                                    fullName: 1,
                                                    imageUrl: 1
                                                }
                                            }
                                        ],
                                        as: "user"
                                    }
                                },
                                { $unwind: "$user" },
                                {
                                    $replaceRoot: { newRoot: "$user" }
                                }
                            ],
                            as: "applicants"
                        }
                    }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        },

    ]);
    const aggResult = response[0];
    const shifts = aggResult.data || [];
    const total = aggResult.totalCount[0]?.count || 0;
    return {
        shifts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};


const getMobileShiftService = async (preferenceData) => {
    const { preferredLocation, designationId, page, limit, userId } = preferenceData || {};
    const matchQuery = {
        "designationId": new mongoose.Types.ObjectId(designationId),
        "locationId": new mongoose.Types.ObjectId(preferredLocation),
        "status": "Open"
    };
    const skip = (page - 1) * limit;
    const response = await Shifts.aggregate([
        { $match: matchQuery },
        { $sort: { createdAt: 1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $lookup: {
                from: "shiftapplications",
                let: {
                    shiftId: "$_id",
                    userId: new mongoose.Types.ObjectId(userId)
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$shiftId", "$$shiftId"] },
                                    { $eq: ["$workerId", "$$userId"] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            userId: 1,
                            status: 1
                        }
                    }
                ],
                as: "application"
            }
        },
    ]);
    console.log(response);
    return response;
};


const getAllMyShiftService = async (userId, paginatedData) => {
    console.log("User ID:", userId);
    console.log("Paginated Data:", paginatedData);


    const page = Number(paginatedData.page) || 1;
    const limit = Math.min(Number(paginatedData.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const workerObjectId = new mongoose.Types.ObjectId(userId);
    const response = await ShiftApplication.aggregate([
        {
            $match: { workerId: workerObjectId, "status": paginatedData.status }
        },
        {
            $sort: { createdAt: 1 }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: "shifts",
                as: "shiftData",
                let: {
                    shiftId: "$shiftId",
                    workerId: workerObjectId
                },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$shiftId"] }
                        }
                    },
                    {
                        $lookup: {
                            from: "reviews",
                            as: "reviewData",
                            let: {
                                shiftId: "$_id",
                                workerId: "$$workerId"
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$shiftId", "$$shiftId"] },
                                                { $eq: ["$targetId", "$$workerId"] }
                                            ]
                                        }
                                    }
                                }
                            ],

                        }
                    }
                ],

            }
        },
        {
            $unwind: {
                path: "$shiftData",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $unwind: {
                path: "$shiftData.reviewData",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                "shiftData.reviewData": {
                    $ifNull: ["$shiftData.reviewData", {}]
                }
            }
        }
    ]);
    return response;

};


const updateShiftStausService = async (shiftData) => {
    const { id, status } = shiftData || {};
    const response = await Shifts.findByIdAndUpdate(id, { $set: { status: status } }, { runValidators: true, new: true });
    return response;
};


const getWebDashboardAnalyticsService = async (hospitalId) => {
    const response = await Shifts.aggregate([
        {
            $match: {
                hospitalId: new mongoose.Types.ObjectId(hospitalId)
            }
        },
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                }
            }
        }
    ]);

    const analytics = {
        total: 0,
        Open: 0,
        Closed: 0,
        Cancelled: 0,
        Completed: 0
    };

    response.forEach(({ _id, count }) => {
        analytics[_id] = count;
        analytics.total += count;
    });

    return analytics;
};

const getShiftByIdService = async (userId,shiftId) => {
    const result = await Shifts.aggregate([
        { $match: { "_id": new mongoose.Types.ObjectId(shiftId) } },
        {
            $lookup: {
                from: "shiftapplications",
                let: {
                    shiftId: "$_id",
                    userId: new mongoose.Types.ObjectId(userId)
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$shiftId", "$$shiftId"] },
                                    { $eq: ["$workerId", "$$userId"] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            userId: 1,
                            status: 1
                        }
                    }
                ],
                as: "application"
            }
        },
    ]);
    return result;
};




export { createShiftService, getWebShiftService, getMobileShiftService, getAllMyShiftService, updateShiftStausService, getWebDashboardAnalyticsService, getShiftByIdService };
