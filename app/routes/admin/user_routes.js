const express = require('express');
const {
    updateUserAdmin,
    deleteUserAdmin,
} = require('../../controllers/user_controllers');
const {
    authenticateToken,
    basicToken,
} = require('../../middlewares/authentication');

const userAdminFuncRouter = () => {
    const userRoutes = express.Router();

    userRoutes.put("/:id", authenticateToken, updateUserAdmin);
    userRoutes.delete("/:id", authenticateToken, deleteUserAdmin);

    return userRoutes;
};

module.exports = userAdminFuncRouter;