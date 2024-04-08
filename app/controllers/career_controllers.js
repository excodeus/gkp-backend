const httpStatus = require('http-status');
const {
    getAllCareerAdminService,
    createCareerAdminService,
    getCareerByIdAdminService,
    putCareerByIdAdminService,
    deleteCareerAdminService,
} = require('../services/career_services');
const {responseSuccess, responseError} = require('../utils/responses');
const {careerPostValidator, careerUpdateValidator} = require('../utils/validator/career_validator');

const getAllCareerAdmin = async(req, res) => {
    try {
        // get query param
        const {page, limit} = req.query;
        const {status} = req.query || {};
        
        // validate required query
        if (page === undefined && limit === undefined) {
            return responseError(res, httpStatus.BAD_REQUEST, "page or limit not should mention");
        }

        // convert page and limit to int
        let pageInt = parseInt(page) || 1;
        let limitInt = parseInt(limit) || 10;

        // validate limit page status
        if (isNaN(pageInt) || isNaN(limitInt)) {
            return responseError(res, httpStatus.BAD_REQUEST, "page or limit not a number");
        }
        if (status !== "open" && status !== "closed" && status !== undefined) {
            return responseError(res, httpStatus.BAD_REQUEST, "status should [open, closed, all]");
        }
        
        // should positive number
        +pageInt; +limitInt;

        // get data and total page
        const {data, totalPages} = await getAllCareerAdminService(pageInt, limitInt, status);

        return responseSuccess(true, res, httpStatus.OK, "success get all careers", data, pageInt, limitInt, totalPages);
    } catch (error) {
        if (error.message === "Page exceed data") {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

const postCareerAdmin = async(req, res) => {
    try {
        // get body json
        const request = await careerPostValidator.validateAsync(req.body);

        // post data and get id
        const dataId = await createCareerAdminService(request);

        return responseSuccess(false, res, httpStatus.CREATED, "success create career", dataId);
    } catch (error) {
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

const getDetailCareerAdmin = async(req, res) => {
    try {
        // get params
        const { id } = req.params;

        // get data by id
        const data = await getCareerByIdAdminService(id);

        return responseSuccess(true, res, httpStatus.OK, "success get career by id", data);
    } catch (error) {
        if (error.message === "id not found") {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

const putCareerAdmin = async(req, res) => {
    try {
        // get params
        const { id } = req.params;

        // get body json
        const request = await careerUpdateValidator.validateAsync(req.body);

        // post data and get id
        const dataId = await putCareerByIdAdminService(request, id);

        return responseSuccess(false, res, httpStatus.OK, "success update career", dataId);
    } catch (error) {
        if (error.message === "id not found" || error.message === "History not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

const deleteCareerAdmin = async(req, res) => {
    try {
        // get params
        const { id } = req.params;

        // delete data get id
        const data = await deleteCareerAdminService(id);

        return responseSuccess(true, res, httpStatus.OK, "success delete career by id", data);
    } catch (error) {
        if (error.message === "id not found" || error.message === "History not found") {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

module.exports = {
    getAllCareerAdmin,
    postCareerAdmin,
    getDetailCareerAdmin,
    putCareerAdmin,
    deleteCareerAdmin,
};