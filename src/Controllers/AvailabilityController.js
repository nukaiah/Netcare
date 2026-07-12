import { createAvailabilityService, getAvailabilityService } from "../Services/AvailabilityService.js";
import { createResponse, successResponse, conflictResponse } from "../Utils/Response.js";

const createAvailabilityController = async (req, res, next) => {
    try {
        const availabilityData = req.body || {};
        const response = await createAvailabilityService(availabilityData);
        return createResponse(res, response, "Availability created successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Availability alreay existed");
        }
        return next(error);
    }
};

const getAvailabilityController = async (req, res, next) => {
    try {
        const availabilityData = req.body || {};
        const response = await getAvailabilityService(availabilityData);
        return successResponse(res, response, "Availability found successfully");
    } catch (error) {
        return next(error);
    }
};

export { createAvailabilityController, getAvailabilityController };