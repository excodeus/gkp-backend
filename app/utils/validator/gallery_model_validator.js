const Joi = require("joi");

const galleryModelCreateValidator = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    gallery_image: Joi.string().required(),
    created_at: Joi.number().required(),
    updated_at: Joi.number().required(),
});

const galleryModelUpdateValidator = Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    gallery_image: Joi.string(),
    updated_at: Joi.number().required(),
});

module.exports = {
    galleryModelCreateValidator,
    galleryModelUpdateValidator,
};