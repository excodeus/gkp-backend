const mySQLConnection = require('../providers/mysql/index');

const getUserByUsername = async (username) => {
    try {
        const connection = await mySQLConnection();
        const [userData] = await connection.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
        connection.end();

        return userData;
    } catch (error) {
        throw error;
    }
};

const createUser = async (userData) => {
    try {
        const connection = await mySQLConnection();
        const {
            id,
            username,
            password,
            email,
            role,
            created_at,
            updated_at
        } = userData.value;
        await connection.query(
            "INSERT INTO users (id, username, password, email, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                id,
                username,
                password,
                email,
                role,
                created_at,
                updated_at
            ]
        );
        connection.end();

        return id;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (userId, userData) => {
    try {
        const connection = await mySQLConnection();
        const {
            username,
            email,
            role,
            updated_at
        } = userData;
        
        // Build the SET part of the query dynamically based on the provided data
        let sets = [];
        let values = [];
        
        // Check if each field exists in the data, and add it to the SET part if it does
        if (username !== undefined) {
            sets.push('username = ?');
            values.push(username);
        }
        if (email !== undefined) {
            sets.push('email = ?');
            values.push(email);
        }
        if (role !== undefined) {
            sets.push('role = ?');
            values.push(role);
        }
        // Always include updated_at
        sets.push('updated_at = ?');
        values.push(updated_at);

        // Combine the SET part into a string
        const setString = sets.join(', ');

        // Execute the query with dynamic SET part
        const query = `UPDATE users SET ${setString} WHERE id = ?`;
        values.push(userId);
        const result = await connection.query(query, values);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("User not found");
        }

        return userId;
    } catch (error) {
        throw error;
    }
};

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


const deleteUser = async (userId) => {
    try {
        const connection = await mySQLConnection();
        const result = await connection.query('DELETE FROM users WHERE id = ?', [userId]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("User not found");
        }

        return userId;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getUserByUsername,
    createUser,
    updateUser,
    updateUserPassword,
    deleteUser
};
