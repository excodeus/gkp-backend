const express = require('express');
const {
    getAllCategoryAdmin,
    postCategoryAdmin,
    putCategoryAdmin,
    deleteCategoryAdmin,
} = require('../../controllers/category_controllers');
const {
    authenticateToken,
} = require('../../middlewares/authentication');

const careerAdminFuncRouter = () => {
    const careerRoutes = express.Router();

    // career administrator endpoint
    careerRoutes.get("/", authenticateToken, getAllCategoryAdmin);
    careerRoutes.post("/", authenticateToken, postCategoryAdmin);
    careerRoutes.put("/:id", authenticateToken, putCategoryAdmin);
    careerRoutes.delete("/:id", authenticateToken, deleteCategoryAdmin);

    return careerRoutes;
};

module.exports = careerAdminFuncRouter;