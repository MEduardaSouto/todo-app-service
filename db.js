const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://gzblirix:Y0hFuuI6JPlJ_qpgcuoGs4V8EYaltqZg@silly.db.elephantsql.com/gzblirix',
  ssl: true // ative o SSL para conexões seguras
});

client.connect();

module.exports = client;
