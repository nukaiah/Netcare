import Joi from "joi";

const createReviewValidation = Joi.object({
    shiftId: Joi.string().required().messages({
        "any.required": "Shift id is required",
        "string.empty": "Shift id cannot be empty",
    }),

    shiftApplicationId: Joi.string().required().messages({
        "any.required": "Shift application id is required",
        "string.empty": "Shift application id cannot be empty",
    }),

    reviewerId: Joi.string().required().messages({
        "any.required": "Reviewer id is required",
        "string.empty": "Reviewer id cannot be empty",
    }),

    reviewerType: Joi.string().valid("facility", "worker").required().messages({
        "any.required": "Reviewer type is required",
        "string.empty": "Reviewer type cannot be empty",
        "any.only": "Reviewer type must be either facility or worker"
    }),

    targetId: Joi.string().required().messages({
        "any.required": "Target id is required",
        "string.empty": "Target id cannot be empty"
    }),

    targetType: Joi.string().valid("worker", "facility").required().messages({
        "any.required": "Target type is required",
        "string.empty": "Target type cannot be empty",
        "any.only": "Target type must be either worker or facility"
    }),

    rating: Joi.number().integer().min(1).max(5).required().messages({
        "any.required": "Rating is required",
        "number.base": "Rating must be a number",
        "number.integer": "Rating must be an integer",
        "number.min": "Rating must be at least 1",
        "number.max": "Rating cannot be greater than 5"
    }),

    incidentTypes: Joi.when("rating", {
        is: Joi.number().less(3),
        then: Joi.array()
            .items(Joi.string().trim().required())
            .min(1)
            .required()
            .messages({
                "any.required": "Incident type is required for ratings below 3.",
                "array.base": "Incident types must be an array.",
                "array.min": "Please select at least one incident type."
            }),
        otherwise: Joi.array()
            .items(Joi.string().trim())
            .optional()
    }),
    message: Joi.string().trim().optional().allow("").messages({
        "string.base": "Message must be a string"
    }),
});

export { createReviewValidation };