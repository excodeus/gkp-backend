const Joi = require("joi");

const userRegisterValidator = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string(),
});

const userLoginValidator = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const userUpdateValidator = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string(),
});

const userUpdatePasswordValidator = Joi.object({
    password: Joi.string().required(),
    confirm_password: Joi.string().required(),
});

module.exports = {
    userRegisterValidator,
    userLoginValidator,
    userUpdateValidator,
    userUpdatePasswordValidator,
};