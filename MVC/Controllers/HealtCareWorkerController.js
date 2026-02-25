import express from 'express';
import mongoose from 'mongoose';
import healthCareWorkerSchema from '../Models/HealthCareWorkerModel.js';
import { decrypt } from '../MiddleWares/EncryptDecrypt.js';
import { sendResponse, sendErrorResponse, sendLoginResponse, sendValidationResponse, sendNotFoundResponse, sendDuplicateResponse } from '../MiddleWares/Response.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import upload from '../MiddleWares/UploadFile.js';
dotenv.config();
import { checkAuth } from '../MiddleWares/CheckAuth.js';
import { comparePassword, hashPassword } from '../MiddleWares/PasswordHash.js';
const healthcareworkerRouter = express.Router();



healthcareworkerRouter.post('/signUp', async (req, res, next) => {
    try {
        const { email, mobileNumber } = req.body || {};
        if (!healthCareWorkerSchema.validateEmail(email)) {
            return sendValidationResponse(res, [{ field: 'email', message: `${email} is not a valid email!` }]);

        }
        if (!healthCareWorkerSchema.validateMobileNumber(mobileNumber)) {
            return sendValidationResponse(res, [{ field: 'mobileNumber', message: `${mobileNumber} is not a valid email!` }]);

        }
        const result = await healthCareWorkerSchema.create(req.body);
        return sendResponse(res, true, `Hey ${req.body.fullName} your account created successfully.Thank you.`, result);
    } catch (error) {
        if (error.code === 11000) {
            return sendDuplicateResponse(res, `${Object.keys(error.keyValue)[0]} is alreay existed`);
        }
        if (error.name == "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        return sendErrorResponse(res, error.message);
    }
});


healthcareworkerRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email) {
            return sendValidationResponse(res, "Email is required");
        }

        if (!password) {
            return sendValidationResponse(res, "Password is required");
        }
        const emailQuery = { "email": email };
        const response = await healthCareWorkerSchema.findOne(emailQuery).select('+password');
        if (!response) {
            return sendNotFoundResponse(res, "No account found with email");
        }
        var isMatched = await comparePassword(password, response.password);
        if (!isMatched) {
            return res.status(401).json({ status: false, message: 'Incorrect password' });
        }
        const workerResponse = response.toObject();
        delete workerResponse.password;

        const jwttoken = jwt.sign({
            _id: workerResponse._id,
            roleId: workerResponse.roleId,
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            },
        );
        return sendLoginResponse(res, workerResponse, jwttoken);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});


healthcareworkerRouter.post('/getAll', checkAuth, async (req, res, next) => {
    try {
        const roleId = req.body.roleId;
        const page = Number(req.body.page) || 1;
        const limit = Math.min(Number(req.body.limit) || 10, 100);
        const skip = (page - 1) * limit;
        const result = await healthCareWorkerSchema.find({ "roleId": roleId }).skip(skip).limit(limit).sort({ createdAt: -1 });
        if (result) {
            return sendResponse(res, true, "Users found sucessfully", result);
        }
        else {
            return sendResponse(res, false, "Failed to find users", result);
        }
    } catch (error) {
        return sendErrorResponse(res, error.message, {});

    }
});


healthcareworkerRouter.post('/updateDetails', checkAuth, async (req, res, next) => {
    try {
        const { dob, gender, designationId } = req.body || {};

        if (!dob) {
            return sendValidationResponse(res, [{ field: 'dob', message: 'DOB is required' }]);
        }
        if (!gender) {
            return sendValidationResponse(res, [{ field: 'gender', message: 'Gender is required' }]);
        }

        const allowedGenders = ["Male", "Female", "Other"];
        if (!allowedGenders.includes(gender)) {
            return sendValidationResponse(res, [{ field: 'gender', message: 'Gender must be Male, Female, or Other' }]);
        }

        // if (!designationId) {
        //     return sendValidationResponse(res, [{ field: 'designationId', message: 'Designation is required' }]);
        // }

        const result = await healthCareWorkerSchema.findByIdAndUpdate(
            req.userId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        return sendResponse(res, true, "Profile details updated", result);

    } catch (error) {
        return sendErrorResponse(res, error.message, {});
    }
});


healthcareworkerRouter.post('/updateProfile', checkAuth, upload.single("file"), async (req, res, next) => {
    try {
        if (!req.file) {
            return sendValidationResponse(res, [{ field: 'imageUrl', message: 'File is required and must be an image' }]);
        }

        const data = { imageUrl: req.file.filename };

        const result = await healthCareWorkerSchema.findByIdAndUpdate(
            req.userId,
            { $set: data },
            { new: true, runValidators: true }
        );

        return sendResponse(res, true, "Profile image updated", result);
    } catch (error) {

        return sendErrorResponse(res, error.message, {});
    }
});

healthcareworkerRouter.post('/updateVerificationStatus', checkAuth, async (req, res, next) => {
    try {
        const { userId, verificationStatus } = req.body || {};
        if (!userId) {
            return sendValidationResponse(res, [{ field: 'userId', message: 'userId is required' }]);
        }

        if (!verificationStatus) {
            return sendValidationResponse(res, [{ field: 'verificationStatus', message: 'Verification status is required' }]);
        }

        const response = await healthCareWorkerSchema.findByIdAndUpdate(userId, { $set: { verificationStatus } }, { runValidators: true, new: true });

        if (!response) {
            return sendErrorResponse(res, "Data not found");
        }

        return sendResponse(res, true, "Verification status updated successfully", response);

    } catch (error) {
        return sendErrorResponse(res, error.message, {});
    }
}
);


healthcareworkerRouter.post('/updateFcm', checkAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { fcm, type } = req.body;

        if (!fcm) {
            return sendValidationResponse(res, "fcm key is missing");
        }

        let updateQuery = {};

        if (type === "Login") {
            updateQuery = { $addToSet: { fcm: fcm } };
        } else if (type === "Logout") {
            updateQuery = { $pull: { fcm: fcm } };
        } else {
            return sendValidationResponse(res, "Invalid type");
        }

        const response = await healthCareWorkerSchema.findByIdAndUpdate(
            userId,
            updateQuery,
            { runValidators: true, new: true }
        );

        return sendResponse(res, true, "FCM updated successfully", response);

    } catch (error) {
        return sendErrorResponse(res, error.message, {});
    }
});


healthcareworkerRouter.post('/getCurrentUser', checkAuth, async (req, res, next) => {
    try {

        const query = { _id: new mongoose.Types.ObjectId(req.userId) };

        const response = await healthCareWorkerSchema.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(req.userId) } },
            { $unset: "password" },
            {
                $lookup: {
                    from: "addresses",
                    let: { userId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
                        {
                            $lookup: {
                                from: "locations",
                                let: { cityId: "$cityId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$cityId"] } } },
                                    { $project: { _id: 0, name: 1 } }
                                ],
                                as: "cityData"
                            }
                        },
                        { $unwind: { path: "$cityData", preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: "locations",
                                let: { stateId: "$stateId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$stateId"] } } },
                                    { $project: { _id: 0, name: 1 } }
                                ],
                                as: "stateData"
                            }
                        },
                        { $unwind: { path: "$stateData", preserveNullAndEmptyArrays: true } },
                        {
                            $addFields: {
                                city: "$cityData.name",
                                state: "$stateData.name"
                            }
                        },
                        { $project: { cityData: 0, stateData: 0 } }
                    ],
                    as: "addressData"
                }
            },

            { $unwind: { path: "$addressData", preserveNullAndEmptyArrays: true } },
            { $addFields: { addressData: { $ifNull: ["$addressData", {}] } } }
        ]);

        const data = response.map(u => ({
            ...u,
            email: decrypt(u.email),
            mobileNumber: decrypt(u.mobileNumber),
        }));
        return sendResponse(res, true, 'User found', data);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});


healthcareworkerRouter.post('/getById', checkAuth, async (req, res, next) => {
    try {
        const { userId } = req.body || {};
        if (!userId) {
            return sendValidationResponse(res, "User id is missing");
        }
        const query = { _id: new mongoose.Types.ObjectId(userId) };

        const response = await healthCareWorkerSchema.aggregate([
            {
                $match: query
            },
            { $unset: "password" },
            {
                $lookup: {
                    from: "bankdetails",
                    as: "bankData",
                    localField: "_id",
                    foreignField: "userId"
                }
            },
            {
                $lookup: {
                    from: "experiences",
                    as: "experiencesData",
                    localField: "_id",
                    foreignField: "userId"
                }
            },
            {
                $lookup: {
                    from: "qualifications",
                    as: "qualificationsData",
                    localField: "_id",
                    foreignField: "userId"
                },
            },
            {
                $lookup: {
                    from: "preferences",
                    as: "preferencesData",
                    localField: "_id",
                    foreignField: "userId"
                }
            },
            {
                $lookup: {
                    from: "addresses",
                    as: "addressData",
                    let: { query: "$_id" },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$userId", "$$query"] } }
                        },
                        {
                            $lookup: {
                                from: "locations",
                                let: { cityId: "$cityId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$cityId"] } } },
                                    { $project: { _id: 0, name: 1 } }
                                ],
                                as: "cityData"
                            }
                        },
                        { $unwind: { path: "$cityData", preserveNullAndEmptyArrays: true } },
                        {
                            $lookup: {
                                from: "locations",
                                let: { stateId: "$stateId" },
                                pipeline: [
                                    { $match: { $expr: { $eq: ["$_id", "$$stateId"] } } },
                                    { $project: { _id: 0, name: 1 } }
                                ],
                                as: "stateData"
                            }
                        },
                        { $unwind: { path: "$stateData", preserveNullAndEmptyArrays: true } },
                        {
                            $addFields: {
                                city: "$cityData.name",
                                state: "$stateData.name"
                            }
                        },
                        { $project: { cityData: 0, stateData: 0 } }
                    ]
                },

            },
            {
                $unwind: {
                    path: "$addressData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$bankData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$preferencesData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    bankData: { $ifNull: ["$bankData", {}] },
                    preferencesData: { $ifNull: ["$preferencesData", {}] },
                    addressData: { $ifNull: ["$addressData", {}] },
                }
            }
        ]
        );

        const data = response.map(u => ({
            ...u,
            email: decrypt(u.email),
            mobileNumber: decrypt(u.mobileNumber),
            bankData: u.bankData && Object.keys(u.bankData).length
                ? {
                    ...u.bankData,
                    accountHolderName: decrypt(u.bankData.accountHolderName),
                    branchName: decrypt(u.bankData.branchName),
                    accountNumber: decrypt(u.bankData.accountNumber),
                    branchCode: decrypt(u.bankData.branchCode),
                    universalBranchCode: decrypt(u.bankData.universalBranchCode),
                }
                : {}
        }));
        return sendResponse(res, true, 'User found', data);
    } catch (error) {
        return sendErrorResponse(res, error.message);
    }
});




export default healthcareworkerRouter;







