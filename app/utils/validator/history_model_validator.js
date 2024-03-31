const Joi = require("joi");

const historyModelCreateValidator = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    image_url: Joi.string().required(),
    route_path: Joi.string().required(),
    cpg_id: Joi.string().required(),
    created_at: Joi.number().required(),
    updated_at: Joi.number().required(),
});

const historyModelUpdateValidator = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    image_url: Joi.string(),
    route_path: Joi.string(),
    updated_at: Joi.number().required(),
});

module.exports = {
    historyModelCreateValidator,
    historyModelUpdateValidator,
};