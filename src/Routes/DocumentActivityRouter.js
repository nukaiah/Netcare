import express from "express";
const documentActivityRouter = express.Router();

import { checkAuth } from "../Utils/Jwt_Token.js";
import {
    createDocumentActivityController,
    getDocumentActivitiesController,
    getDocumentTimelineController
} from "../Controllers/DocumentActivityController.js";


/**
 * @swagger
 * tags:
 *   name: Document Activity
 *   description: APIs for managing document activity logs
 */


/**
 * @swagger
 * /api/documentActivity/create:
 *   post:
 *     tags:
 *       - Document Activity
 *     summary: Create a document activity
 *     description: Creates a new document activity record such as Uploaded, Reuploaded, Approved, Rejected, or Deleted.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DocumentActivity'
 *     responses:
 *       201:
 *         description: Document activity created successfully.
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Internal server error.
 */
documentActivityRouter.post("/create", checkAuth, createDocumentActivityController);

/**
 * @swagger
 * /api/documentActivity/activities:
 *   post:
 *     tags:
 *       - Document Activity
 *     summary: Get all document activities
 *     description: Returns a paginated list of document activity logs.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Document activities fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
documentActivityRouter.post("/activities", checkAuth, getDocumentActivitiesController);


/**
 * @swagger
 * /api/documentActivity/timeline:
 *   post:
 *     tags:
 *       - Document Activity
 *     summary: Get document timeline
 *     description: Returns the complete activity timeline for a specific document.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documentId
 *             properties:
 *               documentId:
 *                 type: string
 *                 example: 686c1d0d8b1d2d0012345678
 *     responses:
 *       200:
 *         description: Timeline fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Document not found.
 *       500:
 *         description: Internal server error.
 */
documentActivityRouter.post("/timeline", checkAuth, getDocumentTimelineController);



export default documentActivityRouter;