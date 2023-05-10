// Importere nødvendige moduler
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Definerer funktionen og metoden
function Search(operation, obj) {
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
                    case 'search':

                        query = `SELECT *
                                    FROM articles
                                    WHERE title LIKE '%'+ @keyWord +'%'
                                AND
                                    source LIKE '%'+ @publisher +'%'
                                ORDER BY published_at DESC
                                OFFSET @page * 12 ROWS
                                FETCH FIRST 12 ROWS ONLY;`
                                

                        parameters = {
                            keyWord: TYPES.VarChar,
                            publisher: TYPES.VarChar,
                            page: TYPES.Int
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

                let response = [];

                // Handler hvert row af responsen
                request.on('row', (columns) => {
                    let article = {};
                    columns.forEach((column) => {
                        article[column.metadata.colName] = column.value;
                    })
                    response.push(article)
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
module.exports = Search;
