var CronJob = require('cron').CronJob;
const Weather = require('../models/Weather');
const fetch = require('node-fetch');

var job = new CronJob(
    '*/15 * * * * *',
    async function() {
        Weather('truncate_tables');
        await fetch(`https://api.open-meteo.com/v1/forecast?latitude=55.68&longitude=12.52&daily=weathercode,sunrise,sunset,temperature_2m_max,temperature_2m_min&past_days=31&timezone=Europe%2FBerlin`)
        .then((response) => response.json())
        .then((data => {
            console.log("STARTING CRONJOB")
            for (let i = 0; i < 31; i++) {
                const weatherObject_historical = {
                    city: data.timezone,
                    date: data.daily.time[i],
                    degrees: data.daily.temperature_2m_max[i],
                    weathercode: data.daily.weathercode[i]
                    }
                Weather('historical', weatherObject_historical)
            }
            for (let i = 31; i < 38; i++) {
                const weatherObject_forecast = {
                    city: data.timezone,
                    date: data.daily.time[i],
                    degrees: data.daily.temperature_2m_max[i],
                    weathercode: data.daily.weathercode[i],
                    sunrise: data.daily.sunrise[i],
                    sunset: data.daily.sunset[i]
                    }
                Weather('forecast', weatherObject_forecast)
            }
        }))
        console.log('DONE');   
        }
    ,
    null,
    true
);
job.start()
