const config = {
    server: 'cbs-gustav.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
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

module.exports = config;
