const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const {
    getCountArticlePages,
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
} = require('../repositories/article_repository');
const paginateConverter = require('../utils/paginate_converter');
const articleModel = require('../models/article');

require('dotenv').config()

const mode_app = process.env.MODE;
const prodHost = process.env.HOST;
const article_url = process.env.ARTICLE_URL;
const port = process.env.APP_PORT;

const ROOT_DIR = path.resolve(__dirname, '../..');
const uploadDirectory = path.join(ROOT_DIR, `/storage/uploads/${article_url}`);

// Membuat folder upload jika belum ada
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

const currentMillis = Date.now();

const getAllArticlesService = async (page, limit) => {
    try {
        // count total pages
        const rawPage = await getCountArticlePages();

        // converter pagination
        const {offset, totalPages} = paginateConverter(page, limit, rawPage);
        if (page > totalPages) {
            throw new Error("Page exceed data");
        }

        const articles = await getAllArticles(limit, offset);

        return { articles, totalPages };
    } catch (error) {
        throw error;
    }
};

const getArticleByIdService = async (articleId) => {
    try {
        const article = await getArticleById(articleId);
        if (article === undefined) {
            throw new Error("Article not found");
        }
        return article;
    } catch (error) {
        throw error;
    }
};

const createArticleService = async (payload) => {
    try {
        const filename = payload.article_image;
        const filepath = mode_app === "PROD" ? prodHost : `http://localhost:${port}/v1`;
        // add more parameter
        payload.id = "AR-" + uuid.v4();
        payload.created_at = currentMillis;
        payload.updated_at = currentMillis;
        payload.article_image = `${filepath}/images/${article_url}/${filename}`;

        const data = articleModel(payload, true);
        const articleId = await createArticle(data);

        return articleId;
    } catch (error) {
        throw error;
    }
};

const updateArticleService = async (payload) => {
    try {
        const article = await getArticleById(payload.id);
        
        if (article === undefined) {
            const url = payload.article_image;
            const urlArray = url.split('/').filter(Boolean);
            const lastIdx = urlArray.length - 1;
            const filename = urlArray[lastIdx];
            const pathDelete = `${uploadDirectory}/${filename}`;
            deleteArticleImage(pathDelete)
            throw new Error("Article not found");
        }

        const url = article.article_image;
        const urlArray = url.split('/').filter(Boolean);
        const lastIdx = urlArray.length - 1;
        const filename = urlArray[lastIdx];
        const pathDelete = `${uploadDirectory}/${filename}`;
        const file_article_name = payload.article_image;
        const filepath = mode_app === "PROD" ? prodHost : `http://localhost:${port}/v1`;
        deleteArticleImage(pathDelete)

        payload.article_image = `${filepath}/images/${article_url}/${file_article_name}`;
        payload.updated_at = currentMillis;
        const data = articleModel(payload, false);
        await updateArticle(payload.id, data);

        return payload.id;
    } catch (error) {
        throw error;
    }
};

const deleteArticleService = async (articleId) => {
    try {
        const existingArticle = await getArticleById(articleId);
        if (existingArticle === undefined || !existingArticle.article_image) {
            throw new Error("Article not found");
        }
        
        const url = existingArticle.article_image;
        const urlArray = url.split('/').filter(Boolean);
        const lastIdx = urlArray.length - 1;
        const filename = urlArray[lastIdx];
        const pathDelete = `${uploadDirectory}/${filename}`;
        deleteArticleImage(pathDelete);

        const deletedArticleId = await deleteArticle(articleId);
        return { articleId: deletedArticleId };
    } catch (error) {
        throw error;
    }
};

// Fungsi untuk menghapus file gambar artikel
const deleteArticleImage = async (imagePath) => {
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

module.exports = {
    getAllArticlesService,
    getArticleByIdService,
    createArticleService,
    updateArticleService,
    deleteArticleService
};
