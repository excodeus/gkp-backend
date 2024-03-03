const mysql = require('mysql');
const util = require('util');

const mySQLConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Promisify the query method
    connection.query = util.promisify(connection.query);

    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw error;
  }
};

module.exports = mySQLConnection;
