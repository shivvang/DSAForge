import Joi from "joi";

// Registration validation
export const validateRegisteration = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                "string.base": `"username" should be a type of 'text'`,
                "string.empty": `"username" cannot be an empty field`,
                "string.min": `"username" should have a minimum length of {#limit}`,
                "string.max": `"username" should have a maximum length of {#limit}`,
                "any.required": `"username" is a required field`,
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.base": `"email" should be a type of 'text'`,
                "string.empty": `"email" cannot be an empty field`,
                "string.email": `"email" must be a valid email format`,
                "any.required": `"email" is a required field`,
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.base": `"password" should be a type of 'text'`,
                "string.empty": `"password" cannot be an empty field`,
                "string.min": `"password" should have a minimum length of {#limit}`,
                "any.required": `"password" is a required field`,
            }),
    });

    return schema.validate(data);
};

// Login validation
export const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.base": `"email" should be a type of 'text'`,
                "string.empty": `"email" cannot be an empty field`,
                "string.email": `"email" must be a valid email format`,
                "any.required": `"email" is a required field`,
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.base": `"password" should be a type of 'text'`,
                "string.empty": `"password" cannot be an empty field`,
                "string.min": `"password" should have a minimum length of {#limit}`,
                "any.required": `"password" is a required field`,
            }),
    });

    return schema.validate(data);
};

// Renew password validation
export const validateRenewPass = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.base": `"email" should be a type of 'text'`,
                "string.empty": `"email" cannot be an empty field`,
                "string.email": `"email" must be a valid email format`,
                "any.required": `"email" is a required field`,
            }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.base": `"password" should be a type of 'text'`,
                "string.empty": `"password" cannot be an empty field`,
                "string.min": `"password" should have a minimum length of {#limit}`,
                "any.required": `"password" is a required field`,
            }),
        newPassword: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.base": `"newPassword" should be a type of 'text'`,
                "string.empty": `"newPassword" cannot be an empty field`,
                "string.min": `"newPassword" should have a minimum length of {#limit}`,
                "any.required": `"newPassword" is a required field`,
            }),
    });

    return schema.validate(data);
};
