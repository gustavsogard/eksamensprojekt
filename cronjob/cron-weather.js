//Henter Weather-model og relevante moduler
var CronJob = require('cron').CronJob;
const Weather = require('../models/Weather');
const fetch = require('node-fetch');

//Definerer et nyt cronjob
var job = new CronJob(
    //Definerer tiden for hvornår cron-jobbet skal gøre
    '*/15 * * * * *',
    async function() {
        //Sletter al data i vejr-tabellerne
        Weather('truncate_tables');
        //Henter vejrdata fra vores vejrAPI og gør det til et JavaScript objekt
        await fetch(`https://api.open-meteo.com/v1/forecast?latitude=55.68&longitude=12.52&daily=weathercode,sunrise,sunset,temperature_2m_max,temperature_2m_min&past_days=31&timezone=Europe%2FBerlin`)
        .then((response) => response.json())
        .then((data => {
            console.log("STARTING CRONJOB")
            //Gemmer de historiske vejrdata i et objekt i overensstemmelse med API'et (de første 30 datapunkter)
            for (let i = 0; i < 31; i++) {
                const weatherObject_historical = {
                    city: data.timezone,
                    date: data.daily.time[i],
                    degrees: data.daily.temperature_2m_max[i],
                    weathercode: data.daily.weathercode[i]
                    }
                //Tiløjer til databasen ved hjælp af Weather-modellen
                Weather('historical', weatherObject_historical)
            }
            //Gemmer data for vejrudsigten i et objekt (de sidste 7 datapunkter)
            for (let i = 31; i < 38; i++) {
                const weatherObject_forecast = {
                    city: data.timezone,
                    date: data.daily.time[i],
                    degrees: data.daily.temperature_2m_max[i],
                    weathercode: data.daily.weathercode[i],
                    sunrise: data.daily.sunrise[i],
                    sunset: data.daily.sunset[i]
                    }
                //Tilføjer vejrudsigten til databasen ved hjælp af Weather modellen
                Weather('forecast', weatherObject_forecast)
            }
        }))
        console.log('DONE');   
        }
    ,
    null,
    true
);
//Starter cronjobbet
job.start()
