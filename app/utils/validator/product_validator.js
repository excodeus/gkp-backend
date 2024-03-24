const Joi = require("joi");

const productPostValidator = Joi.object({
    category_id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    product_image: Joi.boolean().required(),
});

const productUpdateValidator = Joi.object({
    category_id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string(),
    product_image: Joi.boolean(),
});

module.exports = {
    productPostValidator,
    productUpdateValidator
};