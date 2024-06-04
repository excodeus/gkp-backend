const Joi = require("joi");

const productModelCreateValidator = Joi.object({
    id: Joi.string().required(),
    category_id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    product_image: Joi.string().required(),
    created_at: Joi.number().required(),
    updated_at: Joi.number().required(),
});

const productModelUpdateValidator = Joi.object({
    id: Joi.string().required(),
    category_id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string(),
    product_image: Joi.string(),
    updated_at: Joi.number().required(),
});

module.exports = {
    productModelCreateValidator,
    productModelUpdateValidator,
};