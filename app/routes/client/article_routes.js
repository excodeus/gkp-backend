const express = require('express');
const {
    getAllArticles,
} = require('../../controllers/article_controllers');

const articleClientFuncRouter = () => {
    const articleRoutes = express.Router();

    // article endpoint
    articleRoutes.get("/home", getAllArticles); //landing-page

    return articleRoutes;
};

module.exports = articleClientFuncRouter;