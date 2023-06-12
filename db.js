const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://gzblirix:Y0hFuuI6JPlJ_qpgcuoGs4V8EYaltqZg@silly.db.elephantsql.com/gzblirix',
  ssl: true
});

client.connect();

// No arquivo de conexão do banco de dados (db.js)
client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
  );
`, (err) => {
  console.error('Erro ao criar tabela usuarios:', err)
});

client.query(`
  CREATE TABLE IF NOT EXISTS lists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
  );
`, (err) => {
  console.error('Erro ao criar tabela lists:', err)
});

client.query(`
  CREATE TABLE IF NOT EXISTS items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_checked BOOLEAN DEFAULT false,
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE
  );
`, (err) => {
  console.error('Erro ao criar tabela itens:', err)
});


module.exports = client;
