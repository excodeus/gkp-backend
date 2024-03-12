const mySQLConnection = require('../providers/mysql/index');

const getAllCategory = async () => {
    try {
        const connection = await mySQLConnection();
        const allCategoryData = await connection.query('SELECT id, name, updated_at FROM categories ORDER BY updated_at');
        connection.end();

        return allCategoryData;
    } catch (error) {
        throw error;
    }
};

const updateCategory = async (data) => {
    try {
        const connection = await mySQLConnection();
        const {id, name, updated_at} = data.value;
        
        // Build the SET part of the query dynamically based on the provided data
        let sets = [];
        let values = [];
        
        // Check if each field exists in the data, and add it to the SET part if it does
        if (name) {
            sets.push('name = ?');
            values.push(name);
        }
        
        // Always include updated_at
        sets.push('updated_at = ?');
        values.push(updated_at);

        // Combine the SET part into a string
        const setString = sets.join(', ');

        // Execute the query with dynamic SET part
        const query = `UPDATE categories SET ${setString} WHERE id = ?`;
        values.push(id);
        const result = await connection.query(query, values);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("id not found");
        }
        
        return id;
    } catch (error) {
        throw error;
    }
}

const createCategory = async (data) => {
    try {
        const connection = await mySQLConnection();

        const {
            id,
            name,
            created_at,
            updated_at
        } = data.value;

        await connection.query(
        "INSERT INTO categories (id, name, created_at, updated_at) VALUES(?,?,?,?)",
            [
                id,
                name,
                created_at,
                updated_at
            ],
        );

        connection.end();

        return id;
    } catch (error) {
        throw error;
    }
};

const deleteCategory = async(id) => {
    try {
        const connection = await mySQLConnection();
        const result = await connection.query('DELETE FROM categories WHERE id = ?', [id]);
        connection.end();
        if (result.affectedRows === 0) {
            throw new Error("id not found");
        }
        return id;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllCategory, 
    updateCategory, 
    createCategory, 
    deleteCategory,
};