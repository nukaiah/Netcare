import Joi from "joi";

const ExperianceValidation = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User id is required",
        "string.empty": "User id cannot be empty"
    }),
    hospitalName: Joi.string().required().messages({
        "any.required": "Hospital name is required",
        "string.empty": "Hospital cannot be empty",
        "any.only": "Hospital is not valid"
    }),
    designation: Joi.string().required().messages({
        "any.required": "Designation  is required",
        "string.empty": "Designation cannot be empty",
        "string.base": "Designation must be a string"
    }),
    department: Joi.string().required().messages({
        "any.required": "Department is required",
        "string.empty": "Department cannot be empty",
        "string.base": "Department must be a string",
    }),
    employmentType: Joi.string().valid("Full Time", "Part Time", "Contract", "Locum").required().messages({
        "any.required": "Employment type is required",
        "string.empty": "Employment type cannot be empty",
        "any.only": "Employment type is not valid"
    }),
    startDate: Joi.date().iso().required().messages({
        "any.required": "Start date is required",
        "date.base": "Start date must be a valid date",
        "date.format": "Start date must be in ISO format"
    }),
    endDate: Joi.when('isCurrentlyWorking', {
        is: true,
        then: Joi.valid(null).messages({
            "any.only": "End date must be null when currently working"
        }),
        otherwise: Joi.date().iso().required().messages({
            "any.required": "End date is required when not currently working",
            "date.base": "End date must be a valid date",
            "date.format": "End date must be in ISO format"
        })
    }),

    isCurrentlyWorking: Joi.boolean().required().messages({
        "any.required": "Working status is required",
        "boolean.base": "Working status must be true or false"
    })
});


const updateExperianceValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    hospitalName: Joi.string().required().messages({
        "any.required": "Hospital name is required",
        "string.empty": "Hospital cannot be empty",
        "any.only": "Hospital is not valid"
    }),
    designation: Joi.string().required().messages({
        "any.required": "Designation  is required",
        "string.empty": "Designation cannot be empty",
        "string.base": "Designation must be a string"
    }),
    department: Joi.string().required().messages({
        "any.required": "Department is required",
        "string.empty": "Department cannot be empty",
        "string.base": "Department must be a string",
    }),
    employmentType: Joi.string().valid("Full Time", "Part Time", "Contract", "Locum").required().messages({
        "any.required": "Employment type is required",
        "string.empty": "Employment type cannot be empty",
        "any.only": "Employment type is not valid"
    }),
    startDate: Joi.date().iso().required().messages({
        "any.required": "Start date is required",
        "date.base": "Start date must be a valid date",
        "date.format": "Start date must be in ISO format"
    }),
    endDate: Joi.when('isCurrentlyWorking', {
        is: true,
        then: Joi.valid(null).messages({
            "any.only": "End date must be null when currently working"
        }),
        otherwise: Joi.date().iso().required().messages({
            "any.required": "End date is required when not currently working",
            "date.base": "End date must be a valid date",
            "date.format": "End date must be in ISO format"
        })
    }),
    isCurrentlyWorking: Joi.boolean().required().messages({
        "any.required": "Working status is required",
        "boolean.base": "Working status must be true or false"
    })
});




export { ExperianceValidation,updateExperianceValidation };
