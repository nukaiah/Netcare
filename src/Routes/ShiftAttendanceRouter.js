import { punchInController, punchOutController, getShiftAttendanceController } from "../Controllers/ShiftAttendanceController.js";
import { checkAuth, checkHealthcareWorker } from "../Utils/Jwt_Token.js";
import { createShiftAttendanceValidation, updateShiftAttendanceValidation, getShiftAttendanceValidation } from "../Validations/ShiftAttendanceValidation.js";
import validateRequest from "../Utils/Vlaidations.js";
import express from "express";

const ShiftAttendanceRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Shift Attendance
 *   description: Shift Attendance Management APIs
 */


/**
 * @swagger
 * /api/attendance/punchIn:
 *   post:
 *     summary: Punch In
 *     description: Healthcare worker punches in for the assigned shift.
 *     tags: [Shift Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShiftAttendance'
 *     responses:
 *       200:
 *         description: Punch In successful.
 */
ShiftAttendanceRouter.post("/punchIn", checkAuth, checkHealthcareWorker, validateRequest(createShiftAttendanceValidation), punchInController);


/**
 * @swagger
 * /api/attendance/punchOut:
 *   patch:
 *     summary: Punch Out
 *     description: Healthcare worker punches out from the assigned shift.
 *     tags: [Shift Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShiftAttendance'
 *     responses:
 *       200:
 *         description: Punch Out successful.
 */
ShiftAttendanceRouter.patch("/punchOut", checkAuth, checkHealthcareWorker, validateRequest(updateShiftAttendanceValidation), punchOutController);


/**
 * @swagger
 * /api/attendance/shiftAttendance:
 *   post:
 *     summary: Get Shift Attendance
 *     description: Retrieve shift attendance records.
 *     tags: [Shift Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetShiftAttendance'
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully.
 */
ShiftAttendanceRouter.post("/shiftAttendance", checkAuth, validateRequest(getShiftAttendanceValidation), getShiftAttendanceController);


export default ShiftAttendanceRouter;