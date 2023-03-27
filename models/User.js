var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
const config = require('../config');

async function Users(operation, obj) {
    return new Promise((resolve, reject) => {
        var connection = new Connection(config);

        connection.on('connect', function(err) {
            if (err) {
                console.log(err);
            } else {
                switch (operation) {
                    case 'create':
                        var request = new Request('INSERT INTO users (first_name, last_name, email, password) VALUES (@first_name, @last_name, @email, @password)', function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                connection.close();
                            }
                        });

                        request.addParameter('first_name', TYPES.VarChar, obj.first_name);
                        request.addParameter('last_name', TYPES.VarChar, obj.last_name);
                        request.addParameter('email', TYPES.VarChar, obj.email);
                        request.addParameter('password', TYPES.VarChar, obj.password);

                        request.on('requestCompleted', function() {
                            resolve();
                        });

                        connection.execSql(request);
                        break;
                    case 'update':
                        var request = new Request('UPDATE users SET first_name = @first_name, last_name = @last_name, email = @email, password = @password WHERE email = @email', function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                connection.close();
                            }
                        });

                        request.addParameter('first_name', TYPES.VarChar, obj.first_name);
                        request.addParameter('last_name', TYPES.VarChar, obj.last_name);
                        request.addParameter('email', TYPES.VarChar, obj.email);
                        request.addParameter('password', TYPES.VarChar, obj.password);

                        request.on('requestCompleted', function() {
                            resolve();
                        });

                        connection.execSql(request);
                        break;
                    case 'get':
                        var request = new Request('SELECT * FROM users WHERE email = @email', function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                connection.close();
                            }
                        });

                        request.addParameter('email', TYPES.VarChar, obj.email);

                        let response = undefined;

                        request.on('row', function(columns) {
                            response = {};
                            columns.forEach(function(column) {
                                response[column.metadata.colName] = column.value;
                            });
                        });

                        request.on('requestCompleted', function() {
                            resolve(response);
                        });

                        connection.execSql(request);
                        break;
                    default:
                        console.log('No operation specified');
                }
            }
        });

        connection.connect();
    });
}

module.exports = Users;