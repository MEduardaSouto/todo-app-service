const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const client = require('./db');
const List = require('./api/List');
const Item = require('./api/Item');
const User = require('./api/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

// Cria uma lista
app.post('/list', async (req, res) => {
  const { id, name } = req.body;

  try {
    // Insere a nova lista no banco de dados
    const result = await client.query('INSERT INTO lists (id, name) VALUES ($1, $2) RETURNING *', [id, name]);
    const novaListaDB = result.rows[0];

    // Cria uma instância da classe Lista com os dados da nova lista
    const novaLista = new List(novaListaDB.id, novaListaDB.name, []);

    res.json(novaLista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar a nova lista' });
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



// Recupera os itens de uma lista específica
app.get('/itens/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Recupera os itens da lista com o ID fornecido do banco de dados
    const result = await client.query('SELECT * FROM items WHERE list_id = $1', [id]);
    const itens = result.rows;

    res.json(itens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao recuperar os itens da lista' });
  }
});

// Cria um item em uma lista específica
app.post('/list/:listId/item', async (req, res) => {
  const listId = req.params.listId;
  const { id, name } = req.body;

  try {
    // Insere o novo item no banco de dados
    await client.query('INSERT INTO items (id, name, list_id) VALUES ($1, $2, $3)', [id, name, listId]);

    // Cria uma instância da classe Item com os dados do novo item
    const novoItem = new Item(id, name, listId);

    res.json(novoItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o novo item' });
  }
});

app.delete('/item/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Exclui a lista com o ID fornecido do banco de dados
    await client.query('DELETE FROM items WHERE id = $1', [id]);

    res.sendStatus(204); // Resposta de sucesso
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir a item' });
  }
});

// Atualiza o status de isChecked de um item
app.put('/item/:id', async (req, res) => {
  const id = req.params.id;
  const { isChecked } = req.body;

  try {
    // Atualiza o status de isChecked do item com o ID fornecido no banco de dados
    await client.query('UPDATE items SET is_checked = $1 WHERE id = $2', [isChecked, id]);

    res.sendStatus(200); // Resposta de sucesso
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o status do item' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
