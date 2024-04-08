const Joi = require("joi");

const userModelCreateValidator = Joi.object({
    id: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string(),
    created_at: Joi.number().required(),
    updated_at: Joi.number().required(),
});

const userModelUpdateValidator = Joi.object({
    id: Joi.string().required(),
    username: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string(),
    updated_at: Joi.number().required(),
});


module.exports = {
    userModelCreateValidator,
    userModelUpdateValidator,
};