import Joi from "joi";

const BankValidation = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User id is required",
        "string.empty": "User id cannot be empty"
    }),
    accountHolderName: Joi.string().min(3).max(100).required().messages({
        "any.required": "AccountHolderName  is required",
        "string.empty": "AccountHolderName cannot be empty",
        "string.base": "AccountHolderName must be a string",
        "string.min": "AccountHolderName must be at least 3 characters",
        "string.max": "AccountHolderName must be at most 100 characters"
    }),
    bankName: Joi.string().required().messages({
        "any.required": "Bank name is required",
        "string.empty": "Bank name cannot be empty",
        "any.only": "Bank name is not valid"
    }),
    accountNumber: Joi.string().required().messages({
        "any.required": "Account number is required",
        "string.empty": "Account number cannot be empty",
        "string.base": "Account number must be a string",
    }),
    accountType: Joi.string().valid("Savings", "Cheque", "Current", "Business").required().messages({
        "any.required": "Account type is required",
        "string.empty": "Account type cannot be empty",
        "any.only": "Account type is not valid"
    }),
    branchName: Joi.string().required().messages({
        "any.required": "Bank name is required",
        "string.empty": "Bank name cannot be empty",
        "string.base": "Bank name must be a string",
    }),
    branchCode: Joi.string().required().messages({
        "any.required": "Branch code is required",
        "string.empty": "Branch code cannot be empty",
        "string.base": "Branch code must be a string",
    }),
    universalBranchCode: Joi.string().required().messages({
        "any.required": "Universal barnch code is required",
        "string.empty": "Universal barnch code cannot be empty",
        "string.base": "Universal barnch code must be a string",
    })
});

const updateBankValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    accountHolderName: Joi.string().min(3).max(100).required().messages({
        "any.required": "AccountHolderName  is required",
        "string.empty": "AccountHolderName cannot be empty",
        "string.base": "AccountHolderName must be a string",
        "string.min": "AccountHolderName must be at least 3 characters",
        "string.max": "AccountHolderName must be at most 100 characters"
    }),
    bankName: Joi.string().required().messages({
        "any.required": "Bank name is required",
        "string.empty": "Bank name cannot be empty",
        "any.only": "Bank name is not valid"
    }),
    accountNumber: Joi.string().required().messages({
        "any.required": "Account number is required",
        "string.empty": "Account number cannot be empty",
        "string.base": "Account number must be a string",
    }),
    accountType: Joi.string().valid("Savings", "Cheque", "Current", "Business").required().messages({
        "any.required": "Account type is required",
        "string.empty": "Account type cannot be empty",
        "any.only": "Account type is not valid"
    }),
    branchName: Joi.string().required().messages({
        "any.required": "Bank name is required",
        "string.empty": "Bank name cannot be empty",
        "string.base": "Bank name must be a string",
    }),
    branchCode: Joi.string().required().messages({
        "any.required": "Branch code is required",
        "string.empty": "Branch code cannot be empty",
        "string.base": "Branch code must be a string",
    }),
    universalBranchCode: Joi.string().required().messages({
        "any.required": "Universal barnch code is required",
        "string.empty": "Universal barnch code cannot be empty",
        "string.base": "Universal barnch code must be a string",
    })
});

export { BankValidation, updateBankValidation };
