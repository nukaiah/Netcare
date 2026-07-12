import { createAuditLogService,getAuditLogService } from "../Services/AuditLogService.js";
import {createResponse,successResponse} from "../Utils/Response.js";

const getAuditLogCongtroller = async(req,res,next)=>{
    try {
        const result = await getAuditLogService();
        return successResponse(res,result,"Audit log found successfully");
    } catch (error) {
        return next(error);
    }
};

export {getAuditLogCongtroller};