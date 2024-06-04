const express = require('express');
const {
    getAllArticlesLandingPage,
    getAllArticles,
    getArticleById,
} = require('../../controllers/article_controllers');

const articleClientFuncRouter = () => {
    const articleRoutes = express.Router();
    // article endpoint
    articleRoutes.get("/home", getAllArticlesLandingPage);
    articleRoutes.get("/", getAllArticles);
    articleRoutes.get("/:id", getArticleById);

    return articleRoutes;
};

module.exports = articleClientFuncRouter;