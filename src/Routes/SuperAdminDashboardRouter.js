import { SuperAdminDashboardController } from "../Controllers/SuperAdminDashboardController.js";
import express from 'express';
import { checkAuth, checkSuperAdmin } from "../Utils/Jwt_Token.js";
const superAdminRouter = express.Router();


/**
 * @swagger
 * /api/superAdmin/getAnalytics:
 *   post:
 *     summary: Get Super Admin dashboard analytics
 *     tags:
 *       - Super Admin
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves dashboard analytics for the authenticated Super Admin, including user, hospital, healthcare worker, and other system statistics.
 *     responses:
 *       200:
 *         description: Dashboard analytics retrieved successfully.
 */
superAdminRouter.post("/getAnalytics", checkAuth,checkSuperAdmin, SuperAdminDashboardController)

export default superAdminRouter;