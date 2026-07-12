import { createQualificationService, updateQualificationService, deletQualificationService, deleteQualificationFileService, updateQualificationFileService } from "../Services/QualificationService.js";
import { conflictResponse, createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";
import { deleteFile } from "../Utils/UploadFile.js";

const createQualificationController = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return notFoundResponse(res, "No file found");
        }
        const fileData = { documentUrl: req.file };
        const qualificationData = req.body || {};
        const finalData = { ...qualificationData, ...fileData };
        const response = await createQualificationService(finalData);
        return createResponse(res, response, "Qualification added sucessfully");
    } catch (error) {
        if (req.file) {
            const userId = req.params.userId;
            const filename = req.file.filename;
            const filePath = `uploads/qualifications/${userId}/${filename}`;
            await deleteFile(filePath);
        }
        if (error.code === 11000) {
            return conflictResponse(res, "Qualification alredy exist");
        }
        return next(error);
    }
};

const updateQualificationController = async (req, res, next) => {
    try {
        const qualificationData = req.body || {};
        const response = await updateQualificationService(qualificationData);
        if (!response) {
            return notFoundResponse(res, "Qualification is not found");
        }
        return successResponse(res, response, "Qualification details updated successfully");
    } catch (error) {
        return next(error);
    }
};

const deletQualificationController = async (req, res, next) => {
    try {
        const { id } = req.body || {};
        const response = await deletQualificationService(id);
        if (!response) {
            return notFoundResponse(res, "Qualification is not found");
        }
        if (response.documentUrl) {
            const userId = response.userId;
            const filename = response.documentUrl;
            const filePath = `uploads/qualifications/${userId}/${filename}`;
            await deleteFile(filePath);
        }
        return successResponse(res, response, "Qualification deleted successfully");
    } catch (error) {
        return next(error);
    }
};

const deleteQualificationFileController = async (req, res, next) => {
    try {
        const { id } = req.body || {};
        const response = await deleteQualificationFileService(id);
        if (response === "Not found") {
            return notFoundResponse(res, "Qualification is not found");
        }
        return successResponse(res, response, "File deleted successfully");
    } catch (error) {
        return next(error);
    }
};

const updateQualificationFileController = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return notFoundResponse(res, "No file found");
        }

        const qualificationData = req.body || {};
        const fileData = { documentUrl: file.filename };
        const data = { ...qualificationData, ...fileData };
        const response = await updateQualificationFileService(data);
        if (!response) {
            return notFoundResponse(res, "Qualification is not found");
        }
        return successResponse(res, response, "Qualification file updated successfully");
    } catch (error) {
        const userId = req.params.userId;
        const filename = req.file.filename;
        const filePath = `uploads/qualifications/${userId}/${filename}`;
        await deleteFile(filePath);
        return next(error);
    }
};



export {
    createQualificationController,
    updateQualificationController,
    deletQualificationController,
    deleteQualificationFileController,
    updateQualificationFileController
}