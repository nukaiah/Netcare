import Joi from "joi";


const getByUserIdValidation = Joi.object({
    userId: Joi.string().required().messages({
        "any.required": "User id is required",
        "string.empty": "User id cannot be empty"
    })
});

export default getByUserIdValidation;