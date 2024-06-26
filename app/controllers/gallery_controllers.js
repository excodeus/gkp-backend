const httpStatus = require('http-status');
const {
    getAllGalleriesService,
    getAllGalleriesServiceClient,
    getGalleryByIdService,
    createGalleryService,
    updateGalleryService,
    deleteGalleryService
} = require('../services/gallery_services');
const { responseSuccess, responseError } = require('../utils/responses');
const {galleryPostValidator, galleryUpdateValidator} = require('../utils/validator/gallery_validator');

const getAllGalleriesAdmin = async (req, res) => {
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

        const {galleries, totalPages, totalData} = await getAllGalleriesService(pageInt, limitInt);
        return responseSuccess(true, res, httpStatus.OK, "Success get all galleries", galleries, pageInt, limitInt, totalPages, totalData);
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const getAllGalleriesClient = async (req, res) => {
    try {
        const galleries = await getAllGalleriesServiceClient();
        return responseSuccess(true, res, httpStatus.OK, "Success get all gallery", galleries);
    } catch (error) {
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const getGalleryById = async (req, res) => {
    try {
        const { id } = req.params;
        const gallery = await getGalleryByIdService(id);
        return responseSuccess(true, res, httpStatus.OK, "Success get gallery by ID", gallery);
    } catch (error) {
        if (error.message === "Gallery not found") {
            return responseError(res, httpStatus.NOT_FOUND, "Gallery not found");
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const postGalleryAdmin = async (req, res) => {
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

        const payload = { ...body, gallery_image: file.filename };
        const validatedPayload = await galleryPostValidator.validateAsync(payload);
        const galleryId = await createGalleryService(validatedPayload);

        return responseSuccess(false, res, httpStatus.CREATED, "Success create gallery", { galleryId });
    } catch (error) {
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    }
};

const putGalleryAdmin = async (req, res) => {
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
        const payload = { ...body, gallery_image: file.filename };
        const validatedPayload = await galleryUpdateValidator.validateAsync(payload);
        const galleryId = await updateGalleryService(validatedPayload);

        return responseSuccess(false, res, httpStatus.OK, "Success update gallery", { id: galleryId });
    } catch (error) {
        if (error.message.includes('ER_DUP_ENTRY')) {
            return responseError(res, httpStatus.BAD_REQUEST, error.message);
        }
        switch (error.message) {
            case "Gallery not found":
            case "History not found":
                return responseError(res, httpStatus.NOT_FOUND, error.message);
            default:
                return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
};

const deleteGalleryAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteGalleryService(id);
        return responseSuccess(false, res, httpStatus.OK, "Success delete gallery", { id });
    } catch (error) {
        switch (error.message) {
            case "Gallery not found":
            case "History not found":
                return responseError(res, httpStatus.NOT_FOUND, error.message);
            default:
                return responseError(res, httpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        }
    }
};

module.exports = {
    getAllGalleriesAdmin,
    getAllGalleriesClient,
    getGalleryById,
    postGalleryAdmin,
    putGalleryAdmin,
    deleteGalleryAdmin
};
