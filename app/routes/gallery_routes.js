const express = require('express');
const {
    getAllGalleriesAdmin,
    getGalleryByIdAdmin,
    postGalleryAdmin,
    putGalleryAdmin,
    deleteGalleryAdmin
} = require('../controllers/gallery_controllers');
const upload = require('../middlewares/image_filter_middleware');

const galleryAdminFuncRouter = () => {
    const galleryRoutes = express.Router();

    // gallery administrator endpoint
    galleryRoutes.get("/", getAllGalleriesAdmin);
    galleryRoutes.post("/", upload.single('gallery_image'), postGalleryAdmin);
    galleryRoutes.get("/:id", getGalleryByIdAdmin);
    galleryRoutes.put("/:id", upload.single('gallery_image'), putGalleryAdmin);
    galleryRoutes.delete("/:id", deleteGalleryAdmin);

    return galleryRoutes;
};

module.exports = galleryAdminFuncRouter;