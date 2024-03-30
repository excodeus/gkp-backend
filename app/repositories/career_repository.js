const mySQLConnection = require('../providers/mysql/index');

const getCountCareerPages = async() => {
    try {
        const connection = await mySQLConnection();
        const [rows] = await connection.query('SELECT count(*) as count from careers');
        connection.end();
        
        return rows.count;
    } catch (error) {
        throw error;
    }
};

const getAllCareer = async (limit, offset, status) => {
    try {
        const connection = await mySQLConnection();
        let allCareerData;
        if (status === undefined) {
            allCareerData = await connection.query('SELECT id, name, position, status, updated_at FROM careers ORDER BY updated_at ASC LIMIT ? OFFSET ?', [limit, offset]);
        } else {
            allCareerData = await connection.query('SELECT id, name, position, status, updated_at FROM careers WHERE status = ? ORDER BY updated_at ASC LIMIT ? OFFSET ?', [status, limit, offset]);
        }
        const careers = allCareerData.map(career => ({
            id: career.id,
            name: career.name,
            position: career.position,
            status: career.status === 1,
            updated_at: career.updated_at
        }));
        connection.end();

        return careers;
    } catch (error) {
        throw error;
    }
};

const getCareerById = async (id) => {
    try {
        const connection = await mySQLConnection();
        const [careerData] = await connection.query('SELECT id, name, position, status, description, updated_at FROM careers WHERE id = ? ORDER BY updated_at ASC LIMIT 1', [id]);
        connection.end();

        if (careerData === undefined) {
            throw new Error("id not found");
        }
        // Convert status to boolean
        const career = {
            id: careerData.id,
            name: careerData.name,
            position: careerData.position,
            status: careerData.status === 1,
            description: careerData.description,
            updated_at: careerData.updated_at
        };

        return career;
    } catch (error) {
        throw error;
    }
};

const updateCareer = async (data) => {
    try {
        const connection = await mySQLConnection();
        const {id, name, position, status, description, updated_at} = data.value;
        
        // Build the SET part of the query dynamically based on the provided data
        let sets = [];
        let values = [];
        
        // Check if each field exists in the data, and add it to the SET part if it does
        if (name) {
            sets.push('name = ?');
            values.push(name);
        }
        if (position) {
            sets.push('position = ?');
            values.push(position);
        }
        if (status !== undefined) {
            sets.push('status = ?');
            values.push(status);
        }
        if (description) {
            sets.push('description = ?');
            values.push(description);
        }
        
        // Always include updated_at
        sets.push('updated_at = ?');
        values.push(updated_at);

        // Combine the SET part into a string
        const setString = sets.join(', ');

        // Execute the query with dynamic SET part
        const query = `UPDATE careers SET ${setString} WHERE id = ?`;
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

const createCareer = async (data) => {
    try {
        const connection = await mySQLConnection();

        const {
            id,
            name,
            position,
            status,
            description,
            created_at,
            updated_at
        } = data.value;

        await connection.query(
        "INSERT INTO careers (id, name, position, status, description, created_at, updated_at) VALUES(?,?,?,?,?,?,?)",
            [
                id,
                name,
                position,
                status,
                description,
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

const deleteCareer = async(id) => {
    try {
        const connection = await mySQLConnection();
        const result = await connection.query('DELETE FROM careers WHERE id = ?', [id]);
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
    getCountCareerPages,
    getAllCareer, 
    getCareerById, 
    updateCareer, 
    createCareer, 
    deleteCareer,
};