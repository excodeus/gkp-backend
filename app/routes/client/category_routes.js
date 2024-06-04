const express = require('express');
const {
    getAllCategoryAndProduct,
} = require('../../controllers/category_controllers');

const careerClientFuncRouter = () => {
    const careerRoutes = express.Router();

    // career client endpoint
    careerRoutes.get("/products", getAllCategoryAndProduct);

    return careerRoutes;
};

module.exports = careerClientFuncRouter;