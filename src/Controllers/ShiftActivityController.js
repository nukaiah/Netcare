import { createShiftActivityService, getShiftActivityService } from '../Services/ShiftActivityService.js';
import { successResponse } from '../Utils/Response.js';

const getShiftActivityController = async (req, res, next) => {
    try {
        const response = await getShiftActivityService();
        return successResponse(req, response, "Shift activity found successfully");
    } catch (error) {
        return next(error);
    }
};

export { getShiftActivityController };