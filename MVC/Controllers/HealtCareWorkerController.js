import express from 'express';
import mongoose from 'mongoose';
import healthCareWorkerSchema from '../Models/HealthCareWorkerModel.js';
import { encrypt, decrypt } from '../MiddleWares/EncryptDecrypt.js';
import { sendResponse, sendErrorResponse, sendLoginResponse, sendValidationResponse, sendNotFoundResponse } from '../MiddleWares/Response.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import upload from '../MiddleWares/UploadFile.js';
dotenv.config();
import { checkAuth } from '../MiddleWares/CheckAuth.js';
import { comparePassword, hashPassword } from '../MiddleWares/PasswordHash.js';
const healthcareworkerRouter = express.Router();



healthcareworkerRouter.post('/signUp', async (req, res, next) => {
    try {
        const healthcareworkerData = req.body;
        const result = await healthCareWorkerSchema.insertOne(healthcareworkerData);
        if (result) {
            return sendResponse(res, true, `Hey ${req.body.fullName} your account created successfully.Thank you.`, result);
        }
        else {
            return sendResponse(res, false, "Failed to create your account", result);
        }
    } catch (error) {
        console.log(error.name);
        if (error.code === 11000) {
            return sendValidationResponse(res, `${Object.keys(error.keyValue)[0]} is alreay existed`);
        }
        if (error.name == "ValidationError") {
            const errors = Object.values(error.errors).map(err => ({ field: err.path, message: err.message }));
            return sendValidationResponse(res, errors);
        }
        return sendErrorResponse(res, false, error.message);
    }
});


healthcareworkerRouter.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
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
            'this is login data',
            {
                expiresIn: "24h"
            },
        );
        return sendLoginResponse(res, workerResponse, jwttoken);
    } catch (error) {
        return sendErrorResponse(res, false, error.message);
    }
});


healthcareworkerRouter.post('/getById', checkAuth, async (req, res, next) => {
    try {

        const query = { _id: new mongoose.Types.ObjectId(req.body.userId) };

        const response = await healthCareWorkerSchema.aggregate([
            {
                $match: query
            },
            { $unset: "password" },
            {
                $lookup: {
                    from: "addresses",
                    as: "addressData",
                    let: { query: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userId", "$$query"]
                                }
                            }
                        }
                    ]


                }
            },
            {
                $lookup: {
                    from: "bankdetails",
                    as: "bankData",
                    let: { query: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userId", "$$query"]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "experiences",
                    as: "experiencesData",
                    let: { query: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userId", "$$query"]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "qualifications",
                    as: "qualificationsData",
                    let: { query: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userId", "$$query"]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "preferences",
                    as: "preferencesData",
                    let: { query: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userId", "$$query"]
                                }
                            }
                        }
                    ]
                }
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
                    addressData: { $ifNull: ["$addressData", {}] },
                    bankData: { $ifNull: ["$bankData", {}] },
                    preferencesData: { $ifNull: ["$preferencesData", {}] },
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
        return sendErrorResponse(res, false, error.message);
    }
});


healthcareworkerRouter.post('/getAll', checkAuth, async (req, res, next) => {
    try {
        const roleId = req.body.roleId;
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const skip = (page - 1) * limit;

        const result = await healthCareWorkerSchema.find({ "roleId": roleId }).skip(skip).limit(limit).sort({ createdAt: -1 });


        if (result) {
            return sendResponse(res, true, "Users found sucessfully", result);
        }
        else {
            return sendResponse(res, false, "Failed to find users", result);
        }
    } catch (error) {
        return sendErrorResponse(res, false, error.message, {});

    }

});


healthcareworkerRouter.post('/updateDetails', checkAuth, async (req, res, next) => {
    try {
        const  updatedData   = req.body || {};
        if(!updatedData.dob){
            return sendValidationResponse(res, "Dob is required");
        }
        if(!updatedData.gender){
            return sendValidationResponse(res, "Gender is required");
        }

        const result = await healthCareWorkerSchema.findByIdAndUpdate( req.userId, { $set: updatedData }, { new: true, runValidators: true });
        return sendResponse(res, true, "Profile details updated", result);
    } catch (error) {
        console.log(error.message);
        return sendErrorResponse(res, false, error.message, {})
    }
});

healthcareworkerRouter.post('/updateProfile', checkAuth, upload.single("file"), async (req, res, next) => {
    try {
        if (!req.file) {
            return sendErrorResponse(res, false, "No file uploaded");
        }
        const data1 = {
            "imageUrl": req.file.filename
        };

        const result = await healthCareWorkerSchema.findByIdAndUpdate( req.userId, { $set: data1 }, { new: true, runValidators: true });
        return sendResponse(res, true, "Profile image updated", result);
    } catch (error) {
        return sendErrorResponse(res, false, error.message, {})
    }
});


healthcareworkerRouter.post('/updateVerificationStatus', checkAuth, async (req, res, next) => {
    try {
        const { userId, verificationStatus } = req.body || {};
        if (!userId) {
            return sendErrorResponse(res, false, "Id is required");
        }

        if (!verificationStatus) {
            return sendErrorResponse(res, false, "Verification status is required");
        }

        const response = await healthCareWorkerSchema.findByIdAndUpdate(userId, { $set: {verificationStatus} }, { runValidators: true, new: true });

        if (!response) {
            return sendErrorResponse(res, false, "Data not found");
        }

        return sendResponse(res, true, "Verification status updated successfully", response);

    } catch (error) {
        return sendErrorResponse(res, false, error.message, {});
    }
}
);

healthcareworkerRouter.post('/getCurrentUser', checkAuth, async (req, res, next) => {
    try {

        const query = { _id: new mongoose.Types.ObjectId(req.userId) };

        const response = await healthCareWorkerSchema.aggregate([
            {
                $match: query
            },
            { $unset: "password" },
            {
                $lookup: {
                    from: "addresses",
                    as: "addressData",
                    let: { query: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userId", "$$query"]
                                }
                            }
                        }
                    ]


                }
            },
            
            {
                $unwind: {
                    path: "$addressData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    addressData: { $ifNull: ["$addressData", {}] },
                }
            }
        ]
        );

        const data = response.map(u => ({
            ...u,
            email: decrypt(u.email),
            mobileNumber: decrypt(u.mobileNumber),
        }));
        return sendResponse(res, true, 'User found', data);
    } catch (error) {
        return sendErrorResponse(res, false, error.message);
    }
});



export default healthcareworkerRouter;


/*

healthcareworkerRouter.put('/updateStatus', checkAuth, async (req, res, next) => {
    try {
        const verificationStatus = req.body||{}
        if(!verificationStatus){}
        const result = await healthCareWorkerSchema.updateOne({ _id: req.userId }, { $set: { verificationStatus: req.body.verificationStatus } });
        if (result) {
            sendResponse(res, true, "Status updated successfully", result);
        }
        else {
            sendResponse(res, false, "Failed to update status", {})
        }
    } catch (error) {
        sendErrorResponse(res, false, error.message, {});

    }
});


healthcareworkerRouter.post('/updateStatus',async(req,res,next)=>{
    try {
        var query = {_id:req.body.id};
        var updateData = {"verificationStatus":req.body.verificationStatus}
        const result = await healthCareWorkerSchema.findByIdAndUpdate(query,{$set:updateData},{upsert:true});
        if(result){
            sendResponse(res,true,"User status Updated",result);
        }
        else{
            sendResponse(res,false,"Failed to update status",result);
        }
    } catch (error) {
        sendErrorResponse(res,false,error.message,{});
    }
});
*/






