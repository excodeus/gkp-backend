const httpStatus = require('http-status');
const {
    getAllCategoryAdminService,
    postCategoryAdminService,
    putCategoryByIdAdminService,
    deleteCategoryAdminService,
} = require('../services/category_services');
const {responseSuccess, responseError} = require('../utils/responses');
const {categoryPostValidator, categoryUpdateValidator} = require('../utils/validator/category_validator');

const getAllCategoryAdmin = async(req, res) => {
    try {
        // get all data 
        const {data} = await getAllCategoryAdminService();
        
        return responseSuccess(true, res, httpStatus.OK, "success get all categories", data);
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

const postCategoryAdmin = async(req, res) => {
    try {
        // get body json
        const request = await categoryPostValidator.validateAsync(req.body);

        // post data and get id
        const dataId = await postCategoryAdminService(request);

        return responseSuccess(false, res, httpStatus.CREATED, "success create category", dataId);
    } catch (error) {
        // duplicate name
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

const putCategoryAdmin = async(req, res) => {
    try {
        // get params
        const { id } = req.params;

        // get body json
        const request = await categoryUpdateValidator.validateAsync(req.body);

        // post data and get id
        const dataId = await putCategoryByIdAdminService(request, id);

        return responseSuccess(false, res, httpStatus.OK, "success update category", {id: dataId});
    } catch (error) {
        if (error.message === "id not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

const deleteCategoryAdmin = async(req, res) => {
    try {
        // get params
        const { id } = req.params;

        // delete data get id
        const data = await deleteCategoryAdminService(id);

        return responseSuccess(true, res, httpStatus.OK, "success delete category by id", data);
    } catch (error) {
        if (error.message === "id not found") {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

module.exports = {
    getAllCategoryAdmin,
    postCategoryAdmin,
    putCategoryAdmin,
    deleteCategoryAdmin,
};