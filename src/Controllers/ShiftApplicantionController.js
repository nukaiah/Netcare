import {
    GetHopitalShiftApplicantsService,
    applyShiftService,
    cancelShiftByAdminService,
    cancelShiftByWorkerService,
    actionService,
    getApplicantsService,
    punchTimeService
} from "../Services/ShiftApplicantionService.js";
import { notFoundResponse, successResponse,conflictResponse } from "../Utils/Response.js";

const GetHopitalShiftApplicantsController = async (req, res, next) => {
    try {
        const result = await GetHopitalShiftApplicantsService();
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};


const applyShiftController = async (req, res, next) => {
    try {
        const applicationData = req.body || {};
        console.log(applicationData);
        const result = await applyShiftService(res, applicationData);
        return successResponse(res, result, "Applied shift Suucessfully.");
    } catch (error) {
         if(error.code===11000){
            return conflictResponse(res,"You alreay applied to this shift");
        }
        return next(error);
    }
};


const cancelShiftByAdminController = async (req, res, next) => {
    try {
        const { shiftId } = req.body || {};
        const result = await cancelShiftByAdminService(res, shiftId);
        return successResponse(res, result, "Shift cancelled successfully.");
    } catch (error) {
        if (error.message === "Shift not found.") {
            return notFoundResponse(res, error.message);
        }
        return next(error);
    }
};


const cancelShiftByWorkerController = async (req, res, next) => {
    try {
        const workerCancellationData = req.body;
        const result = await cancelShiftByWorkerService(
            res,
            workerCancellationData
        );

        return successResponse(
            res,
            result,
            "Shift cancelled successfully."
        );

    } catch (error) {

        switch (error.message) {

            case "Shift not found.":
                return notFoundResponse(res, error.message);

            case "Approved shift application not found.":
                return notFoundResponse(res, error.message);

            case "Shift has already started.":
                return badRequestResponse(res, error.message);

            default:
                return next(error);
        }
    }
};


const actionController = async (req, res, next) => {
    try {
        const actionData = req.body || {};
        const result = await actionService(res, actionData);
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};


const getApplicantsController = async (req, res, next) => {
    try {
        const { shiftId } = req.body || {};
        const result = await getApplicantsService(shiftId);
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};


const punchTimeController = async (req, res, next) => {
    try {
        const punchData = req.body || {};
        const result = await punchTimeService(res, punchData);
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};


export { GetHopitalShiftApplicantsController, applyShiftController, cancelShiftByAdminController, cancelShiftByWorkerController, actionController, getApplicantsController, punchTimeController };