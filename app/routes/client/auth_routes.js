const express = require('express');
const {
    registerUser,
    loginUser,
    refreshUserToken,
    logoutUser,
    getUserByEmail,
    postOTPUser,
    updateUserPassword,
} = require('../../controllers/auth_controllers');
const {
    authenticateToken,
    authenticateRefreshToken,
} = require('../../middlewares/authentication');

const authAdminFuncRouter = () => {
    const authRoutes = express.Router();

    // user administrator endpoint
    authRoutes.post("/register", registerUser);
    authRoutes.post("/login", loginUser);
    authRoutes.post("/refresh-token", authenticateRefreshToken, refreshUserToken);
    authRoutes.post("/logout", authenticateToken, logoutUser);
    // reset password
    authRoutes.post("/check-email", getUserByEmail);
    authRoutes.post("/forget-password", postOTPUser);
    authRoutes.post("/reset-password", updateUserPassword);

    return authRoutes;
};

module.exports = authAdminFuncRouter;