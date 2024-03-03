const mySQLConnection = require('../providers/mysql/index');

const getCountCareerPages = async() => {
    try {
        const connection = await mySQLConnection();
        const [rows] = await connection.query('SELECT count(*) as count from careers');
        connection.end();
        
        return rows[0]?.count;
    } catch (error) {
        throw error;
    }
};

const getAllCareer = async (limit, offset, status) => {
    try {
        const connection = await mySQLConnection();
        const [allCareerData] = await connection.query('SELECT id, name, position, status, updated_at FROM careers WHERE status = ? ORDER BY updated_at ASC LIMIT ?, ?', [status, offset, limit]);
        connection.end();

        return allCareerData;
    } catch (error) {
        throw error;
    }
};

const getCareerById = async (id) => {
    try {
        const connection = await mySQLConnection();
        const [careerData] = connection.query('SELECT id, name, position, status, description, updated_at FROM careers WHERE id = ? ORDER BY updated_at ASC', [id]);
        connection.end();
        
        return careerData;
    } catch (error) {
        throw error;
    }
};

const updateCareer = async (data) => {
    try {
        const connection = await mySQLConnection();
        const {id, name, position, status, description, updated_at} = data;
        const [updateId] = connection.query('UPDATE careers SET name = ?, position = ?, status = ?, description = ?, updated_at = ? WHERE id = ? RETURNING id', [name, position, status, description, updated_at, id]);
        connection.end();
        
        return updateId;
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
        } = data;
        
        const [careerId] = connection.query(
        "INSERT INTO users (id, name, position, status, description, created_at, updated_at) VALUES(?,?,?,?,?,?,?) RETURNING id",
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

        return careerId;
    } catch (error) {
        throw error;
    }
};

const deleteCareer = async (id) => {
    try {
        const connection = await mySQLConnection();
        
        const [deletedId] = connection.query('DELETE FROM users WHERE id = ? RETURNING id', [id]);
        connection.end();
        
        return deletedId;
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
    deleteCareer
};