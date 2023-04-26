var CronJob = require('cron').CronJob;
const ArticleDownload = require('../models/ArticleDownload')

// der er en foreign key constraint, der gør at vi ikke kan lægge kategorierne ind
/* 
           triggerUncaughtException(err, true /* fromPromise );
           ^

           RequestError: The INSERT statement conflicted with the FOREIGN KEY constraint "FK__articles__catego__0E391C95". The conflict occurred in database "CBS", table "dbo.categories", column 'id'.
*/


const MAX_DESCRIPTION_LENGTH = 255;

const categoriesORG = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']
const categoriesAI = ['dmoz%2FBusiness', 'news/Arts_and_Entertainment', 'dmoz', 'news%2FHealth', 'dmoz%2FScience', 'dmoz%2FSports', 'news%2FTechnology']
var job = new CronJob(
    '*/59 * * * * *',
    async function() {
        console.log('STARTING CRONJOB');
        for (let j = 0; j < categoriesORG.length; j++) {
            let fetchUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${categoriesORG[j]}&apiKey=5608686a49a04c6e8db72943b518feb5`
            await fetch(fetchUrl)
            .then((response) => response.json())           
            .then((async data => {
                for (let i = 0; i < 2; i++) {
                    /* if(data.status == 'error'){
                        continue
                    } */
                    // gør så vi ikke får artikler uden billeder
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
                    ArticleDownload(dataKeys)
                }
                
            }))
            let fetchUrl2 = `https://www.newsapi.ai/api/v1/article/getArticles?query=%7B%22%24query%22%3A%7B%22categoryUri%22%3A%22${categoriesAI[j]}%22%7D%2C%22%24filter%22%3A%7B%22forceMaxDataTimeWindow%22%3A%2231%22%7D%7D&resultType=articles&articlesSortBy=date&articlesCount=10&includeArticleImage=true&includeArticleLinks=true&articleBodyLen=-1&apiKey=1ffc790e-383e-4086-b734-9ad99812c11c&`
            
            await fetch(fetchUrl2)
            .then((response) => response.json())           
            .then((async data => {
                for (let i = 0; i < 2; i++) {
                    // gør så vi ikke får artikler uden billeder
                    
                    let description = data.articles.results[i].description;
                    // tjekker om description eksisterer, altså den ikke er null
                    if (description) {
                        // hvis den eksisterer, tjekker om den er længere end 255, som er vores max
                        if (description.length > MAX_DESCRIPTION_LENGTH) {
                            // skærer description ned til at passe til vores maks
                            description = description.slice(0, MAX_DESCRIPTION_LENGTH);
                        } 
                        // hvis den ikke eksisterer bliver den blot sat til null. 
                    } else {
                        continue
                    }
    
                    const dataKeys = {
                        title: data.articles.results[i].title,
                        description: description,
                        author: data.articles.results[i].author,
                        source: data.articles.results[i].source.name,
                        url: data.articles.results[i].url,
                        image: data.articles.results[i].image,
                        published_at: data.articles.results[i].publishedAt,
                        category: j+2// 
                      }
                     ArticleDownload(dataKeys)
                }
                
            }))
        }
        console.log('Cronjob DONE');
      
    }
    ,
    null,
    true
);
job.start()

