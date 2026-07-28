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
    }),

    status: Joi.string()
        .valid("Applied", "Approved", "Rejected")
        .required()
        .messages({
            "any.required": "Status is required",
            "string.empty": "Status cannot be empty",
            "any.only": "Status must be from enum"
        }),

});


const workerCancellationValidation = Joi.object({
    shiftId: Joi.string().required().messages({
        "any.required": "Shift Id is required.",
        "string.empty": "ShiftId id cannot be empty",
    }),
    hospitalId: Joi.string().required().messages({
        "any.required": "Hospital Id is required.",
        "string.empty": "Hospital id cannot be empty"
    }),
    workerId: Joi.string().required().messages({
        "any.required": "Worker Id is required.",
        "string.empty": "WorkerId id cannot be empty"
    }),
    reason: Joi.string().trim().min(5).max(500).required().messages({
        "string.empty": "Cancellation reason is required.",
        "string.min": "Reason must contain at least 5 characters.",
        "string.max": "Reason cannot exceed 500 characters."
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


export {
    showInterestValidation,
    workerCancellationValidation,
    shiftApplicationActionValidation,
    getShiftApplicationValidation,
    punchTimeValidation
};