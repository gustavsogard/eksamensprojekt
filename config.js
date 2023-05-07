require('dotenv').config();

const config = {
    server: process.env.DATABASE_URL,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_NAME,
            password: process.env.PASSWORD
        }
    },
    options: {
        encrypt: true,
        port: 1433,
        database: process.env.DATABASE
    }
};

module.exports = config;
