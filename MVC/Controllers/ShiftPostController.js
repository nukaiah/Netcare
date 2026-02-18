import express from 'express';
import mongoose, { mongo } from 'mongoose';
const ShiftRouter = express.Router();
import { sendResponse, sendValidationResponse, sendDuplicateResponse, sendErrorResponse } from '../MiddleWares/Response.js';
import ShiftSchema from '../Models/ShiftPostModel.js';
import ShiftApplication from '../Models/ShiftApplication.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
import addressSchema from '../Models/AddressModel.js'
import { decrypt } from '../MiddleWares/EncryptDecrypt.js';
import { sendEmail, sendBulkEmails } from '../MiddleWares/Email.js';


ShiftRouter.post('/create', checkAuth, async (req, res, next) => {
    try {
        const { location } = req.body || {};
        const query = { city: location };
        const response = await ShiftSchema.create(req.body);
        const usersData = await addressSchema.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "healthcareworkers",
                    localField: "userId",
                    foreignField: "_id",
                    as: "users"
                }
            },
            { $unwind: "$users" },
            { $project: { email: "$users.email" } }
        ]);

        var data = usersData
            .filter(e => e.email)
            .map(e => decrypt(e.email));
        sendBulkEmails(data);
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
        return sendErrorResponse(res, false, error.message);
    }
});


ShiftRouter.post('/getAll', checkAuth, async (req, res, next) => {
    try {
        const query = { hospitalId: new mongoose.Types.ObjectId(req.body.id) };
        const response = await ShiftSchema.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "shiftapplications",
                    as: "applications",
                    let: { query: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$shiftId", "$$query"]
                                }
                            }
                        },
                        {
                            $project: {
                                workerId: 1,
                                status: 1
                            }
                        },
                        {
                            $lookup: {
                                from: "healthcareworkers",
                                as: "worker",
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
                                            fullName: 1,
                                            imageUrl: 1
                                        }
                                    }
                                ]
                            }

                        }
                    ]
                }
            }
        ]);
        return sendResponse(res, true, "Shift found Successfully", response);
    } catch (error) {
        return sendErrorResponse(res, false, error.message);
    }
});


ShiftRouter.post('/getAllMyShifts', checkAuth, async (req, res) => {
    try {
        const page = Number(req.body.page) || 1;
        const limit = Math.min(Number(req.body.limit) || 10, 100);
        const skip = (page - 1) * limit;
        const workerObjectId = new mongoose.Types.ObjectId(req.userId);
        const response = await ShiftApplication.aggregate([
            {
                $match: { workerId: workerObjectId },
            },
            { $sort: { createdAt: -1 } },
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
                                from: "healthcareworkers",
                                as: "hospitalData",
                                let: { query: "$hospitalId" },
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
                                            fullName: 1,
                                            verificationStatus: 1
                                        }
                                    }
                                ]
                            },
                        },
                        {
                            $unwind: {
                                path: "$hospitalData",
                                preserveNullAndEmptyArrays: true
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
        return sendErrorResponse(res, false, error.message);
    }
});

ShiftRouter.post('/getAllMobile', checkAuth, async (req, res, next) => {
    try {
        const response = await ShiftSchema.aggregate([
            {
                $lookup: {
                    from: "healthcareworkers",
                    as: "hospitalData",
                    let: { queryId: "$hospitalId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$queryId"]
                                }
                            }
                        },
                        {
                            $project: {
                                fullName: 1,
                                verificationStatus: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "shiftapplications",
                    as: "applicants",
                    let: { queryId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$shiftId", "$$queryId"]
                                }
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
            {
                $unwind: {
                    path: "$hospitalData",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);
        return sendResponse(res, true, "Data found", response);
    } catch (error) {
        return sendErrorResponse(res, false, error.message);
    }

});





export default ShiftRouter;
