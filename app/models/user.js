const {
    userModelCreateValidator,
    userModelUpdateValidator,
} = require('../utils/validator/user_model_validator');

const userModel = (payload, isCreate) => {
    let error; let value;
    
    // validate
    if (isCreate) {
        // create
        error, value = userModelCreateValidator.validate(payload);
    } else {
        // update
        error, value = userModelUpdateValidator.validate(payload);
    }
    // return payload
    return value;
};

module.exports = userModel;