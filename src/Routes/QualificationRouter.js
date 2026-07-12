import express from 'express';
const qualificationRouter = express.Router();
import { checkAuth } from '../Utils/Jwt_Token.js';

import validateRequest from '../Utils/Vlaidations.js';
import { qualificationValidation, qualificationUpdateValidation } from '../Validations/QualificationValidation.js';
import {createQualificationController,updateQualificationController,deletQualificationController,deleteQualificationFileController,updateQualificationFileController} from '../Controllers/QualificationController.js';
import getByIdValidation from '../Validations/GetByIdValidation.js';
import { createUpload } from '../Utils/UploadFile.js';
const uploadQualification = createUpload();

/**
 * @swagger
 * tags:
 *   name: Qualification
 *   description: Qualification Management APIs
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     CreateQualificationRequest:
 *       type: object
 *       required:
 *         - education
 *         - institution
 *         - course
 *         - specialization
 *         - startYear
 *         - endYear
 *         - courseType
 *         - sortOrder
 *         - file
 *       properties:
 *         education:
 *           type: string
 *           enum:
 *             - Grade R
 *             - Primary School
 *             - Secondary School
 *             - Matric
 *             - Certificate
 *             - Diploma
 *             - Advanced Diploma
 *             - Bachelor Degree
 *             - Honours Degree
 *             - Postgraduate Diploma
 *             - Master Degree
 *             - Doctorate
 *           example: Diploma
 *         institution:
 *           type: string
 *           example: University of Cape Town
 *         course:
 *           type: string
 *           example: Nursing
 *         specialization:
 *           type: string
 *           example: General Nursing
 *         startYear:
 *           type: string
 *           example: "2020"
 *         endYear:
 *           type: string
 *           example: "2024"
 *         courseType:
 *           type: string
 *           example: Full Time
 *         sortOrder:
 *           type: integer
 *           example: 1
 *         file:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * /api/qualification/create/{userId}:
 *   post:
 *     tags:
 *       - Qualification
 *     summary: Create Qualification
 *     description: Create a new qualification with a certificate upload.
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
 *             $ref: '#/components/schemas/CreateQualificationRequest'
 *     responses:
 *       201:
 *         description: Qualification created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
qualificationRouter.post("/create/:userId",checkAuth,uploadQualification.single("file"),validateRequest(qualificationValidation),createQualificationController);

/**
 * @swagger
 * /api/qualification/update:
 *   patch:
 *     tags: [Qualification]
 *     summary: Update qualification
 *     description: Updates qualification details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQualificationRequest'
 *     responses:
 *       200:
 *         description: Qualification updated successfully.
 */
qualificationRouter.patch("/update",checkAuth,validateRequest(qualificationUpdateValidation),updateQualificationController);

/**
 * @swagger
 * /api/qualification/delete:
 *   delete:
 *     tags: [Qualification]
 *     summary: Delete qualification
 *     description: Deletes a qualification record.
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
 *         description: Qualification deleted successfully.
 */
qualificationRouter.delete("/delete",checkAuth,validateRequest(getByIdValidation),deletQualificationController);

/**
 * @swagger
 * /api/qualification/deleteFile:
 *   put:
 *     tags: [Qualification]
 *     summary: Delete qualification file
 *     description: Removes the uploaded qualification file.
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
 *         description: Qualification file deleted successfully.
 */
qualificationRouter.put("/deleteFile",checkAuth,validateRequest(getByIdValidation),deleteQualificationFileController);

/**
 * @swagger
 * /api/qualification/updateFile/{userId}:
 *   put:
 *     tags: [Qualification]
 *     summary: Update qualification file
 *     description: Updates the uploaded qualification certificate/document.
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
 *         description: Qualification file updated successfully.
 */
qualificationRouter.put( "/updateFile/:userId",checkAuth,uploadQualification.single("file"),validateRequest(getByIdValidation),updateQualificationFileController);

export default qualificationRouter;