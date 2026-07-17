import express from 'express';
const departmentRouter = express.Router();
import { checkAuth,checkSuperAdmin } from '../Utils/Jwt_Token.js';
import { createDepartmentController, updateDepartmentController, getAllDeparmentController } from '../Controllers/DepartmentController.js';
import { DeparmentValidation, updateDepartmentValidation } from '../Validations/DepartmentValidation.js'
import validateRequest from '../Utils/Vlaidations.js';



/**
 * @swagger
 * tags:
 *   - name: Department
 *     description: Department Management APIs
 */


/**
 * @swagger
 * /api/department/create:
 *   post:
 *     tags:
 *       - Department
 *     summary: Create a new department
 *     description: Creates a new department.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentRequest'
 *     responses:
 *       201:
 *         description: Department created successfully
 */
departmentRouter.post("/create",checkAuth,checkSuperAdmin,validateRequest(DeparmentValidation),createDepartmentController);


/**
 * @swagger
 * /api/department/update:
 *   patch:
 *     tags:
 *       - Department
 *     summary: Update a department
 *     description: Updates an existing department.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDepartmentRequest'
 *     responses:
 *       200:
 *         description: Department updated successfully.
 */
departmentRouter.patch("/update",checkAuth,checkSuperAdmin, validateRequest(updateDepartmentValidation), updateDepartmentController);


/**
 * @swagger
 * /api/department/getAll:
 *   get:
 *     tags:
 *       - Department
 *     summary: Get all departments
 *     description: Retrieves a list of all departments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Departments retrieved successfully.
 */
departmentRouter.get("/getAll",checkAuth, getAllDeparmentController);


export default departmentRouter;