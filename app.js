const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const client = require('./db');
const List = require('./api/List');
const Item = require('./api/Item');
const User = require('./api/User');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Cria uma lista
app.post('/list', async (req, res) => {
  const { name } = req.body;

  try {
    // Insere a nova lista no banco de dados
    const id = uuidv4();
    const result = await client.query('INSERT INTO lists (id, name) VALUES ($1, $2) RETURNING *', [id, name]);
    const novaLista = result.rows[0];
    
    res.json(novaLista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar a nova lista' });
  }
});

// Recupera todas as listas
app.get('/list', async (req, res) => {
  try {
    // Recupera todas as listas do banco de dados
    const result = await client.query('SELECT * FROM lists');
    const listas = result.rows;
    
    res.json(listas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao recuperar as listas' });
  }
});

// Excluir uma lista
app.delete('/list/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Exclui a lista com o ID fornecido do banco de dados
    await client.query('DELETE FROM lists WHERE id = $1', [id]);

    res.sendStatus(204); // Resposta de sucesso
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir a lista' });
  }
});


// Recupera uma lista específica
app.get('/list/:id', (req, res) => {
  const id = req.params.id;

  // Falta a lógica para recuperar a lista com o ID fornecido do banco de dados

  // Exemplo de como recuperar uma lista por ID
  const lista = new List(id, 'Nome da lista', []);
  res.json(lista);
});

// Atualiza uma lista
app.put('/list/:id', (req, res) => {
  const id = req.params.id;
  const { name, itens } = req.body;

  // Falta a lógica para atualizar a lista com o ID fornecido no banco de dados

  // Exemplo de como atualizar uma lista
  const listaAtualizada = new List(id, name, itens);
  res.json(listaAtualizada);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
