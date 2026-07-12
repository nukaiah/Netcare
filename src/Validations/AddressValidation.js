import Joi from "joi";

const AddressValidation = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User id is required",
        "string.empty": "User id cannot be empty"
    }),
    addressLine1: Joi.string().min(5).max(255).required().messages({
        "any.required": "Address line1 is required",
        "string.empty": "Address line1 cannot be empty",
        "string.base": "Address line1 must be a string",
        "string.min": "Address line1 must be at least 3 characters",
        "string.max": "Address line1 must be at most 255 characters"
    }),
    addressLine2: Joi.string().min(5).max(255).optional().allow(null, '').messages({
        "any.required": "Address line2 is required",
        "string.empty": "Address line2 cannot be empty",
        "string.base": "Address line2 must be a string",
        "string.min": "Address line2 must be at least 3 characters",
        "string.max": "Address line2 must be at most 255 characters"
    }),
    cityId: Joi.string().required().messages({
        "any.required": "City id is required",
        "string.empty": "City id cannot be empty"
    }),
    cityName: Joi.string().required().messages({
        "any.required": "City name is required",
        "string.empty": "City name cannot be empty"
    }),
    stateId: Joi.string().required().messages({
        "any.required": "State id is required",
        "string.empty": "State id cannot be empty"
    }),
    stateName: Joi.string().required().messages({
        "any.required": "State name is required",
        "string.empty": "State name cannot be empty"
    }),

    postalCode: Joi.string()
    .pattern(/^\d{4}$/)
    .required()
    .messages({
        "any.required": "Postal code is required",
        "string.empty": "Postal code cannot be empty",
        "string.base": "Postal code must be a string",
        "string.pattern.base": "Postal code must be exactly 4 digits"
    }),
    country: Joi.string().min(3).max(36).required().messages({
        "any.required": "Country is required",
        "string.empty": "Country cannot be empty",
        "string.base": "Country must be a string",
        "string.min": "Country must be at least 3 characters",
        "string.max": "Country must be at most 36 characters"
    })
});

const updateAddressValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be empty"
    }),
    addressLine1: Joi.string().min(5).max(255).required().messages({
        "any.required": "Address line1 is required",
        "string.empty": "Address line1 cannot be empty",
        "string.base": "Address line1 must be a string",
        "string.min": "Address line1 must be at least 3 characters",
        "string.max": "Address line1 must be at most 255 characters"
    }),
    addressLine2: Joi.string().min(5).max(255).optional().allow(null, '').messages({
        "any.required": "Address line2 is required",
        "string.empty": "Address line2 cannot be empty",
        "string.base": "Address line2 must be a string",
        "string.min": "Address line2 must be at least 3 characters",
        "string.max": "Address line2 must be at most 255 characters"
    }),
    cityId: Joi.string().required().messages({
        "any.required": "City id is required",
        "string.empty": "City id cannot be empty"
    }),
    cityName: Joi.string().required().messages({
        "any.required": "City name is required",
        "string.empty": "City name cannot be empty"
    }),
    stateId: Joi.string().required().messages({
        "any.required": "State id is required",
        "string.empty": "State id cannot be empty"
    }),
    stateName: Joi.string().required().messages({
        "any.required": "State name is required",
        "string.empty": "State name cannot be empty"
    }),
    postalCode: Joi.string()
    .pattern(/^\d{4}$/)
    .required()
    .messages({
        "any.required": "Postal code is required",
        "string.empty": "Postal code cannot be empty",
        "string.base": "Postal code must be a string",
        "string.pattern.base": "Postal code must be exactly 4 digits"
    }),
    country: Joi.string().min(3).max(100).required().messages({
        "any.required": "Country is required",
        "string.empty": "Country cannot be empty",
        "string.base": "Country must be a string",
        "string.min": "Country must be at least 3 characters",
        "string.max": "Country must be at most 100 characters"
    })
});

export { AddressValidation, updateAddressValidation };
