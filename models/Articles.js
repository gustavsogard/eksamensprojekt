// Import the necessary modules
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Define the articles class and its methods
function Articles(operation, obj) {
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
                    case 'getById':
                        query = `
                            SELECT
                                articles.*,
                                CASE WHEN favorite_articles.article_id IS NOT NULL THEN 1 ELSE 0 END as added_to_favorite,
                                CASE WHEN read_articles.article_id IS NOT NULL THEN 1 ELSE 0 END as article_read
                            FROM
                                articles
                                LEFT JOIN favorite_articles
                                    ON articles.id = favorite_articles.article_id
                                    AND favorite_articles.user_id = @user_id
                                LEFT JOIN read_articles
                                    ON articles.id = read_articles.article_id
                                    AND read_articles.user_id = @user_id
                            WHERE
                                articles.id = @id
                        `;
                        parameters = {
                            id: TYPES.Int,
                            user_id: TYPES.Int
                        };
                        break;
                    case 'read':
                        query = 'INSERT INTO read_articles (user_id, article_id) SELECT @user_id, @article_id WHERE NOT EXISTS (SELECT user_id, article_id FROM read_articles WHERE user_id = @user_id AND article_id = @article_id)';
                        parameters = {
                            user_id: TYPES.Int,
                            article_id: TYPES.Int
                        };
                        break;
                    case 'addFavorite':
                        query = 'INSERT INTO favorite_articles (user_id, article_id) VALUES (@user_id, @article_id)';
                        parameters = {
                            user_id: TYPES.Int,
                            article_id: TYPES.Int
                        };
                        break;
                    case 'removeFavorite':
                        query = 'DELETE FROM favorite_articles WHERE user_id = @user_id AND article_id = @article_id';
                        parameters = {
                            user_id: TYPES.Int,
                            article_id: TYPES.Int
                        };
                        break;
                    case 'get12':
                        query = `
                            SELECT
                                *
                            FROM
                                articles
                            ORDER BY published_at DESC
                            OFFSET @page * 12 ROWS
                            FETCH FIRST 12 ROWS ONLY
                        `;
                        parameters = {
                            page: TYPES.Int
                        }
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

                let response = [];

                // Handle each row of the response
                request.on('row', (columns) => {
                    let article = {};
                    columns.forEach((column) => {
                        article[column.metadata.colName] = column.value;
                    })
                    response.push(article)
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

// Export the articles class
module.exports = Articles;
