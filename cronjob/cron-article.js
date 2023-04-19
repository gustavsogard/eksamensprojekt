var CronJob = require('cron').CronJob;
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Define the Users class and its methods
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
                query = 'INSERT INTO articles (title, description, source, author, url, image, published_at) VALUES (@title, @description, @source, @author, @url, @image. @publishedAt)';
                parameters = {
                    title: TYPES.VarChar,
                    description: TYPES.VarChar,
                    source: TYPES.VarChar,
                    author: TYPES.VarChar,
                    url: TYPES.VarChar,
                    image: TYPES.VarChar, 
                    published_at: TYPES.VarChar
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

var job = new CronJob(
    '*/10 * * * * *',
    function() {
       const downloadBatch = async () => fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=5608686a49a04c6e8db72943b518feb5')
        .then((response) => response.json())           
        .then((data => {
            const dataKeys = {
                title: data.articles[0].title,
                description: data.articles[0].description,
                author: data.articles[0].author,
                source: data.articles[0].source.name,
                url: data.articles[0].url,
                image: data.articles[0].urlToImage,
                publishedAt: data.articles[0].publishedAt
            }
            console.log(dataKeys.publishedAt);
            Articles(dataKeys)
        }))
    downloadBatch()
    console.log('DONE');
    }
    ,
    null,
    true
);
job.start()

