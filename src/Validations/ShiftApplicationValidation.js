import Joi from "joi";

const showInterestValidation = Joi.object({
    hospitalId: Joi.string().required().messages({
        "any.required": "Hospital id is required",
        "string.empty": "Hospital id cannot be empty"
    }),

    shiftId: Joi.string().required().messages({
        "any.required": "Shift id is required",
        "string.empty": "Shift id cannot be empty"
    }),

    workerId: Joi.string().required().messages({
        "any.required": "Worker id is required",
        "string.empty": "Worker id cannot be empty"
    })
});

const shiftApplicationActionValidation = Joi.object({
    sId: Joi.string()
        .required()
        .messages({
            "any.required": "Application id is required",
            "string.empty": "Application id cannot be empty"
        }),

    status: Joi.string()
        .valid("Approved", "Rejected")
        .required()
        .messages({
            "any.required": "Status is required",
            "string.empty": "Status cannot be empty",
            "any.only": "Status must be either Approved or Rejected"
        }),

    userId: Joi.string()
        .required()
        .messages({
            "any.required": "User id is required",
            "string.empty": "User id cannot be empty"
        }),

    hospitalName: Joi.string()
        .trim()
        .required()
        .messages({
            "any.required": "Hospital name is required",
            "string.empty": "Hospital name cannot be empty"
        }),

    shiftDate: Joi.date()
        .iso()
        .required()
        .messages({
            "any.required": "Shift date is required",
            "date.base": "Shift date must be a valid date",
            "date.format": "Shift date must be in ISO format"
        })
});

const getShiftApplicationValidation = Joi.object({
    shiftId: Joi.string()
        .required()
        .messages({
            "any.required": "Shift id is required",
            "string.empty": "Shift id cannot be empty"
        })
    
});

const punchTimeValidation = Joi.object({
    sId: Joi.string()
        .required()
        .messages({
            "any.required": "Application id is required",
            "string.empty": "Application id cannot be empty"
        }),

    type: Joi.string()
        .valid("PunchIn", "PunchOut")
        .required()
        .messages({
            "any.required": "Punch type is required",
            "string.empty": "Punch type cannot be empty",
            "any.only": "Punch type must be either PunchIn or PunchOut"
        }),

    workerId: Joi.string()
        .required()
        .messages({
            "any.required": "Worker id is required",
            "string.empty": "Worker id cannot be empty",
        })
});

export {showInterestValidation,shiftApplicationActionValidation,getShiftApplicationValidation,punchTimeValidation};