const Joi = require("joi");

const articleModelCreateValidator = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    author: Joi.string().required(),
    content: Joi.string().required(),
    article_image: Joi.string().required(),
    created_at: Joi.number().required(),
    updated_at: Joi.number().required(),
});

const articleModelUpdateValidator = Joi.object({
    id: Joi.string().required(),
    title: Joi.string(),
    author: Joi.string(),
    content: Joi.string(),
    article_image: Joi.string(),
    updated_at: Joi.number(),
});

module.exports = {
    articleModelCreateValidator,
    articleModelUpdateValidator,
};