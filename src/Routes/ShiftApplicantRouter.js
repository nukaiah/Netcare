import express from 'express';
import { GetHopitalShiftApplicantsController } from "../Controllers/ShiftApplicantsController.js";
import { checkAuth } from "../Utils/Jwt_Token.js";
const shiftApplicantRouter = express.Router();



/**
 * @swagger
 * tags:
 *   name: shiftApplication
 *   description: ShiftApplicants Management APIs
 */

/**
 * @swagger
 * /api/shiftApplication/getrecentApplicants:
 *   post:
 *     summary: Get recent shift applicants
 *     tags:
 *       - shiftApplication
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves the most recent shift applicants for the authenticated user.
 *     responses:
 *       200:
 *         description: Recent shift applicants retrieved successfully.
 */

shiftApplicantRouter.post("/getrecentApplicants", checkAuth,GetHopitalShiftApplicantsController);

export default shiftApplicantRouter;
