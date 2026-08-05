import { createShiftService, getWebShiftService, getMobileShiftService, getAllMyShiftService, updateShiftStausService, getWebDashboardAnalyticsService, getShiftByIdService } from "../Services/ShiftPostService.js";
import { createResponse, successResponse } from "../Utils/Response.js";


const createShiftController = async (req, res, next) => {
    try {
        const shiftData = req.body || {};
        const result = await createShiftService(shiftData, res);
        return createResponse(res, result, "Created shift successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Shift alreay existed");
        }
        return next(error);
    }
};

const getWebShiftController = async (req, res, next) => {
    try {
        const paginatedData = req.body || {};
        const response = await getWebShiftService(paginatedData);
        return successResponse(res, response, "Shifts found successfully");
    } catch (error) {
        return next(error);
    }
};

const getMobileShiftController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const preferenceData = {
            ...req.body,
            userId
        };
        const response = await getMobileShiftService(preferenceData);
        return successResponse(res, response, "Shifts found successfully");
    } catch (error) {
        return next(error);
    }
};

const getAllMyShiftController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const paginatedData = req.body || {};
        console.log("User ID:", userId);
        console.log("Paginated Data:", paginatedData);
        const response = await getAllMyShiftService(userId, paginatedData);
        return successResponse(res, response, "Shifts found successfully");
    } catch (error) {
        return next(error);
    }
};

const updateShiftStausController = async (req, res, next) => {
    try {
        const shiftData = req.body || {};
        const response = await updateShiftStausService(shiftData);
        return successResponse(res, response, "Status updated");
    } catch (error) {
        return next(error);

    }
};

const getWebDashboardAnalyticsController = async (req, res, next) => {
    try {
        const hospitalId = req.userId;
        console.log(hospitalId);
        const response = await getWebDashboardAnalyticsService(hospitalId);
        return successResponse(res, response, "Analytics found");
    } catch (error) {
        return next(error);
    }
};


const getShiftByIdController = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { shiftId } = req.body || {};
        const response = await getShiftByIdService(userId,shiftId);
        return successResponse(res, response, "Shift found successfully");
    } catch (error) {
        return next(error);
    }
};

export { createShiftController, getWebShiftController, getMobileShiftController, getAllMyShiftController, updateShiftStausController, getWebDashboardAnalyticsController, getShiftByIdController };