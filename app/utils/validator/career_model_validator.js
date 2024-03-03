const Joi = require("joi");

const careerModelValidator = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    position: Joi.string().required(),
    status: Joi.boolean().required(),
    description: Joi.string().required(),
    created_at: Joi.number().required(),
    updated_at: Joi.number().required(),
});

module.exports = careerModelValidator;