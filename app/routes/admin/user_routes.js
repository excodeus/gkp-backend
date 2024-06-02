const express = require('express');
const {
    registerUser,
    loginUser,
    refreshUserToken,
    logoutUser,
    updateUserAdmin,
    deleteUserAdmin,
    getUserByEmail,
    postOTPUser,
    updateUserPassword,
} = require('../../controllers/user_controllers');
const {
    authenticateToken,
    authenticateRefreshToken,
    basicToken,
} = require('../../middlewares/authentication');

const userAdminFuncRouter = () => {
    const userRoutes = express.Router();

    // user administrator endpoint
    userRoutes.post("/", basicToken, registerUser);
    userRoutes.post("/login", loginUser);
    userRoutes.post("/refresh-token", authenticateRefreshToken, refreshUserToken);
    userRoutes.post("/logout", authenticateToken, logoutUser);
    userRoutes.put("/:id", authenticateToken, updateUserAdmin);
    userRoutes.delete("/:id", authenticateToken, deleteUserAdmin);
    // reset password
    userRoutes.post("/check-email", getUserByEmail);
    userRoutes.post("/forget-password", postOTPUser);
    userRoutes.post("/reset-password", updateUserPassword);

    return userRoutes;
};

module.exports = userAdminFuncRouter;