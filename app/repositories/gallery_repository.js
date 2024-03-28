const mySQLConnection = require('../providers/mysql/index');

const getCountGalleryPages = async() => {
    try {
        const connection = await mySQLConnection();
        const [rows] = await connection.query('SELECT count(*) as count from galleries');
        connection.end();
        
        return rows[0]?.count;
    } catch (error) {
        throw error;
    }
};

const getAllGalleries = async (limit, offset) => {
    try {
        const connection = await mySQLConnection();
        const allGalleriesData = await connection.query('SELECT * FROM galleries ORDER BY updated_at ASC LIMIT ? OFFSET ?', [limit, offset]);
        connection.end();

        return allGalleriesData;
    } catch (error) {
        throw error;
    }
};

const getGalleryById = async (galleryId) => {
    try {
        const connection = await mySQLConnection();
        const [galleryData] = await connection.query('SELECT * FROM galleries WHERE id = ? LIMIT 1', [galleryId]);
        connection.end();

        return galleryData;
    } catch (error) {
        throw error;
    }
};

const createGallery = async (galleryData) => {
    try {
        const connection = await mySQLConnection();
        const {
            id,
            name,
            gallery_image,
            created_at,
            updated_at
        } = galleryData.value;
        await connection.query(
            "INSERT INTO galleries (id, name, gallery_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            [
                id,
                name,
                gallery_image,
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

const updateGallery = async (galleryId, galleryData) => {
    try {
        const connection = await mySQLConnection();
        const {
            name,
            gallery_image,
            updated_at
        } = galleryData.value;
        
        // Build the SET part of the query dynamically based on the provided data
        let sets = [];
        let values = [];
        
        // Check if each field exists in the data, and add it to the SET part if it does
        if (name !== undefined) {
            sets.push('name = ?');
            values.push(name);
        }
        if (gallery_image !== undefined) {
            sets.push('gallery_image = ?');
            values.push(gallery_image);
        }
        // Always include updated_at
        sets.push('updated_at = ?');
        values.push(updated_at);

        // Combine the SET part into a string
        const setString = sets.join(', ');

        // Execute the query with dynamic SET part
        const query = `UPDATE galleries SET ${setString} WHERE id = ?`;
        values.push(galleryId);
        const result = await connection.query(query, values);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("Product not found");
        }

        return galleryId;
    } catch (error) {
        throw error;
    }
};


const deleteGallery = async (galleryId) => {
    try {
        const connection = await mySQLConnection();
        const result = await connection.query('DELETE FROM galleries WHERE id = ?', [galleryId]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("Product not found");
        }

        return galleryId;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getCountGalleryPages,
    getAllGalleries,
    getGalleryById,
    createGallery,
    updateGallery,
    deleteGallery
};
