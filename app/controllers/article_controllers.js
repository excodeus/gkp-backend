const httpStatus = require('http-status');
const {
    getAllArticlesService,
    getArticleByIdService,
    createArticleService,
    updateArticleService,
    deleteArticleService,
    getAllArticlesClientService,
} = require('../services/article_services');
const { responseSuccess, responseError } = require('../utils/responses');
const {articlePostValidator, articleUpdateValidator} = require('../utils/validator/article_validator');

const getAllArticles = async (req, res) => {
    try {
        let {page, limit} = req.query;
        
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
        
        // should positive number
        +pageInt; +limitInt;

        const {articles, totalPages, totalData} = await getAllArticlesService(pageInt, limitInt);
        return responseSuccess(true, res, httpStatus.OK, "Success get all articles", articles, pageInt, limitInt, totalPages, totalData);
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const getArticleById = async (req, res) => {
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
        const validatedPayload = await articlePostValidator.validateAsync(payload);
        const articleId = await createArticleService(validatedPayload);

        return responseSuccess(false, res, httpStatus.CREATED, "Success create article", { articleId });
    } catch (error) {
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
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
        const validatedPayload = await articleUpdateValidator.validateAsync(payload);
        const articleId = await updateArticleService(validatedPayload);

        return responseSuccess(false, res, httpStatus.OK, "Success update article", { id: articleId });
    } catch (error) {
        if (error.message === "Article not found") {
            return responseError(res, httpStatus.NOT_FOUND, error.message);
        }
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
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

const getAllArticlesLandingPage = async (req, res) => {
    try {
        const {articles} = await getAllArticlesClientService();
        return responseSuccess(true, res, httpStatus.OK, "Success get all articles", articles);
    } catch (error) {
        if (error.message === "Page exceed data") {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

module.exports = {
    getAllArticles,
    getArticleById,
    postArticleAdmin,
    putArticleAdmin,
    deleteArticleAdmin,
    getAllArticlesLandingPage,
};
