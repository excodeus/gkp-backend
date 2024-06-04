const Joi = require("joi");

const galleryPostValidator = Joi.object({
    name: Joi.string().required(),
    gallery_image: Joi.string().required(),
});

const galleryUpdateValidator = Joi.object({
    name: Joi.string(),
    gallery_image: Joi.string(),
});

module.exports = {
    galleryPostValidator,
    galleryUpdateValidator
};