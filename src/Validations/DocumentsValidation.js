import Joi from "joi";

const DocumentUplodaValidation = Joi.object({
    hospitalId: Joi.string().required().messages({
        "any.required": "Hospital id is required",
        "string.empty": "Hospital id cannot be empty"
    }),
    documentTypeId: Joi.string().required().messages({
        "any.required": "Document type id is required",
        "string.empty": "Document type id cannot be empty"
    }),
    issuedBy: Joi.string().required().messages({
        "any.required": "Issued by is required",
        "string.empty": "Issued by cannot be empty",
        "string.base": "Issued by must be a string"
    }),
    issueDate: Joi.string().required().messages({
        "any.required": "Issue date is required",
        "string.empty": "Issue date cannot be empty",
        "string.base": "Issue date must be a string",
    }),
    expiryDate: Joi.string().optional().messages({
        "any.required": "Expiry date is required",
        // "string.empty": "Expiry date cannot be empty",
        "string.base": "Expiry date must be a string",
    })
});

const DocumentUpdateValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    userId: Joi.string().required().messages({
        "any.required": "User id is required",
        "string.empty": "User id cannot be empty"
    }),
    facilityName: Joi.string().required().messages({
        "any.required": "Facility name is required",
        "string.empty": "Facility name by cannot be empty",
        "string.base": "Facility name by must be a string"
    }),
    verificationStatus: Joi.string().valid("Pending", "Verified", "Rejected", "ReUploaded").required().messages({
        "any.required": "Verification status is required",
        "string.empty": "Verification status cannot be empty",
        "any.only": "Verification status is not valid"
    }),
    documentName: Joi.string().required().messages({
        "any.required": "Document name  is required",
        "string.empty": "Document name  cannot be empty",
        "any.only": "Document name  is not valid"
    }),
    verifiedBy: Joi.string().required().messages({
        "any.required": "Verified by is required",
        "string.empty": "Verified by cannot be empty"
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address"
    }),
    rejectionReason: Joi.string().optional().messages({
        "any.required": "Rejection reason  is required",
        "string.empty": "Rejection reason  cannot be empty",
        "any.only": "Rejection reason  is not valid"
    }),
});


export { DocumentUplodaValidation, DocumentUpdateValidation };
