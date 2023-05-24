const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://gzblirix:Y0hFuuI6JPlJ_qpgcuoGs4V8EYaltqZg@silly.db.elephantsql.com/gzblirix',
  ssl: true
});

client.connect();

client.query(`
  CREATE TABLE IF NOT EXISTS lists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    itens JSONB
  );
`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela lists:', err);
  } else {
    console.log('Tabela lists criada com sucesso');
  }
});

module.exports = client;
