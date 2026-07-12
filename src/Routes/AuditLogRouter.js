import express from 'express';
import { getAuditLogCongtroller } from '../Controllers/AuditLogController.js';
import {checkAuth, checkSuperAdmin} from "../Utils/Jwt_Token.js";
const auditLogRouter = express.Router();

auditLogRouter.post("/getAudit",checkAuth,checkSuperAdmin,getAuditLogCongtroller);

export default auditLogRouter;