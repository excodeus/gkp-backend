const {
    categoryModelCreateValidator,
    categoryModelUpdateValidator,
} = require('../utils/validator/category_model_validator.js');

const categoryModel = (payload, isCreate) => {
    let error; let value;
    
    // validate
    if (isCreate) {
        // create
        error, value = categoryModelCreateValidator.validate(payload);
    } else {
        // update
        error, value = categoryModelUpdateValidator.validate(payload);
    }
    // return payload
    return value;
};

module.exports = categoryModel;