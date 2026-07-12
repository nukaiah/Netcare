import Joi from "joi";

const qualificationValidation = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User id is required",
        "string.empty": "User id cannot be empty"
    }),
    education: Joi.string().valid("Grade R", "Primary School", "Secondary School", "Matric", "Certificate", "Diploma", "Advanced Diploma", "Bachelor Degree", "Honours Degree", "Postgraduate Diploma", "Master Degree", "Doctorate").required().messages({
        "any.required": "Education is required",
        "string.empty": "Education cannot be empty",
        "any.only": "Education is not valid"
    }),

    institution: Joi.string().required().messages({
        "any.required": "Institution  is required",
        "string.empty": "Institution cannot be empty",
        "string.base": "Institution must be a string"
    }),
    course: Joi.string().required().messages({
        "any.required": "Course is required",
        "string.empty": "Course cannot be empty",
        "string.base": "Course must be a string",
    }),
    specialization: Joi.string().required().messages({
        "any.required": "Specialization is required",
        "string.empty": "Specialization cannot be empty",
        "string.base": "Specialization must be a string",
    }),
    startYear: Joi.string().required().messages({
        "any.required": "Start year is required",
        "string.empty": "Start year cannot be empty",
        "string.base": "Start year must be a string",
    }),
    endYear: Joi.string().required().messages({
        "any.required": "End year is required",
        "string.empty": "End year cannot be empty",
        "string.base": "End year must be a string",
    }),
    courseType: Joi.string().required().messages({
        "any.required": "Course type is required",
        "string.empty": "Course type cannot be empty",
        "string.base": "Course type must be a string",
    }),
    sortOrder: Joi.number().integer().required().messages({
        "any.required": "Sort order is required",
        "number.base": "Sort order must be a number",
        "number.integer": "Sort order must be an integer",
    })
});

const qualificationUpdateValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    education: Joi.string().valid("Grade R", "Primary School", "Secondary School", "Matric", "Certificate", "Diploma", "Advanced Diploma", "Bachelor Degree", "Honours Degree", "Postgraduate Diploma", "Master Degree", "Doctorate").optional().messages({
        "any.required": "Education is required",
        "string.empty": "Education cannot be empty",
        "any.only": "Education is not valid"
    }),
    institution: Joi.string().optional().messages({
        "any.required": "Institution  is required",
        "string.empty": "Institution cannot be empty",
        "string.base": "Institution must be a string"
    }),
    course: Joi.string().optional().messages({
        "any.required": "Course is required",
        "string.empty": "Course cannot be empty",
        "string.base": "Course must be a string",
    }),
    specialization: Joi.string().optional().messages({
        "any.required": "Specialization is required",
        "string.empty": "Specialization cannot be empty",
        "string.base": "Specialization must be a string",
    }),
    startYear: Joi.string().optional().messages({
        "any.required": "Start year is required",
        "string.empty": "Start year cannot be empty",
        "string.base": "Start year must be a string",
    }),
    endYear: Joi.string().optional().messages({
        "any.required": "End year is required",
        "string.empty": "End year cannot be empty",
        "string.base": "End year must be a string",
    }),
    courseType: Joi.string().optional().messages({
        "any.required": "Course type is required",
        "string.empty": "Course type cannot be empty",
        "string.base": "Course type must be a string",
    }),
    sortOrder: Joi.number().integer().optional().messages({
        "any.required": "Sort order is required",
        "number.base": "Sort order must be a number",
        "number.integer": "Sort order must be an integer",
    })
});


export { qualificationValidation,qualificationUpdateValidation };
