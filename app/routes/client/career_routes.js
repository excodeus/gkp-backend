const express = require('express');
const {
    getAllCareerClient,
    getDetailCareer,
} = require('../../controllers/career_controllers');

const careerClientFuncRouter = () => {
    const careerRoutes = express.Router();

    // career administrator endpoint
    careerRoutes.get("/", getAllCareerClient);
    careerRoutes.get("/:id", getDetailCareer);

    return careerRoutes;
};

module.exports = careerClientFuncRouter;