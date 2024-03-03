const express = require('express');
const {
    getAllCareerAdmin,
    postCareerAdmin,
} = require('../controllers/career_controllers');

const careerAdminFuncRouter = () => {
    const careerRoutes = express.Router();

    // career administrator endpoint
    careerRoutes.get("/", getAllCareerAdmin);
    careerRoutes.post("/", postCareerAdmin);
    // careerRoutes.get(`/${administrator_url}/${career_url}/{id}`, getDetailCareerAdmin);
    // careerRoutes.put(`/${administrator_url}/${career_url}/{id}`, putCareerAdmin);
    // careerRoutes.delete(`/${administrator_url}/${career_url}/{id}`, deleteCareerAdmin);

    return careerRoutes;
};

module.exports = careerAdminFuncRouter;