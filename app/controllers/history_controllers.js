const httpStatus = require('http-status');
const {
    getAllHistoryService,
    getHistoryByIdService,
} = require('../services/history_service');
const {responseSuccess, responseError} = require('../utils/responses');

const getAllHistory = async(req, res) => {
    try {
        const {histories} = await getAllHistoryService();

        return responseSuccess(true, res, httpStatus.OK, "success get all history", histories);
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

const getDetailHistory = async(req, res) => {
    try {
        // get params
        const { id } = req.params;

        // get data by id
        const history = await getHistoryByIdService(id);

        return responseSuccess(true, res, httpStatus.OK, "success get history by id", history);
    } catch (error) {
        if (error.message === "History not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "internal server error");
    }
};

module.exports = {
    getAllHistory,
    getDetailHistory,
};