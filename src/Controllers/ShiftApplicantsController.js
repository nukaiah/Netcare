import { GetHopitalShiftApplicantsService, showInterestService, actionService, getApplicantsService, punchTimeService } from "../Services/ShiftApplicantsService.js";
import { successResponse } from "../Utils/Response.js";

const GetHopitalShiftApplicantsController = async (req, res, next) => {
    try {
        const result = await GetHopitalShiftApplicantsService();
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};

const showInterestController = async (req, res, next) => {
    try {
        const result = await GetHopitalShiftApplicantsService();
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};

const actionController = async (req, res, next) => {
    try {
        const actionData = req.body || {};
        const result = await actionService(actionData);
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};

const getApplicantsController = async (req, res, next) => {
    try {
        const result = await GetHopitalShiftApplicantsService();
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};

const punchTimeController = async (req, res, next) => {
    try {
        const result = await GetHopitalShiftApplicantsService();
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};


export { GetHopitalShiftApplicantsController, showInterestController, actionController, getApplicantsController, punchTimeController };