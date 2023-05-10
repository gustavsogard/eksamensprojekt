// Importere nødvendige moduler
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Definerer funktionen og metoden
function Users(operation, obj) {
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
                        query = 'INSERT INTO users (name, email, password) VALUES (@name, @email, @password)';
                        parameters = {
                            name: TYPES.VarChar,
                            email: TYPES.VarChar,
                            password: TYPES.VarChar
                        };
                        break;
                    case 'update':
                        query = 'UPDATE users SET name = @name, email = @email, password = @password WHERE email = @prevEmail';
                        parameters = {
                            name: TYPES.VarChar,
                            email: TYPES.VarChar,
                            prevEmail: TYPES.VarChar,
                            password: TYPES.VarChar
                        };
                        break;
                    case 'get':
                        query = 'SELECT * FROM users WHERE email = @email';
                        parameters = {
                            email: TYPES.VarChar
                        };
                        break;
                    case 'delete':
                        query = `
                            DELETE FROM comments WHERE user_id = @id;
                            DELETE FROM favorite_categories WHERE user_id = @id;
                            DELETE FROM favorite_articles WHERE user_id = @id;
                            DELETE FROM read_articles WHERE user_id = @id;
                            DELETE FROM users WHERE id = @id;
                        `;
                        parameters = {
                            id: TYPES.Int
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

                let response = undefined;

                // Handler hvert row af responsen
                request.on('row', (columns) => {
                    response = {};
                    columns.forEach((column) => {
                        response[column.metadata.colName] = column.value;
                    });
                });

                // Handler den færdige request
                request.on('requestCompleted', () => {
                    resolve(response);
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
module.exports = Users;
