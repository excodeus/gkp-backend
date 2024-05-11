const express = require('express');
const {
    getAllGalleriesClient,
    getGalleryById,
} = require('../../controllers/gallery_controllers');

const galleryClientFuncRouter = () => {
    const galleryRoutes = express.Router();

    // gallery client endpoint
    galleryRoutes.get("/", getAllGalleriesClient);
    galleryRoutes.get("/:id", getGalleryById);

    return galleryRoutes;
};

module.exports = galleryClientFuncRouter;