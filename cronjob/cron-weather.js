var CronJob = require('cron').CronJob;
const Weather = require('../models/Weather')

var job = new CronJob(
    '*/30 * * * * *',
    function() {
            const getWeather = async () => fetch(`https://api.open-meteo.com/v1/forecast?latitude=55.68&longitude=12.52&daily=temperature_2m_max,temperature_2m_min&past_days=31&timezone=Europe%2FBerlin`)
            .then((response) => response.json())           
            .then((data => {
                for (let i = 0; i < 30; i++) {
                    const weatherObject_historical = {
                        city: data.timezone,
                        date: data.daily.time[i],
                        degrees: data.daily.temperature_2m_max[i]
                      }
                      
                    Weather('historical', weatherObject_historical)
                }
                for (let i = 30; i < 38; i++) {
                    const weatherObject_forecast = {
                        city: data.timezone,
                        date: data.daily.time[i],
                        degrees: data.daily.temperature_2m_max[i]
                      }
                    Weather('forecast', weatherObject_forecast)
                }
                
            }))
        getWeather()
        console.log('DONE');
            
        }
      
    ,
    null,
    true
);
job.start()
