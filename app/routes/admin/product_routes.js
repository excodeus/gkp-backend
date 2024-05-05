const express = require('express');
const {
    getAllProductsAdmin,
    postProductAdmin,
    getProductByIdAdmin,
    putProductAdmin,
    deleteProductAdmin,
} = require('../../controllers/product_controllers');
const {
    authenticateToken,
} = require('../../middlewares/authentication');
const upload = require('../../middlewares/image_filter_middleware');

const productAdminFuncRouter = () => {
    const productRoutes = express.Router();

    // product administrator endpoint
    productRoutes.get("/", authenticateToken, getAllProductsAdmin);
    productRoutes.post("/", authenticateToken, upload.single('product_image'), postProductAdmin);
    productRoutes.get("/:id", authenticateToken, getProductByIdAdmin);
    productRoutes.put("/:id", authenticateToken, upload.single('product_image'), putProductAdmin);
    productRoutes.delete("/:id", authenticateToken, deleteProductAdmin);

    return productRoutes;
};

module.exports = productAdminFuncRouter;