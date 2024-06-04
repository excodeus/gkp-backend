const Joi = require("joi");

const categoryModelCreateValidator = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    created_at: Joi.number().required(),
    updated_at: Joi.number().required(),
});

const categoryModelUpdateValidator = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    updated_at: Joi.number().required(),
});

module.exports = {
    categoryModelCreateValidator,
    categoryModelUpdateValidator,
};