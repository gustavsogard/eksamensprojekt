// Definerer max karakterer, for vores database
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');
const cronjob = require('../cronjob/cron-article')
var count = 0

// Definerer articleDownload funktion
function ArticleDownload(obj) {
    const connection = new Connection(config);
    
    // Return et promise
    return new Promise((resolve, reject) => {
        // Laver database connection
        connection.on('connect', (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                // SQL query der sætter artikler in i articles, og tjekker om der er duplikater ved at kigge på URL
                query = `INSERT INTO articles (title, description, source, author, url, image, published_at, category_id)
                        SELECT @title, @description, @source, @author, @url, @image, @published_At, @category
                        WHERE NOT EXISTS
                            (SELECT url
                            FROM articles
                            WHERE url = @url)`
                parameters = {
                    title: TYPES.VarChar,
                    description: TYPES.VarChar,
                    source: TYPES.VarChar,
                    author: TYPES.VarChar,
                    url: TYPES.VarChar,
                    image: TYPES.VarChar, 
                    published_at: TYPES.VarChar,
                    category: TYPES.Int
                };
                count++
                        
                

                // Laver en ny request
                const request = new Request(query, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        connection.close();
                    }
                });

                // Tilføjer parametrene til requesten
                Object.keys(parameters).forEach((name) => {
                    request.addParameter(name, parameters[name], obj[name]);
                });
                // definerer et tomt array for at kunne populere det med artikler
                let response = [];

                // tilføjer data for hvert row, Det bliver sat ind i response, som kan blive eksekveret . 
                request.on('row', (columns) => {
                    let article = {};
                    columns.forEach((column) => {
                        article[column.metadata.colName] = column.value;
                    })
                    response.push(article)
                });
                
                // Færdiggørerer requestet
                request.on('requestCompleted', () => {
                    resolve(count);
                });

                // eksekverer SQL query
                connection.execSql(request);
            }
        });

        // Connecter til databasen
        connection.connect();
    });
}

module.exports = ArticleDownload;

