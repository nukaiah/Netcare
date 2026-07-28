import express from 'express';
import { GetHopitalShiftApplicantsController, applyShiftController,cancelShiftByAdminController,cancelShiftByWorkerController, actionController, getApplicantsController, punchTimeController } from "../Controllers/ShiftApplicantionController.js";
import { checkAuth,checkHealthcareWorker } from "../Utils/Jwt_Token.js";
import { showInterestValidation,workerCancellationValidation,shiftApplicationActionValidation,getShiftApplicationValidation,punchTimeValidation } from '../Validations/ShiftApplicationValidation.js';
const shiftApplicantRouter = express.Router();
import validateRequest from "../Utils/Vlaidations.js"



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


/**
 * @swagger
 * /api/shiftApplication/showInterest:
 *   post:
 *     tags:
 *       - shiftApplication
 *     summary: Apply for a shift
 *     description: Allows a healthcare worker to show interest in a shift.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShowInterestRequest'
 *     responses:
 *       201:
 *         description: Shift application submitted successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       409:
 *         description: Already applied for this shift.
 *       500:
 *         description: Internal server error.
 */
shiftApplicantRouter.post("/showInterest", checkAuth,validateRequest(showInterestValidation),applyShiftController);


/**
 * @swagger
 * /api/shiftApplication/cancelByUser:
 *   post:
 *     tags:
 *       - shiftApplication
 *     summary: Cancel approved shift by Healthcare Worker
 *     description: Allows a healthcare worker to cancel an approved shift. The system automatically calculates the notice period and applies the cancellation policy.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkerCancellationSchema'
 *     responses:
 *       200:
 *         description: Shift cancelled successfully.
 *       400:
 *         description: Validation error or shift has already started.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Shift or approved application not found.
 *       500:
 *         description: Internal server error.
 */
shiftApplicantRouter.post("/cancelByUser",checkAuth,checkHealthcareWorker,validateRequest(workerCancellationValidation),cancelShiftByWorkerController);


/**
 * @swagger
 * /api/shiftApplication/action:
 *   post:
 *     tags:
 *       - shiftApplication
 *     summary: Approve or reject a shift application
 *     description: Updates the status of a healthcare worker's shift application.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShiftApplicationActionRequest'
 *     responses:
 *       200:
 *         description: Application status updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
shiftApplicantRouter.post("/action", checkAuth,validateRequest(shiftApplicationActionValidation),actionController);


/**
 * @swagger
 * /api/shiftApplication/getById:
 *   post:
 *     tags:
 *       - shiftApplication
 *     summary: Get applicants by shift
 *     description: Returns all applicants for the specified shift.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetApplicantsRequest'
 *     responses:
 *       200:
 *         description: Applicants retrieved successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
shiftApplicantRouter.post("/getById", checkAuth,validateRequest(getShiftApplicationValidation),getApplicantsController);


/**
 * @swagger
 * /api/shiftApplication/punchTime:
 *   post:
 *     tags:
 *       - shiftApplication
 *     summary: Punch in or punch out
 *     description: Allows a healthcare worker to punch in or punch out of a shift.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PunchTimeRequest'
 *     responses:
 *       200:
 *         description: Punch action completed successfully.
 *       400:
 *         description: Invalid punch request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
shiftApplicantRouter.post("/punchTime", checkAuth,validateRequest(punchTimeValidation),punchTimeController);



export default shiftApplicantRouter;

