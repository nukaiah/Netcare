import {
    createExperianceService, updateExperianceService, updateExperianceFileService, deleteExperianceService, deleteExperianceFileService,
} from "../Services/ExperianceService.js";
import { createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";
import { deleteFile } from "../Utils/UploadFile.js";


const createExperianceController = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return notFoundResponse(res, "File is not found");
        }
        const fileData = { documentUrl: req.file };
        const experianceData = req.body || {};
        const finalData = { ...experianceData, ...fileData };
        const response = await createExperianceService(finalData);
        return createResponse(res, response, "Experiance created successfully");
    } catch (error) {
        if (req.file) {
            const userId = req.params.userId;
            const filename = req.file.filename;
            const filePath = `uploads/experiances/${userId}/${filename}`;

            try {
                await deleteFile(filePath);
            } catch (err) {
                console.error("Cleanup failed:", err.message);
            }
        }
        return next(error);
    }
};


const updateExperianceFileController = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return notFoundResponse(res, "No file found");
        }
        const { id } = req.body || {};
        const data = { "documentUrl": file.filename, id };
        const response = await updateExperianceFileService(data);
        if (!response) {
            return notFoundResponse(res, "Experiance is not found");
        }
        return successResponse(res, response, "File updated successfully");
    } catch (error) {
        if (req.file) {
            const userId = req.params.userId;
            const filename = req.file.filename;
            const filePath = `uploads/experiances/${userId}/${filename}`;

            try {
                await deleteFile(filePath);
            } catch (err) {
                console.error("Cleanup failed:", err.message);
            }
        }
        return next(error);
    }
};

const updateExperianceController = async (req, res, next) => {
    try {
        const experianceData = req.body || {};
        const response = await updateExperianceService(experianceData);
        if (!response) {
            return notFoundResponse(res, "Experiance is not found");
        }
        return successResponse(res, response, "Experiance updated successfully");
    } catch (error) {
        return next(error);
    }
};


const deleteExperianceController = async (req, res, next) => {
    try {
        const { id } = req.body || {};
        const response = await deleteExperianceService(id);
        if (!response) {
            return notFoundResponse(res, "Experiance is not found");
        }
        return successResponse(res, response, "Experiance deleted successfully");
    } catch (error) {
        return next(error);
    }
};


const deleteExperianceFileController = async (req, res, next) => {
    try {
        const { id } = req.body || {};
        const response = await deleteExperianceFileService(id);
        if (!response) {
            return notFoundResponse(res, "Experiance is  not found");
        }
        return successResponse(res, response, "File deleted successfully");
    } catch (error) {
        return next(error);
    }
};



export {
    createExperianceController,
    updateExperianceController,
    updateExperianceFileController,
    deleteExperianceController,
    deleteExperianceFileController,
};