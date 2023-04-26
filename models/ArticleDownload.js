// definerer max karakterer, for vores database
const MAX_DESCRIPTION_LENGTH = 255;

// Define the articles class and its methods
function ArticleDownload(obj) {
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