const sql = require('mssql');
const config = require('../config');

async function query(sql, params) {
  const connection = await sql.connect(config.db);

  return results;
}

module.exports = {
  query
}
