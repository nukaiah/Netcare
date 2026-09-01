import { createDepartmentService, updateDepartmentService, getAllDeparmentService } from "../Services/DepartmentService.js";
import { conflictResponse, createResponse, notFoundResponse, successResponse } from "../Utils/Response.js";

const createDepartmentController = async (req, res, next) => {
    try {
        const departmentData = req.body || {};
        const response = await createDepartmentService(departmentData);
        return createResponse(res, response, "Department created successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Department alredy existed");
        }
        return next(error);
    }
};

const updateDepartmentController = async (req, res, next) => {
    try {
        const departmentData = req.body || {};
        const response = await updateDepartmentService(departmentData);
        return successResponse(res, response, "Department updated successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Department alredy existed");
        }
        if (error.message === "Not Found") {
            return notFoundResponse(res, "Department is not found");
        }
        return next(error);
    }
};

const getAllDeparmentController = async (req, res, next) => {
    try {
        const response = await getAllDeparmentService();
        return successResponse(res, response, "Department found successfully");
    } catch (error) {
        return next(error);
    }
};



export { createDepartmentController, updateDepartmentController, getAllDeparmentController };