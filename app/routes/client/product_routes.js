const express = require('express');
const {
    getProductById,
} = require('../../controllers/product_controllers');

const productClientFuncRouter = () => {
    const productRoutes = express.Router();

    // product administrator endpoint
    productRoutes.get("/:id", getProductById);

    return productRoutes;
};

module.exports = productClientFuncRouter;