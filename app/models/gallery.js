const {
    galleryModelCreateValidator,
    galleryModelUpdateValidator,
} = require('../utils/validator/gallery_model_validator.js');

const galleryModel = (payload, isCreate) => {
    let error; let value;
    
    // validate
    if (isCreate) {
        // create
        error, value = galleryModelCreateValidator.validate(payload);
    } else {
        // update
        error, value = galleryModelUpdateValidator.validate(payload);
    }
    // return payload
    return value;
};

module.exports = galleryModel;