const express = require('express');
const {
    getAllCareerAdmin,
    postCareerAdmin,
    getDetailCareer,
    putCareerAdmin,
    deleteCareerAdmin,
} = require('../../controllers/career_controllers');
const {
    authenticateToken,
} = require('../../middlewares/authentication');

const careerAdminFuncRouter = () => {
    const careerRoutes = express.Router();

    // career administrator endpoint
    careerRoutes.get("/", authenticateToken, getAllCareerAdmin);
    careerRoutes.post("/", authenticateToken, postCareerAdmin);
    careerRoutes.get("/:id", authenticateToken, getDetailCareer);
    careerRoutes.put("/:id", authenticateToken, putCareerAdmin);
    careerRoutes.delete("/:id", authenticateToken, deleteCareerAdmin);

    return careerRoutes;
};

module.exports = careerAdminFuncRouter;