import express from 'express';
import rolesSchema from '../Models/RolesModels.js';
import { sendResponse, sendErrorResponse } from '../MiddleWares/Response.js';
import { checkAuth } from '../MiddleWares/CheckAuth.js';
const roleRouter = express.Router();

roleRouter.get("/getAll",checkAuth, async (req, res, next) => {
    try {
        const response = await rolesSchema.find();
        const rolesData = response.filter(e => e.roleId !== 1);
        return sendResponse(res, true, "Roles found successfully", rolesData);
    } catch (error) {
        return sendErrorResponse(res, false, error.message);
    }
});

roleRouter.post('/create',checkAuth, async (req, res, next) => {
    try {
        var rolesData = req.body;
        var response = await rolesSchema.insertOne(rolesData);
        return sendResponse(res, true, response);
    } catch (error) {
        return sendErrorResponse(res, false, error.message);
    }
});

export default roleRouter;
