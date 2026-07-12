import Joi from "joi";


const createStateValidation = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.base": "Name must be a string"
    })
});


const updateStateValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.base": "Name must be a string"
    })
});


const createCityValidation = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.base": "Name must be a string"
    }),
    parentId: Joi.string().required().messages({
        "any.required": "Parent id is required",
        "string.empty": "Parent id cannot be empty",
        "string.base": "Parent id must be a string"
    })
});


const updateCityValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
        "string.base": "Name must be a string"
    }),
    parentId: Joi.string().required().messages({
        "any.required": "Parent id is required",
        "string.empty": "Parent id cannot be empty",
        "string.base": "Parent id must be a string"
    })
});


const locationTypeValidation = Joi.object({
    type: Joi.number().required().messages({
        "any.required": "type is required",
        "number.base": "type must be a number"
    })
});


const getAllCityValidation = Joi.object({
    parentId: Joi.string().required().messages({
        "any.required": "Parent id is required",
        "string.empty": "Parent id cannot be empty",
        "string.base": "Parent id must be a string"
    })
});




export { createStateValidation,updateStateValidation, createCityValidation,updateCityValidation, locationTypeValidation, getAllCityValidation };