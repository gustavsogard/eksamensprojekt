const { Connection, Request } = require('tedious');

const config = {
    server: 'cbs-gustav.database.windows.net',
    authentication: {
        type: 'default',
        options: {
            userName: 'gustav',
            password: 'KrMksas6dpiCo5F9'
        } 
    },
    options: {
        encrypt: true,
        port: 1433,
        database: 'CBS'
    }
};
 
const connection = new Connection(config);

connection.on('connect', (err) => {
    if (err) {
        console.log(err);
        reject(err);
    } else {
        let query = 'SELECT TOP 10 * FROM sales.orders';

        const request = new Request(query, (err) => {
            if (err) {
                console.log(err);
            } else {
                connection.close();
            }
        });

        let response;
        let counter = 0;

        request.on('row', (columns) => {
            columns.forEach((column) => {
                console.log(column.metadata.colName, ': ', column.value);
            });
            console.log('-----------------');
            counter++;
        });

        request.on('requestCompleted', () => {
            console.log(counter, 'rows returned');
        });

        connection.execSql(request);
    }
});

connection.connect();
