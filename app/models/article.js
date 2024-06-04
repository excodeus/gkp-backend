const {
    articleModelCreateValidator,
    articleModelUpdateValidator,
} = require('../utils/validator/article_model_validator.js');

const articleModel = (payload, isCreate) => {
    let error; let value;
    
    // validate
    if (isCreate) {
        // create
        error, value = articleModelCreateValidator.validate(payload);
    } else {
        // update
        error, value = articleModelUpdateValidator.validate(payload);
    }
    // return payload
    return value;
};

module.exports = articleModel;