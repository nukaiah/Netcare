import DocumentsModel from "../Models/DocumentsModel.js";
import { documentRejectedTemplate } from "../Utils/EmailotpTemplate.js";
import { createDocumentActivityService } from "./DocumentActivityService.js";
import mongoose from "mongoose";
import { uploadFile, deleteFile } from "../Utils/UploadFile.js";
import { sendEmail } from "../Utils/Email.js";

const uploadDcoumentService = async (finalData) => {
    const { hospitalId, documentUrl } = finalData;
    const fileResponse = await uploadFile(documentUrl, "documents", hospitalId);
    if (!fileResponse) {
        throw new Error("Upload file failed");
    }
    const documentData = {
        url: fileResponse.secure_url,
        publicId: fileResponse.public_id,
        resourceType: fileResponse.resource_type,
    };
    delete finalData.documentUrl;
    try {
        const response = await DocumentsModel.create({
            ...finalData,
            documentUrl: documentData,
        });
        console.log(response);
        const activityData = {
            "documentId": response._id,
            "actionBy": response.hospitalId,
            "action": "Uploaded",
            "remarks": ""
        };
        await createDocumentActivityService(activityData);

        return response;
    } catch (error) {
        await deleteFile(documentData.publicId, documentData.resourceType);
        throw error;
    }
};


const getAllUploadDocumnetService = async (id) => {
    var query = { "hospitalId": new mongoose.Types.ObjectId(id) };
    const response = await DocumentsModel.aggregate([
        {
            $match: query
        },
        {
            $lookup: {
                from: "documenttypes",
                as: "documenttypesData",
                localField: "documentTypeId",
                foreignField: "_id"
            }
        },
        { $unwind: { path: "$documenttypesData", preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                documentName: "$documenttypesData.documentName",
            }
        },
        { $project: { documenttypesData: 0 } }
    ]
    );
    return response;
};


const verifyDocumentService = async (verificationData) => {
    const { id, verificationStatus, rejectionReason, verifiedBy, email, documentName, facilityName } = verificationData || {};
    console.log(verifiedBy);
    const updateData = { "verificationStatus": verificationStatus, "verifiedBy": verifiedBy, "verifiedAt": new Date(), "rejectionReason": rejectionReason }
    const response = await DocumentsModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true, upsert: true });
    const activityData = {
        "documentId": id,
        "actionBy": verifiedBy,
        "action": verificationStatus,
        "remarks": ""
    };
    console.log(activityData);
    await createDocumentActivityService(activityData);
    if (!response) {
        return "Not Found";
    }
    if (verificationStatus === "Rejected") {
        const template = documentRejectedTemplate(facilityName, updateData.documentName, updateData.rejectionReason);
        await sendEmail(email, template.subject, template.html);
    }
    if (verificationStatus === "Verified") {
        const template = documentRejectedTemplate(facilityName, updateData.documentName, updateData.rejectionReason);
        await sendEmail(email, template.subject, template.html);
    }
    return response;
};



export {
    uploadDcoumentService,
    getAllUploadDocumnetService,
    verifyDocumentService
};