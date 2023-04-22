// Import the necessary modules
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Define the Users class and its methods
function Weather(operation, obj) {
    const connection = new Connection(config);

    // Return a Promise for asynchronous handling
    return new Promise((resolve, reject) => {
        // Set up a database connection
        connection.on('connect', (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                let query = '';
                let parameters = {};

                // Set up the SQL query and parameters based on the specified operation
                switch (operation) {
                    case 'historical':
                        query = 'INSERT INTO weather_historical (city, date, degrees) VALUES (@city, @date, @degrees)';
                        parameters = {
                            city: TYPES.VarChar,
                            date: TYPES.DateTime,
                            degrees: TYPES.Int
                        };
                        break;
                    case 'forecast':
                        query = 'INSERT INTO weather_forecast (city, date, degrees) VALUES (@city, @date, @degrees)';
                        parameters = {
                            city: TYPES.VarChar,
                            date: TYPES.DateTime,
                            degrees: TYPES.Int
                        };
                        break;
                    case 'truncate_tables':
                        query = 'TRUNCATE table weather_historical; TRUNCATE table weather_forecast;';
                        break;
                    case 'getWeatherHistorical':
                        query = 'SELECT date, degrees FROM weather_historical'
                        break;
                    case 'getWeatherForecast': 
                        query = 'SELECT date, degrees FROM weather_forecast'
                        break;
                    default:
                        console.log('No operation specified');
                        reject(new Error('No operation specified'));
                }

                // Create a new Request object with the SQL query and parameters
                const request = new Request(query, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        connection.close();
                    }
                });

                // Add the parameters to the Request object
                Object.keys(parameters).forEach((name) => {
                    request.addParameter(name, parameters[name], obj[name]);
                });

                let response = undefined;

                // Handle each row of the response
                request.on('row', (columns) => {
                    response = {};
                    columns.forEach((column) => {
                        response[column.metadata.colName] = column.value;
                    });
                });

                // Handle the completion of the request
                request.on('requestCompleted', () => {
                    resolve(response);
                });

                // Execute the SQL query
                connection.execSql(request);
            }
        });

        // Connect to the database
        connection.connect();
    });
}

// Export the Users class
module.exports = Weather;
