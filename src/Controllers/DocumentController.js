import { uploadDcoumentService, getAllUploadDocumnetService, verifyDocumentService } from "../Services/DocumentService.js";
import { conflictResponse, createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";
import { deleteFile } from "../Utils/UploadFile.js";

const uploadDcoumentController = async (req, res, next) => {
    const userId = req.params.userId;
    const file = req.file;
    try {
        const fileData = { documentUrl: file };
        const documentData = req.body || {};
        const finalData = { ...documentData, ...fileData };
        const response = await uploadDcoumentService(finalData);
        return createResponse(res, response, "Document uploaded successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Document already existed");
        }
        if (error.message === "Upload file failed") {
            return conflictResponse(res, "Failed to upload file");
        }

        return next(error);
    }
};

const getAllUploadDocumnetController = async (req, res, next) => {
    try {
        const { id } = req.body || {}
        const result = await getAllUploadDocumnetService(id);
        return successResponse(res, result, "Document found successfully");
    } catch (error) {
        return next(error);
    }
};

const verifyDocumentController = async (req, res, next) => {
    try {
        const verificationData = req.body || {};
        const userId = { "userId": req.id };
        const finalData = { ...verificationData, ...userId };
        const response = await verifyDocumentService(finalData);
        if (!response) {
            return notFoundResponse(res, "Dcoument is not found");
        }
        return successResponse(res, response, "Verication is done");
    } catch (error) {
        return next(error);
    }
};

export { uploadDcoumentController, getAllUploadDocumnetController, verifyDocumentController };