import Joi from "joi";

const DeparmentValidation = Joi.object({
    departmentName: Joi.string().required().messages({
        "any.required": "Department name is required",
        "string.empty": "Department name cannot be empty",
        "string.base": "Department name must be a string",
    }),
    isActive: Joi.boolean().required().messages({
        "any.required": "Is active is required",
        "boolean.base": "is active must be true or false"
    }),
});

const updateDepartmentValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    departmentName: Joi.string().required().messages({
        "any.required": "Department name is required",
        "string.empty": "Department name cannot be empty",
        "string.base": "Department name must be a string",
    }),
    isActive: Joi.boolean().required().messages({
        "any.required": "Is active is required",
        "boolean.base": "is active must be true or false"
    }),
});


export { DeparmentValidation, updateDepartmentValidation };
