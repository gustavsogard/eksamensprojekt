// Importere nødvendige moduler
const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

// Definerer funktionen og metoden
function Weather(operation, obj) {
    const connection = new Connection(config);

    // Returnere et Promise fra en asynkron handling
    return new Promise((resolve, reject) => {
        // Set up en database connection
        connection.on('connect', (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                let query = '';
                let parameters = {};

                // Set up SQL query og parameters baseret på specifik operation
                switch (operation) {
                    case 'historical':
                        query = 'INSERT INTO weather_historical (city, date, degrees, weathercode) VALUES (@city, @date, @degrees, @weathercode)';
                        parameters = {
                            city: TYPES.VarChar,
                            date: TYPES.DateTime,
                            degrees: TYPES.Int,
                            weathercode: TYPES.Int
                        };
                        break;
                    case 'forecast':
                        query = 'INSERT INTO weather_forecast (city, date, degrees, weathercode, sunrise, sunset) VALUES (@city, @date, @degrees, @weathercode, @sunrise, @sunset)';
                        parameters = {
                            city: TYPES.VarChar,
                            date: TYPES.DateTime,
                            degrees: TYPES.Int,
                            weathercode: TYPES.Int,
                            sunrise: TYPES.DateTime,
                            sunset: TYPES.DateTime
                        };
                        break;
                    case 'truncate_tables':
                        query = 'TRUNCATE table weather_historical; TRUNCATE table weather_forecast;';
                        break;
                    case 'getWeatherHistorical':
                        query = 'SELECT date, degrees, weathercode FROM weather_historical ORDER BY date DESC'
                        break;
                    case 'getWeatherForecast':
                        query = 'SELECT date, degrees, weathercode, sunrise, sunset FROM weather_forecast ORDER BY date ASC'
                        break;
                    default:
                        console.log('No operation specified');
                        reject(new Error('No operation specified'));
                }

                // Lav et nyt request object med SQL-query med parameters
                const request = new Request(query, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        connection.close();
                    }
                });

                 // Tilføj parameteres til request objectet
                 Object.keys(parameters).forEach((name) => {
                    request.addParameter(name, parameters[name], obj[name]);
                });

                let response = [];

                // Handler hvert row af responsen
                request.on('row', (columns) => {
                    let weather = {};
                    columns.forEach((column) => {
                        weather[column.metadata.colName] = column.value;
                    })
                    response.push(weather)
                });
                
                // Handler den færdige request
                request.on('requestCompleted', () => {
                    resolve(response);
                });

                // Execute SQL-query'en
                connection.execSql(request);
            }
        });

        // Connecter til database
        connection.connect();
    });
}

// Exportere klassen
module.exports = Weather;
