const mySQLConnection = require('../providers/mysql/index');

const getCountArticlePages = async() => {
    try {
        const connection = await mySQLConnection();
        const [rows] = await connection.query('SELECT count(*) as count from articles');
        connection.end();
        
        return rows.count
    } catch (error) {
        throw error;
    }
};

const getAllArticles = async (limit, offset) => {
    try {
        const connection = await mySQLConnection();
        const allArticlesData = await connection.query('SELECT * FROM articles ORDER BY updated_at ASC LIMIT ? OFFSET ?', [limit, offset]);
        connection.end();

        return allArticlesData;
    } catch (error) {
        throw error;
    }
};

const getArticleById = async (articleId) => {
    try {
        const connection = await mySQLConnection();
        const [articleData] = await connection.query('SELECT * FROM articles WHERE id = ? LIMIT 1', [articleId]);
        connection.end();

        return articleData;
    } catch (error) {
        throw error;
    }
};

const createArticle = async (articleData) => {
    try {
        const connection = await mySQLConnection();
        const {
            id,
            title,
            author,
            content,
            article_image,
            created_at,
            updated_at
        } = articleData.value;
        await connection.query(
            "INSERT INTO articles (id, title, author, content, article_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                id,
                title,
                author,
                content,
                article_image,
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

const updateArticle = async (articleId, articleData) => {
    try {
        const connection = await mySQLConnection();
        const {
            title,
            author,
            content,
            article_image,
            updated_at
        } = articleData.value;
        
        // Build the SET part of the query dynamically based on the provided data
        let sets = [];
        let values = [];
        
        // Check if each field exists in the data, and add it to the SET part if it does
        if (title !== undefined) {
            sets.push('title = ?');
            values.push(title);
        }
        if (author !== undefined) {
            sets.push('author = ?');
            values.push(author);
        }
        if (content !== undefined) {
            sets.push('content = ?');
            values.push(content);
        }
        if (article_image !== undefined) {
            sets.push('article_image = ?');
            values.push(article_image);
        }
        // Always include updated_at
        sets.push('updated_at = ?');
        values.push(updated_at);

        // Combine the SET part into a string
        const setString = sets.join(', ');

        // Execute the query with dynamic SET part
        const query = `UPDATE articles SET ${setString} WHERE id = ?`;
        values.push(articleId);
        const result = await connection.query(query, values);

        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("Article not found");
        }

        return articleId;
    } catch (error) {
        throw error;
    }
};


const deleteArticle = async (articleId) => {
    try {
        const connection = await mySQLConnection();
        const result = await connection.query('DELETE FROM articles WHERE id = ?', [articleId]);
        connection.end();

        if (result.affectedRows === 0) {
            throw new Error("Article not found");
        }

        return articleId;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getCountArticlePages,
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};
