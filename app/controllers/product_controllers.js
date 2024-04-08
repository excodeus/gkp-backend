const httpStatus = require('http-status');
const {
    getAllProductsService,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService
} = require('../services/product_services');
const { responseSuccess, responseError } = require('../utils/responses');
const {productPostValidator, productUpdateValidator} = require('../utils/validator/product_validator');

const getAllProductsAdmin = async (req, res) => {
    try {
        const {page, limit} = req.query;
        
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
        
        // should positive number
        +pageInt; +limitInt;

        const {products, totalPages} = await getAllProductsService(pageInt, limitInt);
        return responseSuccess(true, res, httpStatus.OK, "Success get all products", products, pageInt, limitInt, totalPages);
    } catch (error) {
        if (error.message === "Page exceed data") {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const getProductByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductByIdService(id);
        return responseSuccess(true, res, httpStatus.OK, "Success get product by ID", product);
    } catch (error) {
        if (error.message === "Product not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const postProductAdmin = async (req, res) => {
    try {
        const { body, file, fileValidationError } = req;

        if (fileValidationError) {
            return responseError(res, httpStatus.BAD_REQUEST, fileValidationError.message);
        }

        if (!file) {
            return responseError(res, httpStatus.BAD_REQUEST, "please input image or file");
        }
        if (file.size > 5 * 1024 * 1024) {
            return responseError(res, httpStatus.BAD_REQUEST, 'File size limit exceeded. Max file size allowed is 5MB');
        }

        const payload = { ...body, product_image: file.filename };
        const validatedPayload = await productPostValidator.validateAsync(payload);
        const productId = await createProductService(validatedPayload);

        return responseSuccess(false, res, httpStatus.CREATED, "Success create product", { productId });
    } catch (error) {
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const putProductAdmin = async (req, res) => {
    try {
        const { params, body, file, fileValidationError } = req;
        const { id } = params;

        if (fileValidationError) {
            return responseError(res, httpStatus.BAD_REQUEST, fileValidationError.message);
        }

        if (!file) {
            return responseError(res, httpStatus.BAD_REQUEST, "please input image or file");
        }
        if (file.size > 5 * 1024 * 1024) {
            return responseError(res, httpStatus.BAD_REQUEST, 'File size limit exceeded. Max file size allowed is 5MB');
        }

        body.id = id;
        const payload = { ...body, product_image: file.filename };
        const validatedPayload = await productUpdateValidator.validateAsync(payload);
        const productId = await updateProductService(validatedPayload);

        return responseSuccess(false, res, httpStatus.OK, "Success update product", { id: productId });
    } catch (error) {
        if (error.message === "Product not found" || error.message === "Category ID not found" || error.message === "History not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const deleteProductAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteProductService(id);
        return responseSuccess(false, res, httpStatus.OK, "Success delete product", { id });
    } catch (error) {
        if (error.message === "Product not found" || error.message === "History not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

module.exports = {
    getAllProductsAdmin,
    getProductByIdAdmin,
    postProductAdmin,
    putProductAdmin,
    deleteProductAdmin
};
