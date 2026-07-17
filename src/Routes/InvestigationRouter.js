import { getInvestigationController } from "../Controllers/InvestigationController.js";
import express from "express";
const investigationRouter = express.Router();
import { checkAuth, checkSuperAdmin } from "../Utils/Jwt_Token.js";


/**
 * @swagger
 * tags:
 *   name: Investigation
 *   description: Investigation Management APIs
 */

/**
 * @swagger
 * /api/investigation/getAll:
 *   post:
 *     summary: Get all investigations
 *     description: Fetch all investigations. This API is accessible only by Super Admin.
 *     tags:
 *       - Investigation
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Investigations fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Investigations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized access.
 *       403:
 *         description: Access denied. Super Admin only.
 *       500:
 *         description: Internal server error.
 */
investigationRouter.post("/getAll", checkAuth, checkSuperAdmin, getInvestigationController);

export default investigationRouter;