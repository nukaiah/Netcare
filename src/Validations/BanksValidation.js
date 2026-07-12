import Joi from "joi";

const createBankValidation = Joi.object({
    bankName: Joi.string().required().messages({
        "any.required": "Bank name is required",
        "string.empty": "Bank name cannot be empty",
        "any.only": "Bank name is not valid"
    }),
    universalBranchCode: Joi.string().required().messages({
        "any.required": "Universal barnch code is required",
        "string.empty": "Universal barnch code cannot be empty",
        "string.base": "Universal barnch code must be a string",
    })
});


export { createBankValidation};
