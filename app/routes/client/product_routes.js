const express = require('express');
const {
    getProductById,
    getAllProductsByCategory,
} = require('../../controllers/product_controllers');

const productClientFuncRouter = () => {
    const productRoutes = express.Router();

    // product administrator endpoint
    productRoutes.get("/:id", getProductById);
    productRoutes.get("/category/:id", getAllProductsByCategory);

    return productRoutes;
};

module.exports = productClientFuncRouter;