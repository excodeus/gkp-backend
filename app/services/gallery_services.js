const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const {
    getCountGalleryPages,
    getAllGalleries,
    getAllGalleriesClient,
    getGalleryById,
    createGallery,
    updateGallery,
    deleteGallery
} = require('../repositories/gallery_repository');
const { 
    createHistory,
    updateHistory,
    deleteHistory
} = require('../repositories/history_repository');
const paginateConverter = require('../utils/paginate_converter');
const galleryModel = require('../models/gallery');
const historyModel = require('../models/history');

require('dotenv').config()

const mode_app = process.env.MODE;
const prodHost = process.env.HOST;
const gallery_url = process.env.GALLERY_URL;
const port = process.env.APP_PORT;

const ROOT_DIR = path.resolve(__dirname, '../..');
const uploadDirectory = path.join(ROOT_DIR, `/storage/uploads/${gallery_url}`);

// Membuat folder upload jika belum ada
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const currentMillis = Date.now();

const getAllGalleriesService = async (page, limit) => {
    try {
        // count total pages
        const rawPage = await getCountGalleryPages();
        
        // converter pagination
        const {offset, totalPages} = paginateConverter(page, limit, rawPage);
        if (page > totalPages) {
            throw new Error("Page exceed data");
        }
        const galleries = await getAllGalleries(limit, offset);

        return { galleries, totalPages };
    } catch (error) {
        throw error;
    }
};

const getGalleryByIdService = async (galleryId) => {
    try {
        const gallery = await getGalleryById(galleryId);
        if (gallery === undefined) {
            throw new Error("Gallery not found");
        }
        return gallery;
    } catch (error) {
        throw error;
    }
};

const createGalleryService = async (payload) => {
    try {
        const filename = payload.gallery_image;
        const filepath = mode_app === "PROD" ? prodHost : `http://localhost:${port}/v1`;
        // add more parameter
        payload.id = "GL-" + uuid.v4();
        payload.created_at = currentMillis;
        payload.updated_at = currentMillis;
        payload.gallery_image = `${filepath}/images/${gallery_url}/${filename}`;

        const data = galleryModel(payload, true);
        const galleryId = await createGallery(data);

        // create history logs
        const historyId = "HL-" + uuid.v4();
        const route_path = `${filepath}/${gallery_url}/${payload.id}`

        history_payload = {
            id: historyId,
            title: payload.name,
            description: payload.description,
            image_url: payload.gallery_image,
            route_path: route_path,
            cpga_id: payload.id,
            created_at: payload.created_at,
            updated_at: payload.updated_at,
        };

        const historyData = historyModel(history_payload, true);
        await createHistory(historyData);

        return galleryId;
    } catch (error) {
        throw error;
    }
};

const updateGalleryService = async (payload) => {
    try {
        const gallery = await getGalleryById(payload.id);
        
        if (gallery === undefined) {
            const url = payload.gallery_image;
            const urlArray = url.split('/').filter(Boolean);
            const lastIdx = urlArray.length - 1;
            const filename = urlArray[lastIdx];
            const pathDelete = `${uploadDirectory}/${filename}`;
            deleteGalleryImage(pathDelete)
            throw new Error("Gallery not found");
        }

        const url = gallery.gallery_image;
        const urlArray = url.split('/').filter(Boolean);
        const lastIdx = urlArray.length - 1;
        const filename = urlArray[lastIdx];
        const pathDelete = `${uploadDirectory}/${filename}`;
        const file_gallery_name = payload.gallery_image;
        const filepath = mode_app === "PROD" ? prodHost : `http://localhost:${port}/v1`;
        deleteGalleryImage(pathDelete)

        payload.gallery_image = `${filepath}/images/${gallery_url}/${file_gallery_name}`;
        payload.updated_at = currentMillis;
        const data = galleryModel(payload, false);
        await updateGallery(payload.id, data);

        // update history logs
        const route_path = `${filepath}/${gallery_url}/${payload.id}`

        history_payload = {
            title: payload.name,
            description: payload.description,
            image_url: payload.gallery_image,
            route_path: route_path,
            updated_at: payload.updated_at,
        };

        const historyData = historyModel(history_payload, false);
        await updateHistory(payload.id, historyData);

        return payload.id;
    } catch (error) {
        throw error;
    }
};

const deleteGalleryService = async (galleryId) => {
    try {
        const existingGallery = await getGalleryById(galleryId);
        if (existingGallery === undefined || !existingGallery.gallery_image) {
            throw new Error("Gallery not found");
        }

        const url = existingGallery.gallery_image;
        const urlArray = url.split('/').filter(Boolean);
        const lastIdx = urlArray.length - 1;
        const filename = urlArray[lastIdx];
        const pathDelete = `${uploadDirectory}/${filename}`;
        deleteGalleryImage(pathDelete);

        const deletedGalleryId = await deleteGallery(galleryId);
        // delete history logs
        await deleteHistory(galleryId);
        
        return { galleryId: deletedGalleryId };
    } catch (error) {
        throw error;
    }
};

const getAllGalleriesServiceClient = async () => {
    try {
        const galleries = await getAllGalleriesClient();

        return { galleries };
    } catch (error) {
        throw error;
    }
};

// Fungsi untuk menghapus file gambar galeri
const deleteGalleryImage = async (imagePath) => {
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

module.exports = {
    getAllGalleriesService,
    getAllGalleriesServiceClient,
    getGalleryByIdService,
    createGalleryService,
    updateGalleryService,
    deleteGalleryService
};
