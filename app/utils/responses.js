// response success json
const responseSuccess = (isGetAll, response, statusCode, message = '', data = undefined, page, limit, totalPage, totalData) => {
    const responseData = {
        error: false,
        message: message,
        data: data,
    };
    if (isGetAll) {
        responseData['totalPage'] = totalPage;
        responseData['totalData'] = totalData;
        responseData['currentPage'] = page;
        responseData['limitPage'] = limit;
    }
    return response.status(statusCode).json(responseData);
}

// response Error json
const responseError = (response, statusCode, message) => {
    const responseData = {
        error: true,
        message: message,
    };
    return response.status(statusCode).json(responseData);
}

module.exports = {responseSuccess, responseError};