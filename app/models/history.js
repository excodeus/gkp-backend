const {
    historyModelCreateValidator,
    historyModelUpdateValidator,
} = require('../utils/validator/history_model_validator');

const historyModel = (payload, isCreate) => {
    let error; let value;
    
    // validate
    if (isCreate) {
        // create
        error, value = historyModelCreateValidator.validate(payload);
    } else {
        // update
        error, value = historyModelUpdateValidator.validate(payload);
    }
    // return payload
    return value;
};

module.exports = historyModel;