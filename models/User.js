// Import the necessary modules
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Define the Users class and its methods
function Users(operation, obj) {
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
                    case 'create':
                        query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (@first_name, @last_name, @email, @password)';
                        parameters = {
                            first_name: TYPES.VarChar,
                            last_name: TYPES.VarChar,
                            email: TYPES.VarChar,
                            password: TYPES.VarChar
                        };
                        break;
                    case 'update':
                        query = 'UPDATE users SET first_name = @first_name, last_name = @last_name, email = @email, password = @password WHERE email = @email';
                        parameters = {
                            first_name: TYPES.VarChar,
                            last_name: TYPES.VarChar,
                            email: TYPES.VarChar,
                            password: TYPES.VarChar
                        };
                        break;
                    case 'get':
                        query = 'SELECT * FROM users WHERE email = @email';
                        parameters = {
                            email: TYPES.VarChar
                        };
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
module.exports = Users;
