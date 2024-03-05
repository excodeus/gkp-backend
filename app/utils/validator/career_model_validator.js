const Joi = require("joi");

const careerModelCreateValidator = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    position: Joi.string().required(),
    status: Joi.boolean().required(),
    description: Joi.string().required(),
    created_at: Joi.number().required(),
    updated_at: Joi.number().required(),
});

const careerModelUpdateValidator = Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    position: Joi.string(),
    status: Joi.boolean(),
    description: Joi.string(),
    updated_at: Joi.number().required(),
});

module.exports = {
    careerModelCreateValidator,
    careerModelUpdateValidator,
};