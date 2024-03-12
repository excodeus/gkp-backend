const express = require('express');
const {
    getAllCategoryAdmin,
    postCategoryAdmin,
    putCategoryAdmin,
    deleteCategoryAdmin,
} = require('../controllers/category_controllers');

const careerAdminFuncRouter = () => {
    const careerRoutes = express.Router();

    // career administrator endpoint
    careerRoutes.get("/", getAllCategoryAdmin);
    careerRoutes.post("/", postCategoryAdmin);
    careerRoutes.put("/:id", putCategoryAdmin);
    careerRoutes.delete("/:id", deleteCategoryAdmin);

    return careerRoutes;
};

module.exports = careerAdminFuncRouter;