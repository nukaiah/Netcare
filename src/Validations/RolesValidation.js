import Joi from "joi";


const rolesValidation = Joi.object({
    roleId: Joi.number().required().messages({
        "any.required": "Role id is required",
        "number.base": "Role id must be a number"
    }),
    roleName: Joi.string().required().messages({
        "any.required": "Role name is required",
        "string.empty": "Role name cannot be empty",
        "string.base": "Role name must be a string"
    }),
    aboutRole: Joi.string().required().messages({
        "any.required": "About role is required",
        "string.empty": "About role cannot be empty",
        "string.base": "Role name must be a string"
    }),
});



export { rolesValidation };