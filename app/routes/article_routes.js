const express = require('express');
const {
    getAllArticlesAdmin,
    getArticleByIdAdmin,
    postArticleAdmin,
    putArticleAdmin,
    deleteArticleAdmin
} = require('../controllers/article_controllers');
const upload = require('../middlewares/image_filter_middleware');

const articleAdminFuncRouter = () => {
    const articleRoutes = express.Router();

    // article administrator endpoint
    articleRoutes.get("/", getAllArticlesAdmin);
    articleRoutes.post("/", upload.single('article_image'), postArticleAdmin);
    articleRoutes.get("/:id", getArticleByIdAdmin);
    articleRoutes.put("/:id", upload.single('article_image'), putArticleAdmin);
    articleRoutes.delete("/:id", deleteArticleAdmin);

    return articleRoutes;
};

module.exports = articleAdminFuncRouter;