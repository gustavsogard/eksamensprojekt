var CronJob = require('cron').CronJob;
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// der er en foreign key constraint, der gør at vi ikke kan lægge kategorierne ind
/* 
           triggerUncaughtException(err, true /* fromPromise );
           ^

           RequestError: The INSERT statement conflicted with the FOREIGN KEY constraint "FK__articles__catego__0E391C95". The conflict occurred in database "CBS", table "dbo.categories", column 'id'.
*/


// definerer max karakterer, for vores database
const MAX_DESCRIPTION_LENGTH = 255;

// Define the articles class and its methods
function Articles(obj) {
    console.log(obj);
    const connection = new Connection(config);
    // Return a Promise for asynchronous handling
    return new Promise((resolve, reject) => {
        // Set up a database connection
        connection.on('connect', (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                // Set up the SQL query and parameters based on the specified operation
                query = 'INSERT INTO articles (title, description, source, author, url, image, published_at, category_id ) VALUES (@title, @description, @source, @author, @url, @image, @published_At, @category)';
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

const categories = ['business', 'entertainment', 'general']

var job = new CronJob(
    '*/30 * * * * *',
    function() {
        for (let j = 0; j < categories.length; j++) {
            console.log(categories[j]);
            const downloadBatch = async () => fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${categories[j]}&apiKey=5608686a49a04c6e8db72943b518feb5`)
            .then((response) => response.json())           
            .then((data => {
                for (let i = 0; i < 2; i++) {
                        let description = data.articles[i].description;
                        // tjekker om description eksisterer, altså den ikke er null
                        if (description) {
                            // hvis den eksisterer, tjekker om den er længere end 255, som er vores max
                            if (description.length > MAX_DESCRIPTION_LENGTH) {
                                // skærer description ned til at passe til vores maks
                                description = description.slice(0, MAX_DESCRIPTION_LENGTH);
                            } 
                            // hvis den ikke eksisterer bliver den blot sat til null. 
                        } else {
                            description = null;
                        }
    
                    const dataKeys = {
                        title: data.articles[i].title,
                        description: description,
                        author: data.articles[i].author,
                        source: data.articles[i].source.name,
                        url: data.articles[i].url,
                        image: data.articles[i].urlToImage,
                        published_at: data.articles[i].publishedAt,
                        category: j// 
                      }
                    Articles(dataKeys)
                }
                
            }))
        downloadBatch()
        console.log('DONE');
            
        }
      
    }
    ,
    null,
    true
);
job.start()

