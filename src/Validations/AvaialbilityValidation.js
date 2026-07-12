import Joi from "joi";

const createAvailabilityValidation = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User id is required",
        "string.empty": "User id cannot be empty"
    }),

    date: Joi.string().required().messages({
        "any.required": "Date is required",
        "date.base": "Date must be a valid date",
        "date.format": "Date must be in ISO format (YYYY-MM-DD)"
    }),

    shiftType: Joi.string().valid("Morning", "Afternoon", "Night").required().messages({
        "any.required": "Shift type is required",
        "string.empty": "Shift type cannot be empty",
        "any.only": "Shift type must be one of Morning, Afternoon or Night"
    }),

    isAvailable: Joi.boolean().required().messages({
        "any.required": "Availability status is required",
        "boolean.base": "Availability status must be true or false"
    })
});

export { createAvailabilityValidation };