// Importere nødvendige moduler
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Definerer funktionen og metoden
function Categories(operation, obj) {
    const connection = new Connection(config);

    // Returner et Promise for asynkron handling
    return new Promise((resolve, reject) => {
        // Laver database connection
        connection.on('connect', (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                let query = '';
                let parameters = {};

                // Set up SQL query og parameters baseret på specifik operation
                switch (operation) {
                    case 'getAll':
                        query = `SELECT 
                                    categories.*,
                                    CASE WHEN favorite_categories.category_id IS NOT NULL THEN 1 ELSE 0 END as added_to_favorite
                                FROM categories
                                LEFT JOIN favorite_categories
                                    ON categories.id = favorite_categories.category_id
                                    AND favorite_categories.user_id = @user_id
                        `;
                        parameters = {
                            user_id: TYPES.Int
                        }
                        break;
                    case 'addFavorite':
                        query = 'INSERT INTO favorite_categories (user_id, category_id) SELECT @user_id, @category_id WHERE NOT EXISTS (SELECT user_id, category_id FROM favorite_categories WHERE user_id = @user_id AND category_id = @category_id)';
                        parameters = {
                            user_id: TYPES.Int,
                            category_id: TYPES.Int
                        };
                        break;
                    case 'removeFavorite':
                        query = 'DELETE FROM favorite_categories WHERE user_id = @user_id AND category_id = @category_id';
                        parameters = {
                            user_id: TYPES.Int,
                            category_id: TYPES.Int
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

                let categories = [];

                // Handler hvert row af responsen
                request.on('row', (columns) => {
                    response = {};
                    columns.forEach((column) => {
                        response[column.metadata.colName] = column.value;
                    });
                    categories.push(response);
                });

                // Handler den færdige request
                request.on('requestCompleted', () => {
                    resolve(categories);
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
module.exports = Categories;