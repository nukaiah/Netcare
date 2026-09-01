import { createDesignationService, getAllDesignationsService,updateDesignationService } from "../Services/DesignationService.js";
import { conflictResponse, createResponse, notFoundResponse, successResponse, forbiddenResponse } from "../Utils/Response.js";

const createDesignationController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const designationData = req.body || {};
        const response = await createDesignationService(designationData);
        return createResponse(res, response, "Designation created successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Designation is existed already");
        }
        return next(error);
    }
};


const updateDesignationController = async (req, res, next) => {
    try {
        const updatedDesignationData = req.body || {};
        const response = await updateDesignationService(updatedDesignationData);
        return successResponse(res, response, "Designation updated successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Designation is existed already");
        }
        if(error.message === "Not Found"){
            return notFoundResponse(res, 'Designation is not found');
        }
        return next(error);
    }
};


const getAllDesignationsController = async (req, res, next) => {
    try {
        const response = await getAllDesignationsService();
        return successResponse(res, response, "Designation found sucessfully");
    } catch (error) {
        return next(error);
    }
};

export {
    createDesignationController,
    updateDesignationController,
    getAllDesignationsController
};