//Henter dotenv modulet
require('dotenv').config();

//Definerer et objekt som bruges til konfiguration af forbindelse til Azure
//Vi bruger dotenv, så man selv kan oprette en .env-fil og udfylde ens egen konfigurationsværdier
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

//Eksporterer config-objektet til vores Models
module.exports = config;
