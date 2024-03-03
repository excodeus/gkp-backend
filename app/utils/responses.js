// response success json
const responseSuccess = (isGet, response, statusCode, message = '', data = [], page, limit, totalPage) => {
    const responseData = {
        error: false,
        message: message,
        data: data,
    };
    if (isGet) {
        responseData['totalPage'] = totalPage;
        responseData['currentPage'] = page;
        responseData['limit'] = limit;
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