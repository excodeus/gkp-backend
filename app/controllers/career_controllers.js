const httpStatus = require('http-status');
const {
    getAllCareerAdminService,
    createCareerAdminService,
    getCareerByIdService,
    putCareerByIdAdminService,
    deleteCareerAdminService,
    getAllCareerClientService,
} = require('../services/career_services');
const {responseSuccess, responseError} = require('../utils/responses');
const {careerPostValidator, careerUpdateValidator} = require('../utils/validator/career_validator');

const getAllCareerAdmin = async(req, res) => {
    try {
        // get query param
        let {page, limit} = req.query;
        const {status} = req.query || {};
        
        // validate required query
        if (page === undefined && limit === undefined) {
            // default value
            page = 1;
            limit = 10;
        }

        // convert page and limit to int
        let pageInt = parseInt(page) || 1;
        let limitInt = parseInt(limit) || 10;

        // validate limit page status
        if (isNaN(pageInt) || isNaN(limitInt)) {
            // default value
            pageInt = 1;
            limitInt = 10;
        }
        
        switch (status) {
            case "open":
                break
            case "closed":
                break
            case undefined:
                break
            default:
                return responseError(res, httpStatus.BAD_REQUEST, "optional query status [open, closed]");
        }
        
        // should positive number
        +pageInt; +limitInt;

        // get data and total page
        const {data, totalPages, totalData} = await getAllCareerAdminService(pageInt, limitInt, status);

        return responseSuccess(true, res, httpStatus.OK, "success get all careers", data, pageInt, limitInt, totalPages, totalData);
    } catch (error) {
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

const getDetailCareer = async(req, res) => {
    try {
        // get params
        const { id } = req.params;

        // get data by id
        const data = await getCareerByIdService(id);

        return responseSuccess(true, res, httpStatus.OK, "success get career by id", data);
    } catch (error) {
        switch (error.message) {
            case "id not found":
                return responseError(res, httpStatus.NOT_FOUND, error.message);
            default:
                return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
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
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        switch (error.message) {
            case "id not found":
            case "History not found":
                return responseError(res, httpStatus.NOT_FOUND, error.message);
            default:
                return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
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
        switch (error.message) {
            case "id not found":
            case "History not found":
                return responseError(res, httpStatus.NOT_FOUND, error.message);
            default:
                return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
};

const getAllCareerClient = async(req, res) => {
    try {
        // get data
        const {data} = await getAllCareerClientService();

        return responseSuccess(true, res, httpStatus.OK, "success get all careers", data);
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};


module.exports = {
    getAllCareerAdmin,
    postCareerAdmin,
    getDetailCareer,
    putCareerAdmin,
    deleteCareerAdmin,
    getAllCareerClient,
};