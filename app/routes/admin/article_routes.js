const express = require('express');
const {
    getAllArticles,
    getArticleById,
    postArticleAdmin,
    putArticleAdmin,
    deleteArticleAdmin
} = require('../../controllers/article_controllers');
const {
    authenticateToken,
} = require('../../middlewares/authentication');
const upload = require('../../middlewares/image_filter_middleware');

const articleAdminFuncRouter = () => {
    const articleRoutes = express.Router();

    // article administrator endpoint
    articleRoutes.get("/", authenticateToken, getAllArticles);
    articleRoutes.post("/", authenticateToken, upload.single('article_image'), postArticleAdmin);
    articleRoutes.get("/:id", authenticateToken, getArticleById);
    articleRoutes.put("/:id", authenticateToken, upload.single('article_image'), putArticleAdmin);
    articleRoutes.delete("/:id", authenticateToken, deleteArticleAdmin);

    return articleRoutes;
};

module.exports = articleAdminFuncRouter;