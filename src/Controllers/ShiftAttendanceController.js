import { punchInService, punchOutService,getShiftAttendanceService } from "../Services/ShiftAttendanceService.js";
import { successResponse, createResponse, conflictResponse } from "../Utils/Response.js";

const punchInController = async (req, res, next) => {
    try {
        const attendanceData = req.body || {};
        const result = await punchInService(attendanceData);
        return createResponse(res, result, "Punch in successfully");
    } catch (error) {
        if (error.code === 11000) {
            return conflictResponse(res, "Already punched in for today");
        }
        return next(error);
    }
};

const punchOutController = async (req, res, next) => {
    try {
        const attendanceData = req.body || {};
        const result = await punchOutService(attendanceData);
        return successResponse(res, result, "Punch out successfully");
    } catch (error) {
        return next(error);
    }
};

const getShiftAttendanceController = async (req, res, next) => {
    try {
        const {shiftApplicationId} = req.body || {};
        const result = await getShiftAttendanceService(shiftApplicationId);
        return successResponse(res, result, "Shift attendance found successfully");
    } catch (error) {
        return next(error);
    }
};

export { punchInController, punchOutController,getShiftAttendanceController };