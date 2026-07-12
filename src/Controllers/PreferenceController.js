import { createPreferenceService, updatePreferenceService } from "../Services/PreferenceService.js";
import { createResponse, successResponse, validationErrorResponse, conflictResponse } from "../Utils/Response.js";

const createPreferenceController = async (req, res, next) => {
    try {
        const preferenceData = req.body || {};
        const response = await createPreferenceService(preferenceData);
        return createResponse(res, response, "Preference created successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Preference alreay existed");
        }
        return next(error);

    }
};

const updatePreferenceController = async (req, res, next) => {
    try {
        const preferenceData = req.body || {};
        const response = await updatePreferenceService(preferenceData);
        return successResponse(res, response, "Preference updated successfully");
    } catch (error) {
        return next(error);
    }
};



export {createPreferenceController,updatePreferenceController};