const express = require('express');
const {
    getAllCareerAdmin,
    postCareerAdmin,
    getDetailCareerAdmin,
    putCareerAdmin,
    deleteCareerAdmin,
} = require('../controllers/career_controllers');

const careerAdminFuncRouter = () => {
    const careerRoutes = express.Router();

    // career administrator endpoint
    careerRoutes.get("/", getAllCareerAdmin);
    careerRoutes.post("/", postCareerAdmin);
    careerRoutes.get("/:id", getDetailCareerAdmin);
    careerRoutes.put("/:id", putCareerAdmin);
    careerRoutes.delete("/:id", deleteCareerAdmin);

    return careerRoutes;
};

module.exports = careerAdminFuncRouter;