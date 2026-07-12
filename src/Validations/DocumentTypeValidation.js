import Joi from "joi";

const DocumentTypeValidation = Joi.object({
    documentName: Joi.string().required().messages({
        "any.required": "Document name is required",
        "string.empty": "Document name cannot be empty",
        "string.base": "Document name must be a string"
    }),
    referTo: Joi.number().required().messages({
        "any.required": "Refer to is required",
        "number.base": "Refer to must be a number"
    }),
    isExipreDate: Joi.boolean().required().messages({
        "any.required": "Exipre date is required",
        "boolean.base": "Exipre date must be true or false"
    }),
});


const updateDocumentTypeValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    documentName: Joi.string().required().messages({
        "any.required": "Document name is required",
        "string.empty": "Document name cannot be empty",
        "string.base": "Document name must be a string"
    }),
    referTo: Joi.number().required().messages({
        "any.required": "Refer to is required",
        "number.base": "Refer to must be a number"
    }),
    isExipreDate: Joi.boolean().required().messages({
        "any.required": "Exipre date is required",
        "boolean.base": "Exipre date must be true or false"
    }),
});


const getAllDocumentTypeValidatiion = Joi.object({
    referTo: Joi.number().required().messages({
        "any.required": "Refer to is required",
        "number.base": "Refer to must be a number"
    })
});

export { DocumentTypeValidation, updateDocumentTypeValidation,getAllDocumentTypeValidatiion };
