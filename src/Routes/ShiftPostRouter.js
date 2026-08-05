import express from 'express';
const shiftpostRouter = express.Router();
import { checkAuth, checkHealthcareWorker, checkhospitalAdmin } from '../Utils/Jwt_Token.js';
import validateRequest from '../Utils/Vlaidations.js';
import { ShiftPostValidation, getWebShiftsValidation, updateShiftStatusValidation, getAllMobileValidation, getMyShiftsValidation,getShiftByIdValidation } from '../Validations/ShiftPostValidation.js';
import { createShiftController, getWebShiftController, getMobileShiftController, getAllMyShiftController, updateShiftStausController, getWebDashboardAnalyticsController, getShiftByIdController } from "../Controllers/ShiftPostController.js";



/**
 * @swagger
 * tags:
 *   - name: Shifts
 *     description: SHift Management APIs
 */


/**
 * @swagger
 * /api/shift/create:
 *   post:
 *     summary: Create a new shift
 *     tags:
 *       - Shifts
 *     security:
 *       - bearerAuth: []
 *     description: Creates a new shift. Only Hospital Admin can create shifts.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShiftPostSchema'
 *     responses:
 *       201:
 *         description: Shift created successfully.
 */
shiftpostRouter.post("/create", checkAuth, checkhospitalAdmin, validateRequest(ShiftPostValidation), createShiftController);


/**
 * @swagger
 * /api/shift/getAllWeb:
 *   post:
 *     summary: Get shifts for the web portal
 *     tags:
 *       - Shifts
 *     security:
 *       - bearerAuth: []
 *     description: Returns a paginated list of shifts for the Hospital Admin web portal.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetWebShiftsSchema'
 *     responses:
 *       200:
 *         description: Shifts retrieved successfully.
 */
shiftpostRouter.post("/getAllWeb", checkAuth, checkhospitalAdmin, validateRequest(getWebShiftsValidation), getWebShiftController);


/**
 * @swagger
 * /api/shift/getAllMobile:
 *   post:
 *     tags:
 *       - Shifts
 *     summary: Get Shifts for mobile
 *     description: |
 *       Returns a paginated list of shifts for healthcare workers.
 *       The results can be filtered by preferred location and designation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetAllMobileShiftRequest'
 *     responses:
 *       200:
 *         description: Shifts fetched successfully.
 */
shiftpostRouter.post("/getAllMobile", checkAuth, checkHealthcareWorker, validateRequest(getAllMobileValidation), getMobileShiftController);


/**
 * @swagger
 * /api/shift/getAllMyShifts:
 *   post:
 *     tags:
 *       - Shifts
 *     summary: Get my shifts
 *     description: Returns a paginated list of shifts applied for by the authenticated healthcare worker, including review information if available.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetMyShiftsRequest'
 *     responses:
 *       200:
 *         description: Shifts fetched successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
shiftpostRouter.post("/getAllMyShifts", checkAuth, checkHealthcareWorker, validateRequest(getMyShiftsValidation), getAllMyShiftController);


/**
 * @swagger
 * /api/shift/updateStatus:
 *   patch:
 *     summary: Update shift status
 *     tags:
 *       - Shifts
 *     security:
 *       - bearerAuth: []
 *     description: Updates the status of a shift. Only Hospital Admin can perform this action.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShiftStatusSchema'
 *     responses:
 *       200:
 *         description: Shift status updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Only Hospital Admin can update shift status.
 *       404:
 *         description: Shift not found.
 *       500:
 *         description: Internal server error.
 */
shiftpostRouter.patch("/updateStatus", checkAuth, checkhospitalAdmin, validateRequest(updateShiftStatusValidation), updateShiftStausController);


/**
 * @swagger
 * /api/shift/getDashboard:
 *   post:
 *     summary: Get dashboard analytics
 *     tags:
 *       - Shifts
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves dashboard analytics for the authenticated Hospital Admin, including shift statistics and dashboard metrics.
 *     responses:
 *       200:
 *         description: Dashboard analytics retrieved successfully.
 */
shiftpostRouter.post("/getDashboard", checkAuth, checkhospitalAdmin, getWebDashboardAnalyticsController);


/**
 * @swagger
 * /api/shift/getShiftById:
 *   post:
 *     summary: Get shift details by ID
 *     tags:
 *       - Shifts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetShiftByIdRequest'
 *     responses:
 *       200:
 *         description: Shift details fetched successfully.
 */
shiftpostRouter.post("/getShiftById",checkAuth,validateRequest(getShiftByIdValidation),getShiftByIdController);




export default shiftpostRouter;