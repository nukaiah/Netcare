import Joi from "joi";

const createShiftAttendanceValidation = Joi.object({
    shiftId: Joi.string().required().messages({
        "any.required": "Shift Id is required",
        "string.empty": "Shift Id cannot be empty",
        "string.base": "Shift Id must be a string"
    }),

    shiftApplicationId: Joi.string().required().messages({
        "any.required": "Shift Application Id is required",
        "string.empty": "Shift Application Id cannot be empty",
        "string.base": "Shift Application Id must be a string"
    }),

    hospitalId: Joi.string().required().messages({
        "any.required": "Hospital Id is required",
        "string.empty": "Hospital Id cannot be empty",
        "string.base": "Hospital Id must be a string"
    }),

    workerId: Joi.string().required().messages({
        "any.required": "Worker Id is required",
        "string.empty": "Worker Id cannot be empty",
        "string.base": "Worker Id must be a string"
    }),

    attendanceDate: Joi.date().required().messages({
        "any.required": "Attendance Date is required",
        "date.base": "Attendance Date must be a valid date"
    }),

    scheduledStartTime: Joi.string().required().messages({
        "any.required": "Scheduled Start Time is required",
        "string.empty": "Scheduled Start Time cannot be empty",
        "string.base": "Scheduled Start Time must be a string"
    }),

    scheduledEndTime: Joi.string().required().messages({
        "any.required": "Scheduled End Time is required",
        "string.empty": "Scheduled End Time cannot be empty",
        "string.base": "Scheduled End Time must be a string"
    }),

    punchIn: Joi.date().required().messages({
        "any.required": "Punch In time is required",
        "date.base": "Punch In must be a valid date"
    }),

    attendanceStatus: Joi.string().valid("Pending", "Present", "Late").default("Pending").messages({
        "string.base": "Attendance Status must be a string",
        "any.only": "Attendance Status must be one of Pending, Present or Late"
    }),

    remarks: Joi.string().allow("", null).max(500).messages({
        "string.base": "Remarks must be a string",
        "string.max": "Remarks cannot exceed 500 characters"
    })
});


const updateShiftAttendanceValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Shift Attendance Id is required",
        "string.empty": "Shift Attendance Id cannot be empty",
        "string.base": "Shift Attendance Id must be a string"
    }),
});

const getShiftAttendanceValidation = Joi.object({
    shiftApplicationId: Joi.string().messages({
        "string.base": "Shift Application Id must be a string",
        "string.empty": "Shift Application Id cannot be empty"
    }),

    workerId: Joi.string().messages({
        "string.base": "Worker Id must be a string",
        "string.empty": "Worker Id cannot be empty"
    }),
});


export { createShiftAttendanceValidation, updateShiftAttendanceValidation, getShiftAttendanceValidation };