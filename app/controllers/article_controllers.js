const httpStatus = require('http-status');
const {
    getAllArticlesService,
    getArticleByIdService,
    createArticleService,
    updateArticleService,
    deleteArticleService
} = require('../services/article_services');
const { responseSuccess, responseError } = require('../utils/responses');

const getAllArticlesAdmin = async (req, res) => {
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

        const {articles, totalPages} = await getAllArticlesService(pageInt, limitInt);
        return responseSuccess(true, res, httpStatus.OK, "Success get all articles", articles, pageInt, limitInt, totalPages);
    } catch (error) {
        if (error.message === "Page exceed data") {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const getArticleByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await getArticleByIdService(id);
        return responseSuccess(true, res, httpStatus.OK, "Success get article by ID", article);
    } catch (error) {
        if (error.message === "Article not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const postArticleAdmin = async (req, res) => {
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

        const payload = { ...body, article_image: file.filename };
        const articleId = await createArticleService(payload);

        return responseSuccess(false, res, httpStatus.CREATED, "Success create article", { articleId });
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const putArticleAdmin = async (req, res) => {
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
        const payload = { ...body, article_image: file.filename };
        const articleId = await updateArticleService(payload);

        return responseSuccess(false, res, httpStatus.OK, "Success update article", { id: articleId });
    } catch (error) {
        if (error.message === "Article not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const deleteArticleAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteArticleService(id);
        return responseSuccess(false, res, httpStatus.OK, "Success delete article", { id });
    } catch (error) {
        if (error.message === "Article not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

module.exports = {
    getAllArticlesAdmin,
    getArticleByIdAdmin,
    postArticleAdmin,
    putArticleAdmin,
    deleteArticleAdmin
};
