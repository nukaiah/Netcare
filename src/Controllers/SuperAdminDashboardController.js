import {SuperAdminDashboardService} from "../Services/SuperAdminDashboardService.js";
import {successResponse} from "../Utils/Response.js";
 
const SuperAdminDashboardController = async(req,res,next)=>{
    try {
        const result = await SuperAdminDashboardService();
        return successResponse(res,result,"Dashoard found");
    } catch (error) {
        return next(error);
    }
};

export {SuperAdminDashboardController};