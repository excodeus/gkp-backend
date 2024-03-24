const {
    productModelCreateValidator,
    productModelUpdateValidator,
} = require('../utils/validator/product_model_validator.js');

const productModel = (payload, isCreate) => {
    let error; let value;
    
    // validate
    if (isCreate) {
        // create
        error, value = productModelCreateValidator.validate(payload);
    } else {
        // update
        error, value = productModelUpdateValidator.validate(payload);
    }
    // return payload
    return value;
};

module.exports = productModel;