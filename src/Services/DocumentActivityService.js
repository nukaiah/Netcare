import DocumentActivityModel from "../Models/DocumentActivityModel.js";
import mongoose from "mongoose";

const createDocumentActivityService = async (activityData) => {
    const response = await DocumentActivityModel.create(activityData);
    return response;
};


const getDocumentActivitiesService = async (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    const [activities, total] = await Promise.all([
        DocumentActivityModel.aggregate([
            {
                $lookup: {
                    from: "documents",
                    localField: "documentId",
                    foreignField: "_id",
                    as: "document"
                }
            },
            {
                $unwind: "$document"
            },
            {
                $lookup: {
                    from: "documenttypes",
                    localField: "document.documentTypeId",
                    foreignField: "_id",
                    as: "documentType"
                }
            },
            {
                $unwind: {
                    path: "$documentType",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "actionBy",
                    foreignField: "_id",
                    as: "actionByData"
                }
            },
            {
                $unwind: "$actionByData"
            },
            {
                $project: {
                    _id: 1,
                    action: 1,
                    remarks: 1,
                    createdAt: 1,

                    "actionByData._id": 1,
                    "actionByData.fullName": 1,

                    "document._id": 1,
                    "document.verificationStatus": 1,
                    "document.documentUrl": 1,

                    "documentType._id": 1,
                    "documentType.documentName": 1
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]),

        DocumentActivityModel.countDocuments()
    ]);

    return {
        total,
        page,
        limit,
        activities
    };
};


const getDocumentTimelineService = async (documentId) => {
    return await DocumentActivityModel.aggregate([
        {
            $match: {
                documentId: new mongoose.Types.ObjectId(documentId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "actionBy",
                foreignField: "_id",
                as: "userData"
            }
        },
        {
            $unwind: "$userData"
        },
        {

            $project: {
                _id: 1,
                action: 1,
                remarks: 1,
                createdAt: 1,
                "userData._id": 1,
                "userData.fullName": 1

            }
        }
    ]);
};


export { createDocumentActivityService, getDocumentActivitiesService, getDocumentTimelineService }