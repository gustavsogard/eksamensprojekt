// Import the necessary modules
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Define the Users class and its methods
function Categories(operation, obj) {
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
                    case 'getAll':
                        query = `SELECT * FROM categories`;
                        break;
                    case 'addFavorite':
                        query = 'INSERT INTO favorite_categories (user_id, category_id) SELECT @user_id, @category_id WHERE NOT EXISTS (SELECT user_id, category_id FROM favorite_categories WHERE user_id = @user_id AND category_id = @category_id)';
                        parameters = {
                            user_id: TYPES.Int,
                            category_id: TYPES.Int
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

                let categories = [];

                // Handle each row of the response
                request.on('row', (columns) => {
                    response = {};
                    columns.forEach((column) => {
                        response[column.metadata.colName] = column.value;
                    });
                    categories.push(response);
                });

                // Handle the completion of the request
                request.on('requestCompleted', () => {
                    resolve(categories);
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
module.exports = Categories;// Export the Users class