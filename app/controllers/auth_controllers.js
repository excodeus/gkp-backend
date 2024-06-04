const httpStatus = require("http-status");
const {
    registerUserAdminService,
    loginUserAdminService,
    logoutUserAdminService,
} = require('../services/user_services');
const {
    sendOTPService,
    checkUserEmailService,
    updatePasswordService,
} = require('../services/reset_password_services');
const { responseSuccess, responseError } = require('../utils/responses');
const {
    userRegisterValidator,
    userLoginValidator,
} = require('../utils/validator/user_validator');
const { checkEmail, sendOTP, resetPassword } = require("../utils/validator/reset_password_validator");

// register user func
const registerUser = async (req, res) => {
    try {
        const validatedPayload = await userRegisterValidator.validateAsync(req.body);

        const user = await registerUserAdminService(validatedPayload);
        
        return responseSuccess(false, res, httpStatus.CREATED, "Success register user", { user_id: user.id });
    } catch (error) {
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        switch (error.message) {
            case "User already exist":
                return responseError(res, httpStatus.BAD_REQUEST, error.message);
            default:
                return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
}

// login user func
const loginUser = async (req, res) => {
    try {
        const validatedPayload = await userLoginValidator.validateAsync(req.body);
        const token = await loginUserAdminService(validatedPayload);
        
        return responseSuccess(false, res, httpStatus.OK, "Success login user", { token });
    } catch (error) {
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        switch (error.message) {
            case "Wrong username or password":
                return responseError(res, httpStatus.BAD_REQUEST, error.message);
            case "User not found":
                return responseError(res, httpStatus.NOT_FOUND, error.message);
            default:
                return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
}

// logout func
const logoutUser = async (req, res) => {
    try {
        // authorization
        const { authUser } = req;
        if (!authUser) return responseError(res, httpStatus.UNAUTHORIZED, 'Unathorized: token not valid');

        const userId = await logoutUserAdminService(authUser);

        return responseSuccess(false, res, httpStatus.OK, "Success logout user", { user_id: userId});
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
}

// refresh token func
const refreshUserToken = async (req, res) => {
    try {
        const { authRefreshUser } = req;
        
        return responseSuccess(false, res, httpStatus.OK, 'Success generate new token user!', { token: authRefreshUser });
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
}

const getUserByEmail = async (req, res) => {
    try {
        const validatedPayload = await checkEmail.validateAsync(req.body);
        const users = await checkUserEmailService(validatedPayload);
        return responseSuccess(true, res, httpStatus.OK, "Success check users", users);
    } catch (error) {
        if (error.message.includes("email")){
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        switch (error.message) {
            case "User not registered yet":
                return responseError(res, httpStatus.NOT_FOUND, error.message);
            default:
                return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
};

const postOTPUser = async (req, res) => {
    try {
        const validatedPayload = await sendOTP.validateAsync(req.body);
        const users = await sendOTPService(validatedPayload);
        return responseSuccess(true, res, httpStatus.OK, "Success check users");
    } catch (error) {
        switch (error.message) {
            case "Reset password not found":
                return responseError(res, httpStatus.NOT_FOUND, error.message);
            default:
                return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
};

const updateUserPassword = async (req, res) => {
    try {
        const validatedPayload = await resetPassword.validateAsync(req.body);
        await updatePasswordService(validatedPayload);
        return responseSuccess(false, res, httpStatus.OK, "Success update user");
    } catch (error) {
        switch (error.message) {
            case "OTP has expired":
                return responseError(res, httpStatus.GONE, error.message);
            case "User not found":
                return responseError(res, httpStatus.NOT_FOUND, error.message);
            case "password does not match":
            case `"otp" length must be 6 characters long`:
                return responseError(res, httpStatus.BAD_REQUEST, error.message);
            default:
                return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
}

module.exports = {
    registerUser,
    loginUser,
    refreshUserToken,
    logoutUser,
    getUserByEmail,
    postOTPUser,
    updateUserPassword,
};
