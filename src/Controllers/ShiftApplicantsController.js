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
        const applicationData = req.body||{};
        const result = await showInterestService(res,applicationData);
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};


const actionController = async (req, res, next) => {
    try {
        const actionData = req.body || {};
        const result = await actionService(res,actionData);
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};


const getApplicantsController = async (req, res, next) => {
    try {
        const {shiftId} = req.body||{};
        const result = await getApplicantsService(shiftId);
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};


const punchTimeController = async (req, res, next) => {
    try {
        const punchData = req.body||{};
        const result = await punchTimeService(res,punchData);
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};


export { GetHopitalShiftApplicantsController, showInterestController, actionController, getApplicantsController, punchTimeController };