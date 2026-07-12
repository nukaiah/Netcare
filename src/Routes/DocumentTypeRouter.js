import express from 'express';
const documentTypeRouter = express.Router();

import { createDocumentTypeController, getAllDocumentTypeController, updateDocumentTypeController } from "../Controllers/DocumentTypeController.js";
import { DocumentTypeValidation,updateDocumentTypeValidation, getAllDocumentTypeValidatiion } from '../Validations/DocumentTypeValidation.js';
import validateRequest from '../Utils/Vlaidations.js';
import { checkAuth,checkSuperAdmin } from '../Utils/Jwt_Token.js';



/**
 * @swagger
 * tags:
 *   - name: Document Type
 *     description: Department Management APIs
 */


/**
 * @swagger
 * /api/documentType/create:
 *   post:
 *     tags:
 *       - Document Type
 *     summary: Create a new document type
 *     description: Creates a new document type.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDocumentTypeRequest'
 *     responses:
 *       201:
 *         description: Document type created successfully
 */
documentTypeRouter.post("/create",checkAuth,checkSuperAdmin,validateRequest(DocumentTypeValidation),createDocumentTypeController);


/**
 * @swagger
 * /api/documentType/update:
 *   post:
 *     tags:
 *       - Document Type
 *     summary: Update a document type
 *     description: Updates an existing document type.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDocumentTypeRequest'
 *     responses:
 *       200:
 *         description: Document type updated successfully
 */
documentTypeRouter.post("/update",checkAuth,checkSuperAdmin,validateRequest(updateDocumentTypeValidation),updateDocumentTypeController);


/**
 * @swagger
 * /api/documentType/getAll:
 *   post:
 *     tags:
 *       - Document Type
 *     summary: Get all document types
 *     description: Retrieves all document types based on the provided filters.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetAllDocumentTypeRequest'
 *     responses:
 *       200:
 *         description: Document types retrieved successfully
 */
documentTypeRouter.post("/getAll",checkAuth,validateRequest(getAllDocumentTypeValidatiion),getAllDocumentTypeController);



export default documentTypeRouter;
