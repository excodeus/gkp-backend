const httpStatus = require("http-status");
const {
    putUserByIdAdminService,
    deleteUserAdminService,
} = require('../services/user_services');
const { responseSuccess, responseError } = require('../utils/responses');
const {
    userUpdateValidator,
} = require('../utils/validator/user_validator');

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
    updateUserAdmin,
    deleteUserAdmin,
};
