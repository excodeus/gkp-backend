const httpStatus = require('http-status');
const {
    getAllCareerAdminService,
    postCareerAdminService,
} = require('../services/career_services');
const {responseSuccess, responseError} = require('../utils/responses');
const careerPostValidator = require('../utils/validator/career_validator');


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
        let pageInt = parseInt(page);
        let limitInt = parseInt(limit);

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
        let data, totalPage = await getAllCareerAdminService(pageInt, limitInt, status);

        return responseSuccess(true, res, httpStatus.OK, "success get all careers", data, pageInt, limitInt, totalPage);
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

const postCareerAdmin = async(req, res) => {
    try {
        // get body json
        const request = await careerPostValidator.validateAsync(req.body);

        // post data and get id
        const dataId = await postCareerAdminService(request);

        return responseSuccess(false, res, httpStatus.CREATED, "success create career", dataId);
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

module.exports = {
    getAllCareerAdmin,
    postCareerAdmin
};