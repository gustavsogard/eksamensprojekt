// Importere nødvendige moduler
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Definerer funktionen og metoden
function Comments(operation, obj) {
    const connection = new Connection(config);

    // Returnere et Promise fra en asynkron handling
    return new Promise((resolve, reject) => {
        // Set up en database connection
        connection.on('connect', (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                let query = '';
                let parameters = {};

                // Set up SQL query og parameters baseret på specifik operation
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

                // Lav et nyt request object med SQL-query med parameters
                const request = new Request(query, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        connection.close();
                    }
                });

                // Tilføj parameteres til request objectet
                Object.keys(parameters).forEach((name) => {
                    request.addParameter(name, parameters[name], obj[name]);
                });

                let comments = [];

                // Handler hvert row af responsen
                request.on('row', (columns) => {
                    response = {};
                    columns.forEach((column) => {
                        response[column.metadata.colName] = column.value;
                    });
                    comments.push(response);
                });

                // Handler den færdige request
                request.on('requestCompleted', () => {
                    resolve(comments);
                });

                // Execute SQL-query'en
                connection.execSql(request);
            }
        });

        // Connecter til database
        connection.connect();
    });
}

// Exportere klassen
module.exports = Comments;