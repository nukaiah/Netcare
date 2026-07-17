import { uploadGroupDocumentsService, getGropuDocumentsService } from "../Services/GroupDocumentService.js";
import { successResponse, createResponse } from "../Utils/Response.js";

const uploadGroupDocumentsController = async (req, res, next) => {
    try {
        const groupDocumentData = req.body || {};
        const result = await uploadGroupDocumentsService(groupDocumentData);
        return createResponse(res, result, 'Group document created successfully');
    } catch (error) {
        return next(error);
    }
};

const getGropuDocumentsController = async (req, res, next) => {
    try {
        const result = await getGropuDocumentsService();
        return successResponse(res, result, "Documents found successfully");
    } catch (error) {
        return next(error);
    }
};

export { uploadGroupDocumentsController, getGropuDocumentsController };