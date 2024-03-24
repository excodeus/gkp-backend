const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const {
    getCountCareerPages,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../repositories/product_repository');
const { 
    getCategoryById,
} = require('../repositories/category_repository');
const paginateConverter = require('../utils/paginate_converter');
const productModel = require('../models/product');

require('dotenv').config()

const mode_app = process.env.MODE;
const prodHost = process.env.HOST;
const product_url = process.env.PRODUCT_URL;
const port = process.env.APP_PORT;

const ROOT_DIR = path.resolve(__dirname, '../..');
const uploadDirectory = path.join(ROOT_DIR, '/storage/uploads/products');

// Membuat folder upload jika belum ada
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const currentMillis = Date.now();

const getAllProductsService = async (page, limit) => {
    try {
        // count total pages
        const rawPage = await getCountCareerPages();

        // converter pagination
        const {offset, totalPages} = paginateConverter(page, limit, rawPage);

        const products = await getAllProducts(limit, offset);

        return { products, totalPages };
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
            const pathDelete = `${uploadDirectory}/${product_url}/${filename}`;
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
        const pathDelete = `${uploadDirectory}/${product_url}/${filename}`;
        const file_product_name = payload.product_image;
        const filepath = mode_app === "PROD" ? prodHost : `http://localhost:${port}/v1`;

        deleteProductImage(pathDelete)

        payload.product_image = `${filepath}/images/${product_url}/${file_product_name}`;
        payload.updated_at = currentMillis;
        const data = productModel(payload, false);
        await updateProduct(payload.id, data);

        return payload.id;
    } catch (error) {
        throw error;
    }
};

const deleteProductService = async (productId) => {
    try {
        const existingProduct = await getProductById(productId);
        if (existingProduct === undefined) {
            throw new Error("Product not found");
        }
        if (existingProduct.product_image) {
            const url = existingProduct.product_image;
            const urlArray = url.split('/').filter(Boolean);
            const lastIdx = urlArray.length - 1;
            const filename = urlArray[lastIdx];
            const pathDelete = `${uploadDirectory}/${product_url}/${filename}`;
            deleteProductImage(pathDelete);
        }

        const deletedProductId = await deleteProduct(productId);
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
