const Joi = require("joi");

const productModelCreateValidator = Joi.object({
    id: Joi.string().required(),
    category_id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    product_image: Joi.boolean().required(),
    created_at: Joi.number().required(),
    updated_at: Joi.number().required(),
});

const productModelUpdateValidator = Joi.object({
    id: Joi.string().required(),
    category_id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string(),
    product_image: Joi.boolean(),
    updated_at: Joi.number(),
});

module.exports = {
    productModelCreateValidator,
    productModelUpdateValidator,
};