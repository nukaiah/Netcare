
import express from 'express';
const experianceRouter = express.Router();

import validateRequest from '../Utils/Vlaidations.js';
import { ExperianceValidation, updateExperianceValidation } from '../Validations/ExperianceValidation.js';
import {createExperianceController,deleteExperianceController,updateExperianceController,updateExperianceFileController,deleteExperianceFileController} from '../Controllers/ExperianceController.js';
import { createUpload } from '../Utils/UploadFile.js';
const uploadExperiance = createUpload();
import getByIdValidation from "../Validations/GetByIdValidation.js";
import { checkAuth } from '../Utils/Jwt_Token.js';


/**
 * @swagger
 * tags:
 *   name: Experience
 *   description: Experience Management APIs
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     CreateExperienceRequest:
 *       type: object
 *       required:
 *         - hospitalName
 *         - designation
 *         - department
 *         - employmentType
 *         - startDate
 *         - isCurrentlyWorking
 *         - file
 *       properties:
 *         hospitalName:
 *           type: string
 *           example: NetCare Hospital
 *         designation:
 *           type: string
 *           example: Registered Nurse
 *         department:
 *           type: string
 *           example: ICU
 *         employmentType:
 *           type: string
 *           enum:
 *             - Full Time
 *             - Part Time
 *             - Contract
 *             - Locum
 *           example: Full Time
 *         startDate:
 *           type: string
 *           format: date
 *           example: "2022-01-15"
 *         endDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2024-06-30"
 *           description: Required only when isCurrentlyWorking is false.
 *         isCurrentlyWorking:
 *           type: boolean
 *           example: false
 *         file:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * /api/experience/create/{userId}:
 *   post:
 *     tags:
 *       - Experience
 *     summary: Create experience
 *     description: Creates a new work experience with a supporting document upload.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *         example: 6865f8d9c4b3f1a2b4567890
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateExperienceRequest'
 *     responses:
 *       201:
 *         description: Experience created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
experianceRouter.post("/create/:userId",checkAuth,uploadExperiance.single("file"),validateRequest(ExperianceValidation),createExperianceController);


/**
 * @swagger
 * /api/experience/createCurrent:
 *   post:
 *     tags: [Experience]
 *     summary: Create experience
 *     description: Creates a new work experience.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExperienceRequest'
 *     responses:
 *       201:
 *         description: Experience created successfully.
 */
experianceRouter.post( "/createCurrent",checkAuth,validateRequest(ExperianceValidation),createExperianceController);


/**
 * @swagger
 * /api/experience/updateFile/{userId}:
 *   patch:
 *     tags: [Experience]
 *     summary: Update experience file
 *     description: Updates the uploaded experience document.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 6865f8d9c4b3f1a2b4567890
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - file
 *             properties:
 *               id:
 *                 type: string
 *                 example: 6865f8d9c4b3f1a2b4567899
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Experience file updated successfully.
 */
experianceRouter.patch("/updateFile/:userId",checkAuth,uploadExperiance.single("file"),validateRequest(getByIdValidation),updateExperianceFileController);


/**
 * @swagger
 * /api/experience/update:
 *   put:
 *     tags: [Experience]
 *     summary: Update experience
 *     description: Updates an existing experience record.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateExperienceRequest'
 *     responses:
 *       200:
 *         description: Experience updated successfully.
 *       401:
 *         description: Unauthorized.
 */
experianceRouter.put("/update",checkAuth,validateRequest(updateExperianceValidation),updateExperianceController);


/**
 * @swagger
 * /api/experience/delete:
 *   delete:
 *     tags: [Experience]
 *     summary: Delete experience
 *     description: Deletes an experience record.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetByIdRequest'
 *     responses:
 *       200:
 *         description: Experience deleted successfully.
 *       401:
 *         description: Unauthorized.
 */
experianceRouter.delete("/delete",checkAuth,validateRequest(getByIdValidation),deleteExperianceController);


/**
 * @swagger
 * /api/experience/deleteFile:
 *   patch:
 *     tags: [Experience]
 *     summary: Delete experience file
 *     description: Removes the uploaded experience document.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetByIdRequest'
 *     responses:
 *       200:
 *         description: Experience file deleted successfully.
 *       401:
 *         description: Unauthorized.
 */
experianceRouter.patch("/deleteFile",checkAuth,validateRequest(getByIdValidation),deleteExperianceFileController);


export default experianceRouter;