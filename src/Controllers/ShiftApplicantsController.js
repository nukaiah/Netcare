import { GetHopitalShiftApplicantsService } from "../Services/ShiftApplicantsService.js";
import { successResponse } from "../Utils/Response.js";

const GetHopitalShiftApplicantsController = async (req, res, next) => {
    try {
        const result = await GetHopitalShiftApplicantsService();
        return successResponse(res, result, "Applicants found");
    } catch (error) {
        return next(error);
    }
};

export { GetHopitalShiftApplicantsController };