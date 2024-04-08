const express = require('express');
const {
    getAllGalleriesAdmin,
    getGalleryByIdAdmin,
    postGalleryAdmin,
    putGalleryAdmin,
    deleteGalleryAdmin
} = require('../controllers/gallery_controllers');
const {
    authenticateToken,
} = require('../middlewares/authentication');
const upload = require('../middlewares/image_filter_middleware');

const galleryAdminFuncRouter = () => {
    const galleryRoutes = express.Router();

    // gallery administrator endpoint
    galleryRoutes.get("/", authenticateToken, getAllGalleriesAdmin);
    galleryRoutes.post("/", authenticateToken, upload.single('gallery_image'), postGalleryAdmin);
    galleryRoutes.get("/:id", authenticateToken, getGalleryByIdAdmin);
    galleryRoutes.put("/:id", authenticateToken, upload.single('gallery_image'), putGalleryAdmin);
    galleryRoutes.delete("/:id", authenticateToken, deleteGalleryAdmin);

    return galleryRoutes;
};

module.exports = galleryAdminFuncRouter;