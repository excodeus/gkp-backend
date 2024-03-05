const Joi = require("joi");

const careerPostValidator = Joi.object({
    name: Joi.string().required(),
    position: Joi.string().required(),
    description: Joi.string().required(),
});

const careerUpdateValidator = Joi.object({
    name: Joi.string(),
    position: Joi.string(),
    status: Joi.boolean(),
    description: Joi.string(),
});

module.exports = {
    careerPostValidator,
    careerUpdateValidator
};