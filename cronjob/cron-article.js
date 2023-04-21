var CronJob = require('cron').CronJob;
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');
const ArticleDownload = require('../models/ArticleDownload')

// der er en foreign key constraint, der gør at vi ikke kan lægge kategorierne ind
/* 
           triggerUncaughtException(err, true /* fromPromise );
           ^

           RequestError: The INSERT statement conflicted with the FOREIGN KEY constraint "FK__articles__catego__0E391C95". The conflict occurred in database "CBS", table "dbo.categories", column 'id'.
*/




const categories = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']

var job = new CronJob(
    '*/30 * * * * *',
    function() {
        for (let j = 0; j <= categories.length; j++) {
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
                        category: j+2// 
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

