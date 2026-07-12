import Joi from "joi";

const ShiftPostValidation = Joi.object({
    hospitalId: Joi.string().required().messages({
        "any.required": "Hospital id is required",
        "string.empty": "Hospital id cannot be empty"
    }),

    hospitalName: Joi.string().trim().required().messages({
        "any.required": "Hospital name is required",
        "string.empty": "Hospital name cannot be empty",
        "string.base": "Hospital name must be a string"
    }),

    departmentId: Joi.string().required().messages({
        "any.required": "Department id is required",
        "string.empty": "Department id cannot be empty"
    }),

    departmentName: Joi.string().trim().required().messages({
        "any.required": "Department name is required",
        "string.empty": "Department name cannot be empty",
        "string.base": "Department name must be a string"
    }),

    designationId: Joi.string().required().messages({
        "any.required": "Designation id is required",
        "string.empty": "Designation id cannot be empty"
    }),

    designationName: Joi.string().trim().required().messages({
        "any.required": "Designation name is required",
        "string.empty": "Designation name cannot be empty",
        "string.base": "Designation name must be a string"
    }),

    locationId: Joi.string().required().messages({
        "any.required": "Location id is required",
        "string.empty": "Location id cannot be empty"
    }),

    locationName: Joi.string().trim().required().messages({
        "any.required": "Location name is required",
        "string.empty": "Location name cannot be empty",
        "string.base": "Location name must be a string"
    }),

    shiftStartDate: Joi.date().required().messages({
        "any.required": "Shift start date is required",
        "date.base": "Shift start date must be a valid date"
    }),

    shiftEndDate: Joi.date()
        .min(Joi.ref("shiftStartDate"))
        .required()
        .messages({
            "any.required": "Shift end date is required",
            "date.base": "Shift end date must be a valid date",
            "date.min": "Shift end date must be greater than or equal to shift start date"
        }),

    startTime: Joi.string().required().messages({
        "any.required": "Start time is required",
        "string.empty": "Start time cannot be empty",
        "string.base": "Start time must be a string"
    }),

    endTime: Joi.string().required().messages({
        "any.required": "End time is required",
        "string.empty": "End time cannot be empty",
        "string.base": "End time must be a string"
    }),

    requiredStaff: Joi.number().integer().min(1).required().messages({
        "any.required": "Required staff is required",
        "number.base": "Required staff must be a number",
        "number.integer": "Required staff must be an integer",
        "number.min": "Required staff must be at least 1"
    }),

    payRate: Joi.number().min(0).required().messages({
        "any.required": "Pay rate is required",
        "number.base": "Pay rate must be a number",
        "number.min": "Pay rate cannot be negative"
    }),

    duties: Joi.string().allow("", null).optional().messages({
        "string.base": "Duties must be a string"
    }),

    status: Joi.string()
        .valid("Open", "Closed", "Cancelled", "Completed")
        .optional()
        .messages({
            "any.only": "Status must be one of Open, Closed, Cancelled or Completed"
        })
});

const getWebShiftsValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});

const updateShiftStatusValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    status: Joi.string()
        .valid("Open", "Closed", "Cancelled", "Completed")
        .optional()
        .messages({
            "any.only": "Status must be one of Open, Closed, Cancelled or Completed"
        })
});


export { ShiftPostValidation, getWebShiftsValidation, updateShiftStatusValidation };