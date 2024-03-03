const Joi = require("joi");

const careerPostValidator = Joi.object({
    name: Joi.string().required(),
    position: Joi.string().required(),
    description: Joi.string().required(),
});

module.exports = careerPostValidator;