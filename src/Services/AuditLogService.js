import AuditLog from "../Models/AuditLogModel.js";

const createAuditLogService = async (auditData) => {
    const response = await AuditLog.create(auditData);
    return response;
};

const getAuditLogService = async () => {
    const response = await AuditLog.find();
    return response;
};

export { createAuditLogService, getAuditLogService }