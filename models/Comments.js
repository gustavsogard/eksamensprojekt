// Import the necessary modules
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Define the Users class and its methods
function Comments(operation, obj) {
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
                        query = 'INSERT INTO comments (content, user_id, article_id) VALUES (@content, @user_id, @article_id)';
                        parameters = {
                            content: TYPES.VarChar,
                            user_id: TYPES.Int,
                            article_id: TYPES.Int
                        };
                        break;
                    case 'getAllByArticleId':
                        query = `SELECT content, name FROM comments INNER JOIN users ON comments.user_id = users.id
                                WHERE article_id = @article_id`;
                        parameters = {
                            article_id: TYPES.Int
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

                let comments = [];

                // Handle each row of the response
                request.on('row', (columns) => {
                    response = {};
                    columns.forEach((column) => {
                        response[column.metadata.colName] = column.value;
                    });
                    comments.push(response);
                });

                // Handle the completion of the request
                request.on('requestCompleted', () => {
                    resolve(comments);
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
module.exports = Comments;// Export the Users class