const { Connection, Request, TYPES } = require('tedious');
const config = require('../config');

function Users(operation, obj) {
    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                let query = '';
                let parameters = {};

                switch (operation) {
                    case 'create':
                        query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (@first_name, @last_name, @email, @password)';
                        parameters = {
                            first_name: TYPES.VarChar,
                            last_name: TYPES.VarChar,
                            email: TYPES.VarChar,
                            password: TYPES.VarChar
                        };
                        break;
                    case 'update':
                        query = 'UPDATE users SET first_name = @first_name, last_name = @last_name, email = @email, password = @password WHERE email = @email';
                        parameters = {
                            first_name: TYPES.VarChar,
                            last_name: TYPES.VarChar,
                            email: TYPES.VarChar,
                            password: TYPES.VarChar
                        };
                        break;
                    case 'get':
                        query = 'SELECT * FROM users WHERE email = @email';
                        parameters = {
                            email: TYPES.VarChar
                        };
                        break;
                    default:
                        console.log('No operation specified');
                        reject(new Error('No operation specified'));
                }

                const request = new Request(query, (err) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        connection.close();
                    }
                });

                Object.keys(parameters).forEach((name) => {
                    request.addParameter(name, parameters[name], obj[name]);
                });

                let response = undefined;

                request.on('row', (columns) => {
                    response = {};
                    columns.forEach((column) => {
                        response[column.metadata.colName] = column.value;
                    });
                });

                request.on('requestCompleted', () => {
                    resolve(response);
                });

                connection.execSql(request);
            }
        });

        connection.connect();
    });
}

module.exports = Users;
