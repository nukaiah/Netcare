import express from 'express';
const documentRouter = express.Router();
import { uploadDcoumentController,getAllUploadDocumnetController, verifyDocumentController } from "../Controllers/DocumentController.js";
import validateRequest from '../Utils/Vlaidations.js';
import { DocumentUplodaValidation, DocumentUpdateValidation } from '../Validations/DocumentsValidation.js';
import { checkAuth,checkHealthcareWorker,checkhospitalAdmin,checkSuperAdmin } from "../Utils/Jwt_Token.js";
import { createUpload } from '../Utils/UploadFile.js';
const uploadProfileImage = createUpload();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Documents management APIs
 */

/**
 * @swagger
 * /api/document/upload/{userId}:
 *   post:
 *     tags:
 *       - Documents
 *     summary: Upload a user document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: MongoDB User ID
 *         schema:
 *           type: string
 *           example: "687b6b2cf4d5a9f123456789"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - documentTypeId
 *               - issueDate
 *               - expiryDate
 *               - issuedBy
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Document file (PDF, JPG, JPEG, PNG)
 *               documentTypeId:
 *                 type: string
 *                 example: "687b6b2cf4d5a9f123456789"
 *               issueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-10"
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2027-07-10"
 *               issuedBy:
 *                 type: string
 *                 example: "Government Authority"
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
documentRouter.post("/upload/:userId", checkAuth, uploadProfileImage.single('file'), validateRequest(DocumentUplodaValidation), uploadDcoumentController);


/**
 * @swagger
 * /api/document/getAll:
 *   post:
 *     summary: Get all uploaded documents
 *     description: Retrieves all uploaded documents.
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents retrieved successfully.
 */
documentRouter.post("/getAll", checkAuth, getAllUploadDocumnetController);


/**
 * @swagger
 * /api/document/verify:
 *   patch:
 *     summary: Verify a document
 *     tags:
 *       - Documents
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyDocumentRequest'
 *     responses:
 *       200:
 *         description: Document verified successfully
 */
documentRouter.patch("/verify",checkAuth,checkSuperAdmin, validateRequest(DocumentUpdateValidation), verifyDocumentController);


export default documentRouter;


