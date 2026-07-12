import Joi from "joi";



const userUpdateValidationSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    dob: Joi.string().required().messages({
        "any.required": "Full name is required",
        "string.empty": "Full name cannot be empty",
        "string.base": "Full name must be a string"
    }),
    designationId: Joi.string().required().messages({
        "any.required": "Full name is required",
        "string.empty": "Full name cannot be empty",
        "string.base": "Full name must be a string"
    }),
    gender: Joi.string()
        .valid("Male", "Female", "Others")
        .required()
        .messages({
            "any.required": "Gender is required",
            "string.empty": "Gender cannot be empty",
            "any.only": "Gender is not valid"
        }),
});


const updateFcmTokenValidation = Joi.object({
    fcm: Joi.string().required().messages({
        "any.required": "Fcm token is required",
        "string.empty": "Fcm token cannot be empty",
        "string.base": "Fcm token must be a string"
    }),
    type: Joi.string().valid("Login", "Logout").required().messages({
        "any.required": "Type is required",
        "string.empty": "Type cannot be empty",
        "any.only": "Type is not valid"
    }),
});


const getUsersValidation = Joi.object({
    roleId: Joi.number().integer().valid(2, 3).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});

const userStatusValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    verificationStatus: Joi.string()
        .valid("Pending", "Verified", "Rejected")
        .required()
        .messages({
            "any.required": "Verification status is required",
            "string.empty": "Verification status cannot be empty",
            "any.only": "Verification status is not valid"
        }),
});





export { userUpdateValidationSchema, updateFcmTokenValidation, getUsersValidation, userStatusValidation };