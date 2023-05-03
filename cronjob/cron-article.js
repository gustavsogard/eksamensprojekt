var CronJob = require('cron').CronJob;
const ArticleDownload = require('../models/ArticleDownload')
const apiKey = require('../keys.json')

// der er en foreign key constraint, der gør at vi ikke kan lægge kategorierne ind
/* 
           triggerUncaughtException(err, true /* fromPromise );
           ^

           RequestError: The INSERT statement conflicted with the FOREIGN KEY constraint "FK__articles__catego__0E391C95". The conflict occurred in database "CBS", table "dbo.categories", column 'id'.
*/


const MAX_DESCRIPTION_LENGTH = 255;
let count1, count2 
const categoriesORG = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']
const categoriesAI = ['dmoz%2FBusiness', 'news/Arts_and_Entertainment', 'dmoz', 'news%2FHealth', 'dmoz%2FScience', 'dmoz%2FSports', 'news%2FTechnology']
var job = new CronJob(
    '*/30 * * * * *',
    async function() {
        console.log('STARTING CRONJOB');
        for (let j = 0; j < categoriesORG.length; j++) {
            let fetchUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${categoriesORG[j]}&apiKey=${apiKey.API.ORG}`
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
                            description = 'Ingen beskrivelse';
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
                   count1 =  await ArticleDownload(dataKeys)
                }
                
            }))
            let fetchUrl2 = `https://www.newsapi.ai/api/v1/article/getArticles?query=%7B%22%24query%22%3A%7B%22%24and%22%3A%5B%7B%22categoryUri%22%3A%22${categoriesAI[j]}%22%7D%2C%7B%22locationUri%22%3A%22http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FUnited_States%22%7D%2C%7B%22dateStart%22%3A%222023-04-21%22%2C%22dateEnd%22%3A%222023-04-28%22%2C%22lang%22%3A%22eng%22%7D%5D%7D%2C%22%24filter%22%3A%7B%22startSourceRankPercentile%22%3A0%2C%22endSourceRankPercentile%22%3A40%2C%22isDuplicate%22%3A%22skipDuplicates%22%7D%7D&resultType=articles&articlesSortBy=date&articlesCount=10&includeArticleBody=false&includeArticleEventUri=false&includeArticleImage=true&articleBodyLen=-1&apiKey=${apiKey.API.AI}`
            
            await fetch(fetchUrl2)
            .then((response) => response.json())           
            .then((async data => {
                for (let i = 0; i < 2; i++) {
                    let description = data.articles.results[i].description;

                    // tjekker om description eksisterer, altså den ikke er null
                    if (description) {
                        // hvis den eksisterer, tjekker om den er længere end 255, som er vores max
                        if (description.length > MAX_DESCRIPTION_LENGTH) {
                            // skærer description ned til at passe til vores maks
                            description = description.slice(0, MAX_DESCRIPTION_LENGTH);
                        }}
    
                    let dataKeys = {
                        title: data.articles.results[i].title,
                        description: description,
                        author: data.articles.results[i].author,
                        source: data.articles.results[i].source.name,
                        url: data.articles.results[i].url,
                        image: data.articles.results[i].image,
                        published_at: data.articles.results[i].publishedAt,
                        category: j+2// 
                      }
                    // looper gennem keys, for at tjekke om der nogle steder der mangler data
                    for (const key in dataKeys){
                    // hvis der mangler data, bliver det sat til 'Mangler data' i stedet for <null>    
                        if(!dataKeys[key]){
                            dataKeys[key] = 'Mangler data'
                        }
                    }
                     count2 =  await ArticleDownload(dataKeys)
                }
                
            }))
        }
        let total = count1+count2
        console.log('CRONJOB DONE ' + total + ' Articles run through SQL');
      
    }
    ,
    null,
    true
);
job.start()

