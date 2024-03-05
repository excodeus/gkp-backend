const {
    careerModelCreateValidator,
    careerModelUpdateValidator,
} = require('../utils/validator/career_model_validator.js');

const careerModel = (payload, isCreate) => {
    let error; let value;
    
    // validate
    if (isCreate) {
        // create
        error, value = careerModelCreateValidator.validate(payload);
    } else {
        // update
        error, value = careerModelUpdateValidator.validate(payload);
    }
    // return payload
    return value;
};

module.exports = careerModel;