import { getInvestigationService } from "../Services/InvestigationService.js";
import { successResponse } from "../Utils/Response.js";


const getInvestigationController = async (req,res,next) => {
    try {
        const result = await getInvestigationService();
        return successResponse(res, result, "Investigation Found successfully");
    } catch (error) {
        return next(error);
    }
};

export {getInvestigationController}