import express from 'express';
import mongoose from 'mongoose';
import healthCareWorkerSchema from '../Models/HealthCareWorkerModel.js';
import { decrypt, encrypt } from '../MiddleWares/EncryptDecrypt.js';
import { sendResponse, sendErrorResponse, sendLoginResponse, sendValidationResponse, sendNotFoundResponse, sendDuplicateResponse } from '../MiddleWares/Response.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import upload, { deleteFile } from '../MiddleWares/UploadFile.js';

import { checkAuth } from '../MiddleWares/CheckAuth.js';
import { comparePassword, hashPassword } from '../MiddleWares/PasswordHash.js';
import { sendEmail } from '../MiddleWares/Email.js';
import crypto from 'crypto';
import otpSchema from '../Models/OTPModel.js';
import { verificationStatusTemplate, onboardingTemplate, forgotPasswordOtpTemplate } from "../MiddleWares/EmailotpTemplate.js";
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
        const response = await healthCareWorkerSchema.create(req.body);
        const workerResponse = response.toObject();
        delete workerResponse.password;

        const template = onboardingTemplate(req.body.fullName, req.body.email, req.body.password, req.body.roleId);
        const emailResponse = await sendEmail(req.body.email, template.subject, template.html);
        return sendResponse(res, true, `Hey ${req.body.fullName} your account created successfully.Thank you.`, workerResponse);
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
        delete workerResponse.fcm;

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


healthcareworkerRouter.post('/updateProfile', checkAuth, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return sendValidationResponse(res, [
                { field: 'imageUrl', message: 'File is required and must be an image' }
            ]);
        }

        const response = await healthCareWorkerSchema.findByIdAndUpdate(
            req.userId,
            { $set: { imageUrl: req.file.filename } },
            { new: false }
        );
        if (!response) {
            deleteFile(`uploads/${req.file.filename}`);
        }
        if (response?.imageUrl) {
            deleteFile(`uploads/${response.imageUrl}`);
        }

        return sendResponse(res, true, "Profile image updated", {
            imageUrl: req.file.filename
        });

    } catch (error) {
        deleteFile(`uploads/${req.file.filename}`);
        return sendErrorResponse(res, error.message, {});
    }
}
);


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
        const template = verificationStatusTemplate(verificationStatus, response.fullName);
        const emailResponse = await sendEmail(response.email, template.subject, template.html);

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


healthcareworkerRouter.post("/ForgotPassword", async (req, res) => {
    try {
        const { email } = req.body || {};

        if (!email) {
            return sendValidationResponse(res, [
                { field: "email", message: "Email is required" }
            ]);
        }

        const user = await healthCareWorkerSchema.findOne({ email });

        if (!user) {
            return sendNotFoundResponse(res, "No user found on this email");
        }
        await otpSchema.deleteMany({ emailMobile: user.email, type: "ForgotPassword", isUsed: false });
        const emailOtp = crypto.randomInt(100000, 1000000);
        const data = {
            type: "ForgotPassword",
            mode: "Email",
            emailMobile: user.email,
            otp: emailOtp.toString(),
            expireDate: new Date(Date.now() + 10 * 60 * 1000),
        };
        const response = await otpSchema.create(data);
        const template = forgotPasswordOtpTemplate(emailOtp, user.fullName);
        const emailResponse = await sendEmail(user.email, template.subject, template.html);
        return sendResponse(res, true, "Password reset link sent to your email");

    } catch (error) {
        return sendErrorResponse(res, error.message, {});
    }
});

healthcareworkerRouter.post('/Updatepassword', async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email) {
            return sendValidationResponse(res, [
                { field: "email", message: "Email is required" }
            ]);
        }
        if (!password) {
            return sendValidationResponse(res, [
                { field: "password", message: "Password is required" }
            ]);
        }
        const user = await healthCareWorkerSchema.findOne({ email }).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });
        user.password = password;
        await user.save(); 
        return sendResponse(res, true, "Password Changed Successfully");
    } catch (error) {
        console.log(error.message);
        return sendErrorResponse(res, error.message);

    }

});


export default healthcareworkerRouter;







