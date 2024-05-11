const express = require('express');
const {
    getAllHistory,
    getDetailHistory,
} = require('../../controllers/history_controllers');

const historyClientFuncRouter = () => {
    const historyRoutes = express.Router();

    // history client endpoint
    historyRoutes.get("/", getAllHistory);
    historyRoutes.get("/:id", getDetailHistory);

    return historyRoutes;
};

module.exports = historyClientFuncRouter;