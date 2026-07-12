import Joi from "joi";


const genarateEmailMobileOtpValidation = Joi.object({
    email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email address"
    }),
    mobileNumber: Joi.string()
        .pattern(/^(\+27|27|0)[6-8][0-9]{8}$/)
        .required()
        .messages({
            "any.required": "Mobile number is required",
            "string.empty": "Mobile number cannot be empty",
            "string.base": "Mobile number must be a string",
            "string.pattern.base": "Enter a valid South African mobile number"
        })
});


const verifyOtpValidation = Joi.object({
    type: Joi.string()
        .valid("Register", "ForgotPassword")
        .required()
        .messages({
            "any.required": "Type is required",
            "string.empty": "Type cannot be empty",
            "any.only": "Type is not valid"
        }),

    mode: Joi.string()
        .valid("Email", "Mobile")
        .required()
        .messages({
            "any.required": "Mode is required",
            "string.empty": "Mode cannot be empty",
            "any.only": "Mode is not valid"
        }),

    emailMobile: Joi.when("mode", {
        is: "Email",
        then: Joi.string()
            .email()
            .required()
            .messages({
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty",
                "string.email": "Invalid email format",
            }),

        otherwise: Joi.string()
            .pattern(/^(\+27|27|0)[6-8][0-9]{8}$/)
            .required()
            .messages({
                "any.required": "Mobile number is required",
                "string.empty": "Mobile number cannot be empty",
                "string.base": "Mobile number must be a string",
                "string.pattern.base": "Enter a valid South African mobile number"
            })
    }),

    otp: Joi.string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
            "any.required": "OTP is required",
            "string.empty": "OTP cannot be empty",
            "string.pattern.base": "OTP must be exactly 6 digits",
        }),
});

const resendOtpValidatiion = Joi.object({
    type: Joi.string()
        .valid("Register", "ForgotPassword")
        .required()
        .messages({
            "any.required": "Type is required",
            "string.empty": "Type cannot be empty",
            "any.only": "Type is not valid"
        }),

    mode: Joi.string()
        .valid("Email", "Mobile")
        .required()
        .messages({
            "any.required": "Mode is required",
            "string.empty": "Mode cannot be empty",
            "any.only": "Mode is not valid"
        }),

    emailMobile: Joi.when("mode", {
        is: "Email",
        then: Joi.string()
            .email()
            .required()
            .messages({
                "any.required": "Email is required",
                "string.empty": "Email cannot be empty",
                "string.email": "Invalid email format",
            }),

        otherwise: Joi.string()
            .pattern(/^(\+27|27|0)[6-8][0-9]{8}$/)
            .required()
            .messages({
                "any.required": "Mobile number is required",
                "string.empty": "Mobile number cannot be empty",
                "string.base": "Mobile number must be a string",
                "string.pattern.base": "Enter a valid South African mobile number"
            })
    })
});


export { genarateEmailMobileOtpValidation, verifyOtpValidation, resendOtpValidatiion };