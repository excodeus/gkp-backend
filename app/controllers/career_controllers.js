const httpStatus = require('http-status');
const {
    getAllCareerAdminService,
} = require('../services/career_services');
const {responseSuccess, responseError} = require('../utils/responses');


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
        throw error;
    }
};

module.exports = {
    getAllCareerAdmin
};