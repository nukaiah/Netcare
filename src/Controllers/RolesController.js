import { createRoleService, getAllRolesService } from "../Services/RolesService.js";
import { conflictResponse, createResponse, successResponse } from "../Utils/Response.js";

const createRoleController = async (req, res, next) => {
    try {
        const rolesData = req.body || {};
        const response = await createRoleService(rolesData);
        return createResponse(res, response, "Roles created sucessfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Role data already exist");
        }
        return next(error);
    }
};

const getAllRolesController = async (req, res, next) => {
    try {
        const response = await getAllRolesService();
        return successResponse(res, response, "Roles data found");
    } catch (error) {
        return next(error);

    }
};

export {
    createRoleController,
    getAllRolesController
}