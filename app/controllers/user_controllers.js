const httpStatus = require("http-status");
const {
    registerUserAdminService,
    loginUserAdminService,
    logoutUserAdminService,
    putUserByIdAdminService,
    deleteUserAdminService,
} = require('../services/user_services');
const { responseSuccess, responseError } = require('../utils/responses');
const {
    userRegisterValidator,
    userLoginValidator,
    userUpdateValidator,
    // userUpdatePasswordValidator,
} = require('../utils/validator/user_validator');

// register user func
const registerUser = async (req, res) => {
    try {
        const validatedPayload = await userRegisterValidator.validateAsync(req.body);

        const user = await registerUserAdminService(validatedPayload);
        
        return responseSuccess(false, res, httpStatus.CREATED, "Success register user", { user_id: user.id });
    } catch (error) {
        if (error.message === "User already exist" || error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
}

// login user func
const loginUser = async (req, res) => {
    try {
        const validatedPayload = await userLoginValidator.validateAsync(req.body);
        const token = await loginUserAdminService(validatedPayload);
        
        return responseSuccess(false, res, httpStatus.OK, "Success login user", { token });
    } catch (error) {
        if (error.message === "User not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        if (error.message === "Wrong username or password") {
            return responseError(res, httpStatus.UNAUTHORIZED, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
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

const updateUserAdmin = async(req, res) => {
    try {
        const validatedPayload = await userUpdateValidator.validateAsync(req.body);
        const { id } = req.params;

        const userId = await putUserByIdAdminService(validatedPayload, id);
        
        return responseSuccess(false, res, httpStatus.OK, "Success update user", { user_id: userId });
    } catch (error) {
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const deleteUserAdmin = async(req, res) => {
    try {
        const { id } = req.params;

        const userId = await deleteUserAdminService(id);
        
        return responseSuccess(false, res, httpStatus.OK, "Success delete user", { user_id: userId });
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

module.exports = {
    registerUser,
    loginUser,
    refreshUserToken,
    logoutUser,
    updateUserAdmin,
    deleteUserAdmin,
};
