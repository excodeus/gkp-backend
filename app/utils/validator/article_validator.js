const Joi = require("joi");

const articlePostValidator = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    content: Joi.string().required(),
    article_image: Joi.string().required(),
});

const articleUpdateValidator = Joi.object({
    title: Joi.string(),
    author: Joi.string(),
    content: Joi.string(),
    article_image: Joi.string(),
});

module.exports = {
    articlePostValidator,
    articleUpdateValidator
};