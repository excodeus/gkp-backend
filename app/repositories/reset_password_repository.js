const mySQLConnection = require('../providers/mysql/index');

const getUserByEmail = async (email) => {
    try {
        const connection = await mySQLConnection();
        const [userData] = await connection.query('SELECT id, email, username FROM users WHERE email = ? LIMIT 1', [email]);
        connection.end();

        if (!userData || userData.length === 0) {
            throw new Error("User not registered yet");
        }

        return userData;
    } catch (error) {
        throw error;
    }
};

const getUserByEmailAndUserId = async (user_id, email) => {
    try {
        const connection = await mySQLConnection();
        const [userData] = await connection.query(
            'SELECT id, email, username FROM users WHERE id = ? AND email = ? LIMIT 1', 
            [user_id, email]
        );
        connection.end();

        if (!userData || userData.length === 0) {
           throw new Error("User not found");
        }

        return userData;
    } catch (error) {
        throw error;
    }
};

const checkOTPByUserId = async (user_id) => {
    try {
        const connection = await mySQLConnection();
        const [resetPasswordData] = await connection.query('SELECT * FROM reset_passwords WHERE user_id = ? LIMIT 1', [user_id]);
        connection.end();

        return resetPasswordData;
    } catch (error) {
        throw error;
    }
};

const checkOTPByUserIdAndOTP = async (user_id, otp) => {
    try {
        const connection = await mySQLConnection();
        const [resetPasswordData] = await connection.query('SELECT * FROM reset_passwords WHERE user_id = ? AND otp = ? AND expired_at > UNIX_TIMESTAMP(NOW()) * 1000 LIMIT 1', [user_id, otp]);
        connection.end();

        if (!resetPasswordData || resetPasswordData.length === 0) {
            throw new Error("OTP has expired");
        }

        return resetPasswordData;
    } catch (error) {
        throw error;
    }
};

const updateResetPassword = async (userData) => {
    try {
        const connection = await mySQLConnection();
        const {
            user_id,
            otp,
            expired_at,
        } = userData;
        const result = await connection.query(
            "UPDATE reset_passwords SET otp = ?, expired_at = ? WHERE user_id = ?",
            [
                otp,
                expired_at,
                user_id
            ]
        );
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("Reset password not found");
        }

        return result;
    } catch (error) {
        throw error;
    }
}

const updateUserPassword = async (userData) => {
    try {
        const connection = await mySQLConnection();
        const {
            id,
            password,
            updated_at
        } = userData;
        const result = await connection.query(
            "UPDATE users SET password = ?, updated_at = ? WHERE id = ?",
            [
                password,
                updated_at,
                id
            ]
        );
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("User not found");
        }

        return id;
    } catch (error) {
        throw error;
    }
}

const createOTP = async (userData) => {
    try {
        const connection = await mySQLConnection();
        const {
            id,
            user_id,
            otp,
            created_at,
            expired_at,
        } = userData;
        await connection.query(
            "INSERT INTO reset_passwords (id, user_id, otp, created_at, expired_at) VALUES (?, ?, ?, ?, ?)",
            [
                id,
                user_id,
                otp,
                created_at,
                expired_at,
            ]
        );
        connection.end();

        return id;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUserByEmail,
    getUserByEmailAndUserId,
    checkOTPByUserId,
    checkOTPByUserIdAndOTP,
    updateResetPassword,
    updateUserPassword,
    createOTP,
};
