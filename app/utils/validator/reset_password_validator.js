const Joi = require('joi');

const checkEmail = Joi.object({
  email: Joi.string().email().required(),
});

const sendOTP = Joi.object({
  email: Joi.string().email().required(),
  user_id: Joi.string().required(),
  username: Joi.string().required(),
});

const resetPassword = Joi.object({
  email: Joi.string().email().required(),
  user_id: Joi.string().required(),
  password: Joi.string().required(),
  password_confirm: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'password does not match',
  }),
  otp: Joi.string().length(6).required(),
});

module.exports = {
  checkEmail,
  sendOTP,
  resetPassword,
};
