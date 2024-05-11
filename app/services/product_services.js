const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const {
    getCountProductPages,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../repositories/product_repository');
const { 
    getCategoryById,
} = require('../repositories/category_repository');
const { 
    createHistory,
    updateHistory,
    deleteHistory
} = require('../repositories/history_repository');
const paginateConverter = require('../utils/paginate_converter');
const productModel = require('../models/product');
const historyModel = require('../models/history');

require('dotenv').config()

const mode_app = process.env.MODE;
const prodHost = process.env.HOST;
const product_url = process.env.PRODUCT_URL;
const port = process.env.APP_PORT;

const ROOT_DIR = path.resolve(__dirname, '../..');
const uploadDirectory = path.join(ROOT_DIR, `/storage/uploads/${product_url}`);

// Membuat folder upload jika belum ada
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const currentMillis = Date.now();

const getAllProductsService = async (page, limit) => {
    try {
        // count total pages
        const totalData = await getCountProductPages();

        // converter pagination
        const {offset, totalPages} = paginateConverter(page, limit, totalData);

        const products = await getAllProducts(limit, offset);

        return { products, totalPages, totalData };
    } catch (error) {
        throw error;
    }
};

const getProductByIdService = async (productId) => {
    try {
        const product = await getProductById(productId);
        if (product === undefined) {
            throw new Error("Product not found");
        }
        return product;
    } catch (error) {
        throw error;
    }
};

const createProductService = async (payload) => {
    try {
        const filename = payload.product_image;
        const filepath = mode_app === "PROD" ? prodHost : `http://localhost:${port}/v1`;
        // add more parameter
        payload.id = "PD-" + uuid.v4();
        payload.created_at = currentMillis;
        payload.updated_at = currentMillis;
        payload.product_image = `${filepath}/images/${product_url}/${filename}`;

        const data = productModel(payload, true);
        const productId = await createProduct(data);

        // create history logs
        const historyId = "HL-" + uuid.v4();
        const route_path = `${filepath}/${product_url}/${payload.id}`

        history_payload = {
            id: historyId,
            title: payload.name,
            description: payload.description,
            image_url: payload.product_image,
            route_path: route_path,
            cpga_id: payload.id,
            created_at: payload.created_at,
            updated_at: payload.updated_at,
        };

        const historyData = historyModel(history_payload, true);
        await createHistory(historyData);

        return productId;
    } catch (error) {
        throw error;
    }
};

const updateProductService = async (payload) => {
    try {
        const product = await getProductById(payload.id);
        const categories = await getCategoryById(payload.category_id);
        
        if (categories === undefined || product === undefined) {
            const url = payload.product_image;
            const urlArray = url.split('/').filter(Boolean);
            const lastIdx = urlArray.length - 1;
            const filename = urlArray[lastIdx];
            const pathDelete = `${uploadDirectory}/${filename}`;
            deleteProductImage(pathDelete)
            if (categories === undefined) {
                throw new Error("Category ID not found");
            }
            if (product === undefined) {
                throw new Error("Product not found");
            }
        }

        const url = product.product_image;
        const urlArray = url.split('/').filter(Boolean);
        const lastIdx = urlArray.length - 1;
        const filename = urlArray[lastIdx];
        const pathDelete = `${uploadDirectory}/${filename}`;
        const file_product_name = payload.product_image;
        const filepath = mode_app === "PROD" ? prodHost : `http://localhost:${port}/v1`;
        deleteProductImage(pathDelete)

        payload.product_image = `${filepath}/images/${product_url}/${file_product_name}`;
        payload.updated_at = currentMillis;
        const data = productModel(payload, false);
        await updateProduct(payload.id, data);

        // update history logs
        const route_path = `${filepath}/${product_url}/${payload.id}`

        history_payload = {
            title: payload.name,
            description: payload.description,
            image_url: payload.product_image,
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

const deleteProductService = async (productId) => {
    try {
        const existingProduct = await getProductById(productId);
        if (existingProduct === undefined || !existingProduct.product_image) {
            throw new Error("Product not found");
        }
        
        const url = existingProduct.product_image;
        const urlArray = url.split('/').filter(Boolean);
        const lastIdx = urlArray.length - 1;
        const filename = urlArray[lastIdx];
        const pathDelete = `${uploadDirectory}/${filename}`;
        deleteProductImage(pathDelete);

        const deletedProductId = await deleteProduct(productId);
        // delete history logs
        await deleteHistory(productId);

        return { productId: deletedProductId };
    } catch (error) {
        throw error;
    }
};

// Fungsi untuk menghapus file gambar produk
const deleteProductImage = async (imagePath) => {
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

module.exports = {
    getAllProductsService,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService
};
