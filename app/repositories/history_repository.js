const mySQLConnection = require('../providers/mysql/index');

const getAllHistoriesClient = async () => {
    try {
        const connection = await mySQLConnection();
        const allHistoriesData = await connection.query('SELECT id, title, description, image_url FROM history_logs ORDER BY title ASC LIMIT 5');
        connection.end();

        return allHistoriesData;
    } catch (error) {
        throw error;
    }
};

const getHistoryById = async (historyId) => {
    try {
        const connection = await mySQLConnection();
        const [historyData] = await connection.query('SELECT * FROM history_logs WHERE id = ? LIMIT 1', [historyId]);
        connection.end();

        return historyData;
    } catch (error) {
        throw error;
    }
};

const createHistory = async (historyData) => {
    try {
        const connection = await mySQLConnection();
        const {
            id,
            title,
            description,
            image_url,
            route_path,
            cpga_id,
            created_at,
            updated_at
        } = historyData.value;
        await connection.query(
            "INSERT INTO history_logs (id, title, description, image_url, route_path, cpga_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                id,
                title,
                description,
                image_url,
                route_path,
                cpga_id,
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

const updateHistory = async (cpgaId, historyData) => {
    try {
        const connection = await mySQLConnection();
        const {
            title,
            description,
            image_url,
            route_path,
            updated_at
        } = historyData.value;
        
        // Build the SET part of the query dynamically based on the provided data
        let sets = [];
        let values = [];
        
        // Check if each field exists in the data, and add it to the SET part if it does
        if (title !== undefined) {
            sets.push('title = ?');
            values.push(title);
        }
        if (description !== undefined) {
            sets.push('description = ?');
            values.push(description);
        }
        if (image_url !== undefined) {
            sets.push('image_url = ?');
            values.push(image_url);
        }
        if (route_path !== undefined) {
            sets.push('route_path = ?');
            values.push(route_path);
        }
        // Always include updated_at
        sets.push('updated_at = ?');
        values.push(updated_at);

        // Combine the SET part into a string
        const setString = sets.join(', ');

        // Execute the query with dynamic SET part
        const query = `UPDATE history_logs SET ${setString} WHERE cpga_id = ?`;
        values.push(cpgaId);
        const result = await connection.query(query, values);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("History not found");
        }

        return cpgaId;
    } catch (error) {
        throw error;
    }
};


const deleteHistory = async (cpgaId) => {
    try {
        const connection = await mySQLConnection();
        const result = await connection.query('DELETE FROM history_logs WHERE cpga_id = ?', [cpgaId]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("History not found");
        }

        return cpgaId;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllHistoriesClient,
    getHistoryById,
    createHistory,
    updateHistory,
    deleteHistory
};
