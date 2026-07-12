import express from 'express';
const designationRouter = express.Router();

import { createDesignationController, getAllDesignationsController, updateDesignationController } from '../Controllers/DesignationController.js';
import validateRequest from '../Utils/Vlaidations.js';
import { designationValidation, updateDesignationValidation } from '../Validations/DesignationValidation.js';
import { checkSuperAdmin, checkAuth } from "../Utils/Jwt_Token.js"


/**
 * @swagger
 * tags:
 *   - name: Designation
 *     description: Designation Management APIs
 */


/**
 * @swagger
 * /api/designation/getAll:
 *   get:
 *     tags:
 *       - Designation
 *     summary: Get All Designations
 *     description: Retrieves all designations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of designations retrieved successfully
 */
designationRouter.get("/getAll",checkAuth,getAllDesignationsController);


/**
 * @swagger
 * /api/designation/create:
 *   post:
 *     summary: Create a designation
 *     tags:
 *       - Designation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDesignationRequest'
 *     responses:
 *       201:
 *         description: Designation created successfully
 */
designationRouter.post("/create",checkAuth,checkSuperAdmin,validateRequest(designationValidation),createDesignationController);


/**
 * @swagger
 * /api/designation/update:
 *   patch:
 *     summary: Update a designation
 *     tags:
 *       - Designation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDesignationRequest'
 *     responses:
 *       200:
 *         description: Designation updated successfully
 */
designationRouter.patch("/update",checkAuth,checkSuperAdmin,validateRequest(updateDesignationValidation),updateDesignationController);


export default designationRouter;