const mySQLConnection = require('../providers/mysql/index');

const createHistory = async (historyData) => {
    try {
        const connection = await mySQLConnection();
        const {
            id,
            title,
            description,
            image_url,
            route_path,
            cpg_id,
            created_at,
            updated_at
        } = historyData.value;
        await connection.query(
            "INSERT INTO history_logs (id, title, description, image_url, route_path, cpg_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                id,
                title,
                description,
                image_url,
                route_path,
                cpg_id,
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

const updateHistory = async (cpgId, historyData) => {
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
        const query = `UPDATE history_logs SET ${setString} WHERE cpg_id = ?`;
        values.push(cpgId);
        const result = await connection.query(query, values);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("History not found");
        }

        return cpgId;
    } catch (error) {
        throw error;
    }
};


const deleteHistory = async (cpgId) => {
    try {
        const connection = await mySQLConnection();
        const result = await connection.query('DELETE FROM history_logs WHERE cpg_id = ?', [cpgId]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("History not found");
        }

        return cpgId;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createHistory,
    updateHistory,
    deleteHistory
};
