import Joi from "joi";


const PreferenceValidation = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User id is required",
        "string.empty": "User id cannot be empty"
    }),

    preferredShiftType: Joi.string().valid("Morning", "Afternoon", "Night").required().messages({
        "any.required": "Preferred shift type is required",
        "string.empty": "Preferred shift type cannot be empty",
        "any.only": "Preferred shift type must be Morning, Afternoon or Night"
    }),

    preferredDepartments: Joi.array().items(
        Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Department id is required",
                "string.empty": "Department id cannot be empty"
            }),

            departmentName: Joi.string().trim().required().messages({
                "any.required": "Department name is required",
                "string.empty": "Department name cannot be empty"
            })
        })
    )
        .min(1)
        .max(5)
        .required()
        .messages({
            "any.required": "Preferred departments are required",
            "array.base": "Preferred departments must be an array",
            "array.min": "At least one department must be selected",
            "array.max": "You can select a maximum of 5 departments"
        }),

    preferredLocation: Joi.object({
        id: Joi.string()
            .required()
            .messages({
                "any.required": "Location id is required",
                "string.empty": "Location id cannot be empty"
            }),

        name: Joi.string()
            .trim()
            .required()
            .messages({
                "any.required": "Location name is required",
                "string.empty": "Location name cannot be empty"
            })
    })
        .required()
        .messages({
            "any.required": "Preferred location is required",
            "object.base": "Preferred location must be an object"
        })
});

const updatePreferenceValidation = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "User id is required",
        "string.empty": "User id cannot be empty"
    }),

    preferredShiftType: Joi.string().valid("Morning", "Afternoon", "Night").required().messages({
        "any.required": "Preferred shift type is required",
        "string.empty": "Preferred shift type cannot be empty",
        "any.only": "Preferred shift type must be Morning, Afternoon or Night"
    }),

    preferredDepartments: Joi.array().items(
        Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Department id is required",
                "string.empty": "Department id cannot be empty"
            }),

            departmentName: Joi.string().trim().required().messages({
                "any.required": "Department name is required",
                "string.empty": "Department name cannot be empty"
            })
        })
    )
        .min(1)
        .max(5)
        .required()
        .messages({
            "any.required": "Preferred departments are required",
            "array.base": "Preferred departments must be an array",
            "array.min": "At least one department must be selected",
            "array.max": "You can select a maximum of 5 departments"
        }),

    preferredLocation: Joi.object({
        id: Joi.string()
            .required()
            .messages({
                "any.required": "Location id is required",
                "string.empty": "Location id cannot be empty"
            }),

        name: Joi.string()
            .trim()
            .required()
            .messages({
                "any.required": "Location name is required",
                "string.empty": "Location name cannot be empty"
            })
    })
        .required()
        .messages({
            "any.required": "Preferred location is required",
            "object.base": "Preferred location must be an object"
        })
});


export { PreferenceValidation, updatePreferenceValidation };