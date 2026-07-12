import UserModels from "../Models/UserModels.js";
import mongoose from "mongoose";
import { decrypt } from "../Utils/EncryptDecrypt.js";
import { successResponse } from "../Utils/Response.js";
import { uploadFile, deleteFile } from "../Utils/UploadFile.js";
import { verificationStatusTemplate, onboardingTemplate, forgotPasswordOtpTemplate } from "../Utils/EmailotpTemplate.js";
import { sendEmail } from "../Utils/Email.js";

const getUserDataByIdService = async (id) => {

    const query = { _id: new mongoose.Types.ObjectId(id) };

    const response = await UserModels.aggregate([
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
    return data;
};

const getWebUserDataByIdService = async (id) => {

    const query = { _id: new mongoose.Types.ObjectId(id) };

    const response = await UserModels.aggregate([
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

    return data;
};

const userDataUpdateService = async (userData) => {
    const { id, ...updatedData } = userData || {};
    const response = await UserModels.findByIdAndUpdate(id, { $set: updatedData });
    return response;
};

const updateProfileService = async (fileData) => {
    const { id, imageUrl } = fileData || {};
    const fileResponse = await uploadFile(imageUrl, "profile", id);
    if (fileResponse) {
        const imageData = {
            url: fileResponse.secure_url,
            publicId: fileResponse.public_id,
            resourceType: fileResponse.resource_type
        };
        const oldData = await UserModels.findByIdAndUpdate(
            id,
            { $set: { imageUrl: imageData } },
            { new: false }
        );
        if (oldData?.imageUrl.url) {
            await deleteFile(oldData?.imageUrl.publicId, oldData?.imageUrl.resourceType);
            return oldData;
        }
        return oldData;
    }
    return "Not Found";
};

const updateFcmService = async (fcmData) => {
    const { id, fcm, type } = fcmData ?? {};
    let updateQuery;
    switch (type) {
        case "Login":
            updateQuery = {
                $addToSet: {
                    fcm
                }
            };
            break;
        case "Logout":
            updateQuery = {
                $pull: {
                    fcm
                }
            };
            break;
        default:
            throw new Error("Invalid update type");
    }
    const response = await UserModels.findByIdAndUpdate(
        id,
        updateQuery,
        {
            new: true,
            runValidators: true
        }
    );
    return response;
};

const getAllUsersService = async (paginatedData) => {
    const { roleId, skip, limit } = paginatedData || {}
    const [data, totalCount] = await Promise.all([
        UserModels.find({ roleId: roleId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        UserModels.countDocuments({ roleId: roleId })
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const users = data.map(u => ({
        ...u,
        email: decrypt(u.email),
        mobileNumber: decrypt(u.mobileNumber)
    }));
    return {
        users,
        pagination: {
            totalCount,
            totalPages,
            limit
        }
    };
};

const updateVerificationStatusService = async (updatedData) => {
    const { id, verificationStatus } = updatedData || {}
    const result = await UserModels.findByIdAndUpdate(id, { $set: { verificationStatus: verificationStatus } }, { new: true, runValidators: true });
    console.log(result);
    const template = verificationStatusTemplate(verificationStatus, result.fullName);
    const emailResponse = await sendEmail(result.email, template.subject, template.html);
    return result;
};


export { getUserDataByIdService, getWebUserDataByIdService, userDataUpdateService, updateProfileService, updateFcmService, getAllUsersService,updateVerificationStatusService};