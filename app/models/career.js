const careerModelValidator = require('../utils/validator/career_model_validator.js');

const careerModel = (payload) => {
    // validate
    const { error, value } = careerModelValidator.validate(payload);
    // return payload
    return value;
};

module.exports = careerModel;