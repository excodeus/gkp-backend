const express = require('express');
const {
    getAllProductsAdmin,
    postProductAdmin,
    getProductByIdAdmin,
    putProductAdmin,
    deleteProductAdmin,
} = require('../controllers/product_controllers');
const upload = require('../middlewares/image_filter_middleware');

const productAdminFuncRouter = () => {
    const productRoutes = express.Router();

    // product administrator endpoint
    productRoutes.get("/", getAllProductsAdmin);
    productRoutes.post("/", upload.single('product_image'), postProductAdmin);
    productRoutes.get("/:id", getProductByIdAdmin);
    productRoutes.put("/:id", upload.single('product_image'), putProductAdmin);
    productRoutes.delete("/:id", deleteProductAdmin);

    return productRoutes;
};

module.exports = productAdminFuncRouter;