const express = require('express');
const {
    getAllCareerAdmin,
    postCareerAdmin,
    getDetailCareerAdmin,
    putCareerAdmin,
    deleteCareerAdmin,
} = require('../controllers/career_controllers');
const {
    authenticateToken,
} = require('../middlewares/authentication');

const careerAdminFuncRouter = () => {
    const careerRoutes = express.Router();

    // career administrator endpoint
    careerRoutes.get("/", authenticateToken, getAllCareerAdmin);
    careerRoutes.post("/", authenticateToken, postCareerAdmin);
    careerRoutes.get("/:id", authenticateToken, getDetailCareerAdmin);
    careerRoutes.put("/:id", authenticateToken, putCareerAdmin);
    careerRoutes.delete("/:id", authenticateToken, deleteCareerAdmin);

    return careerRoutes;
};

module.exports = careerAdminFuncRouter;