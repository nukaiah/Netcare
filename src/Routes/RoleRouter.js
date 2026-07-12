import express from 'express';
import { createRoleController,getAllRolesController } from '../Controllers/RolesController.js';
import validateRequest from '../Utils/Vlaidations.js';
import { rolesValidation } from '../Validations/RolesValidation.js';
const roleRouter = express.Router();

roleRouter.post("/create",validateRequest(rolesValidation),createRoleController);
roleRouter.get("/getAll",getAllRolesController);

export default roleRouter;