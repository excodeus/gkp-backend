const Joi = require("joi");

const categoryPostValidator = Joi.object({
    name: Joi.string().required(),
});

const categoryUpdateValidator = Joi.object({
    name: Joi.string().required(),
});

module.exports = {
    categoryPostValidator,
    categoryUpdateValidator
};