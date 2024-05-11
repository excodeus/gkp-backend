const mySQLConnection = require('../providers/mysql/index');

const getCountProductPages = async() => {
    try {
        const connection = await mySQLConnection();
        const [rows] = await connection.query('SELECT count(*) as count from products');
        connection.end();
        
        return rows.count
    } catch (error) {
        throw error;
    }
};

const getAllProducts = async (limit, offset) => {
    try {
        const connection = await mySQLConnection();
        const allProductsData = await connection.query('SELECT * FROM products ORDER BY updated_at ASC LIMIT ? OFFSET ?', [limit, offset]);
        connection.end();

        return allProductsData;
    } catch (error) {
        throw error;
    }
};

const getProductById = async (productId) => {
    try {
        const connection = await mySQLConnection();
        const [productData] = await connection.query('SELECT * FROM products WHERE id = ? LIMIT 1', [productId]);
        connection.end();

        return productData;
    } catch (error) {
        throw error;
    }
};

const createProduct = async (productData) => {
    try {
        const connection = await mySQLConnection();
        const {
            id,
            category_id,
            name,
            description,
            product_image,
            created_at,
            updated_at
        } = productData.value;
        await connection.query(
            "INSERT INTO products (id, category_id, name, description, product_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                id,
                category_id,
                name,
                description,
                product_image,
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

const updateProduct = async (productId, productData) => {
    try {
        const connection = await mySQLConnection();
        const {
            category_id,
            name,
            description,
            product_image,
            updated_at
        } = productData.value;
        
        // Build the SET part of the query dynamically based on the provided data
        let sets = [];
        let values = [];
        
        // Check if each field exists in the data, and add it to the SET part if it does
        if (category_id !== undefined) {
            sets.push('category_id = ?');
            values.push(category_id);
        }
        if (name !== undefined) {
            sets.push('name = ?');
            values.push(name);
        }
        if (description !== undefined) {
            sets.push('description = ?');
            values.push(description);
        }
        if (product_image !== undefined) {
            sets.push('product_image = ?');
            values.push(product_image);
        }
        // Always include updated_at
        sets.push('updated_at = ?');
        values.push(updated_at);

        // Combine the SET part into a string
        const setString = sets.join(', ');

        // Execute the query with dynamic SET part
        const query = `UPDATE products SET ${setString} WHERE id = ?`;
        values.push(productId);
        const result = await connection.query(query, values);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("Product not found");
        }

        return productId;
    } catch (error) {
        throw error;
    }
};


const deleteProduct = async (productId) => {
    try {
        const connection = await mySQLConnection();
        const result = await connection.query('DELETE FROM products WHERE id = ?', [productId]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("Product not found");
        }

        return productId;
    } catch (error) {
        throw error;
    }
};

const getAllProductByCategory = async (categoryId) => {
    try {
        const connection = await mySQLConnection();
        const allProductsData = await connection.query('SELECT p.id, p.name, p.product_image FROM products p INNER JOIN categories c ON c.id = p.category_id WHERE c.id = ? ORDER BY p.name ASC', [categoryId]);
        connection.end();

        return allProductsData;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getCountProductPages,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductByCategory,
};
