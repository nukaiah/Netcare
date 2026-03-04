import express from 'express';
import mongoose from 'mongoose';
const ShiftRouter = express.Router();
import { sendResponse, sendValidationResponse, sendDuplicateResponse, sendErrorResponse } from '../MiddleWares/Response.js';
import ShiftSchema from '../Models/ShiftPostModel.js';
import ShiftApplication from '../Models/ShiftApplication.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
import { sendBulkNotification } from '../MiddleWares/fcm.js';
import preferenceSchema from '../Models/PreferenceModel.js'
import { sendEmail } from '../MiddleWares/Email.js';


ShiftRouter.post('/create', checkAuth, async (req, res, next) => {
    try {
        const { locationId, departmentId } = req.body || {};
        const response = await ShiftSchema.create(req.body);
        const usersData = await preferenceSchema.aggregate([
            {
                $match: {
                    "preferredLocation.id": new mongoose.Types.ObjectId(locationId),
                    "preferredDepartments.id": new mongoose.Types.ObjectId(departmentId)
                }
            },
            {
                $lookup: {
                    from: "healthcareworkers",
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
        return sendResponse(res, true, "Shift created successfully", response);

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
        return sendErrorResponse(res, error.message);
    }
});

ShiftRouter.post('/getAllWeb', checkAuth, async (req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const limit = Math.min(Number(req.body.limit) || 10, 100);
        const skip = (page - 1) * limit;
        if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
            return sendErrorResponse(res, "Invalid hospital id");
        }
        const hospitalId = new mongoose.Types.ObjectId(req.body.id);
        const response = await ShiftSchema.aggregate([
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

        return sendResponse(res, true, "Shifts fetched", {
            shifts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });



    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});


ShiftRouter.post('/getAllMobile', async (req, res, next) => {
    try {
        const { preferredLocation, designationId } = req.body || {};
        const matchQuery = {};
        if (preferredLocation) {
            matchQuery.locationId = new mongoose.Types.ObjectId(preferredLocation);
        }
        if (designationId) {
            matchQuery.designationId = new mongoose.Types.ObjectId(designationId);
        }

        const page = Number(req.body.page) || 1;
        const limit = Math.min(Number(req.body.limit) || 10, 100);
        const skip = (page - 1) * limit;
        const response = await ShiftSchema.aggregate([
            { $match: matchQuery },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "shiftapplications",
                    as: "applicants",
                    let: { queryId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$shiftId", "$$queryId"] }
                            }
                        },
                        {
                            $project: {
                                workerId: 1,
                                status: 1
                            }
                        }
                    ]
                }
            },


        ]);
        return sendResponse(res, true, "Data found", response);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});

ShiftRouter.post('/getAllMyShifts', checkAuth, async (req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const limit = Math.min(Number(req.body.limit) || 10, 100);
        const skip = (page - 1) * limit;
        const workerObjectId = new mongoose.Types.ObjectId(req.userId);
        const response = await ShiftApplication.aggregate([
            { $match: { workerId: workerObjectId } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "shifts",
                    as: "shiftData",
                    let: { query: "$shiftId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$query"]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "reviews",
                                as: "reviewData",
                                let: { queryId: "$_id" },
                                pipeline:[
                                    {$match:{$expr:{$eq:["$shiftId","$$queryId"]}}}
                                ]

                            }
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: "$shiftData",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]);
        return sendResponse(res, true, "Shift found successfully", response);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});



export default ShiftRouter;
