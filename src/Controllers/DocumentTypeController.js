import { createDocumentTypeService,updateDocumentTypeService, getAllDocumentTypeService } from "../Services/DocumentTypeService.js";
import { conflictResponse, createResponse, successResponse } from '../Utils/Response.js';

const createDocumentTypeController = async (req, res, next) => {
    try {
        const documentTypeData = req.body || {};
        const response = await createDocumentTypeService(documentTypeData);
        return createResponse(res, response, "Document type created successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Document type existed already");
        }
        return next(error);
    }
};

const updateDocumentTypeController = async (req, res, next) => {
    try {
        const updatedDcoumentTypeData = req.body || {};
        const response = await updateDocumentTypeService(updatedDcoumentTypeData);
        return createResponse(res, response, "Document type updated successfully");
    } catch (error) {
        return next(error);
    }
};

const getAllDocumentTypeController = async (req, res, next) => {
    try {
        const { referTo } = req.body || {};
        const response = await getAllDocumentTypeService(referTo);
        return successResponse(res, response, "Document types found successfully");
    } catch (error) {
        return next(error);
    }
};

export { createDocumentTypeController,updateDocumentTypeController, getAllDocumentTypeController };