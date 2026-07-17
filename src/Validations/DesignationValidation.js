import Joi from "joi";

const designationValidation = Joi.object({
    designationName: Joi.string().required().messages({
        "any.required": "Designation name is required",
        "string.empty": "Designation name cannot be empty",
        "string.base": "Designation name must be a string",
    }),
    status: Joi.string().valid("Active", "Inactive").required().messages({
        "any.required": "Status name is required",
        "string.empty": "Status name cannot be empty",
        "any.only": "Status name is not valid"
    }), 
});

const updateDesignationValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    designationName: Joi.string().required().messages({
        "any.required": "Designation name is required",
        "string.empty": "Designation name cannot be empty",
        "string.base": "Designation name must be a string",
    }),
    status: Joi.string().valid("Active", "Inactive").required().messages({
        "any.required": "Status name is required",
        "string.empty": "Status name cannot be empty",
        "any.only": "Status name is not valid"
    }),    
});


export { designationValidation,updateDesignationValidation };
