const mySQLConnection = require('../providers/mysql/index');

const getTokenByUserId = async (userId) => {
    try {
        const connection = await mySQLConnection();
        const [tokenData] = await connection.query('SELECT * FROM user_tokens WHERE user_id = ? LIMIT 1', [userId]);
        connection.end();

        return tokenData;
    } catch (error) {
        throw error;
    }
};

const createToken = async (tokenData) => {
    try {
        const connection = await mySQLConnection();
        const {
            id,
            user_id,
            refresh_token,
            created_at,
        } = tokenData;
        await connection.query(
            "INSERT INTO user_tokens (id, user_id, refresh_token, created_at) VALUES (?, ?, ?, ?)",
            [
                id,
                user_id,
                refresh_token,
                created_at,
            ]
        );
        connection.end();

        return id;
    } catch (error) {
        throw error;
    }
};

const updateToken = async (userId, refreshToken) => {
    try {
        const connection = await mySQLConnection();
        const result = await connection.query(`UPDATE user_tokens SET refresh_token = ? WHERE user_id = ?`, [refreshToken, userId]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("Token not found");
        }

        return userId;
    } catch (error) {
        throw error;
    }
};

const deleteToken = async (userId) => {
    try {
        const connection = await mySQLConnection();
        const result = await connection.query('DELETE FROM user_tokens WHERE user_id = ?', [userId]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("Token not found");
        }

        return userId;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getTokenByUserId,
    createToken,
    updateToken,
    deleteToken
};
