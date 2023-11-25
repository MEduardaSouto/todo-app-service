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


// ----------------------- USER ----------------------------

// Recupera todos os usuários
app.get('/user', async (req, res) => {
  try {
    // Recupera todos os usuários do banco de dados
    const result = await client.query('SELECT * FROM users');
    const users = result.rows;
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao recuperar os usuários' });
  }
});

// Cria um novo usuário
app.post('/user', async (req, res) => {
  const { id, name, password } = req.body;

  try {
    // Insere o novo usuário no banco de dados
    const result = await client.query('INSERT INTO users (id, name, password) VALUES ($1, $2, $3) RETURNING *', [id, name, password]);
    const novoUsuarioDB = result.rows[0];

    // Cria uma instância da classe User com os dados do novo usuário
    const novoUsuario = new User(novoUsuarioDB.id, novoUsuarioDB.name, novoUsuarioDB.password);

    res.json(novoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o novo usuário' });
  }
});

// Autentica um usuário
app.post('/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verifica se o usuário existe no banco de dados e se a senha está correta
    const result = await client.query('SELECT * FROM users WHERE name = $1 AND password = $2', [username, password]);
    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Nome de usuário ou senha inválidos' });
    }

    // Cria uma instância da classe User com os dados do usuário autenticado
    const usuarioAutenticado = new User(usuario.id, usuario.name, usuario.password);

    res.json(usuarioAutenticado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao autenticar o usuário' });
  }
});

// Excluir um usuário
app.delete('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Exclui o usuário com o ID fornecido do banco de dados
    await client.query('DELETE FROM users WHERE id = $1', [userId]);

    res.sendStatus(204); // Resposta de sucesso
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir o usuário' });
  }
});


// ----------------------- lISTAS ----------------------------

// Recupera todas as listas de um usuário específico
app.get('/user/:userId/lists', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Recupera todas as listas do usuário com o ID fornecido do banco de dados
    const result = await client.query('SELECT * FROM lists WHERE user_id = $1', [userId]);
    const listas = result.rows;

    res.json(listas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao recuperar as listas do usuário' });
  }
});

// Cria uma lista para um usuário específico
app.post('/user/:userId/list', async (req, res) => {
  const userId = req.params.userId;
  const { id, name } = req.body;

  try {
    // Insere a nova lista no banco de dados associada ao usuário com o ID fornecido
    const result = await client.query('INSERT INTO lists (id, name, user_id) VALUES ($1, $2, $3) RETURNING *', [id, name, userId]);
    const novaListaDB = result.rows[0];

    // Cria uma instância da classe Lista com os dados da nova lista
    const novaLista = new List(novaListaDB.id, novaListaDB.name, []);

    res.json(novaLista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar a nova lista para o usuário' });
  }
});

// Excluir uma lista de um usuário específico
app.delete('/user/:userId/list/:listId', async (req, res) => {
  const userId = req.params.userId;
  const listId = req.params.listId;

  try {
    // Verifica se a lista pertence ao usuário antes de excluí-la
    const result = await client.query('SELECT * FROM lists WHERE id = $1 AND user_id = $2', [listId, userId]);
    const lista = result.rows[0];

    if (!lista) {
      return res.status(404).json({ error: 'Lista não encontrada para o usuário especificado' });
    }

    // Exclui a lista com o ID fornecido do banco de dados
    await client.query('DELETE FROM lists WHERE id = $1', [listId]);

    res.sendStatus(204); // Resposta de sucesso
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir a lista do usuário' });
  }
});



// ----------------------- ITENS ----------------------------


// Recupera os itens de uma lista específica de um usuário específico
app.get('/user/:userId/list/:listId/items', async (req, res) => {
  const userId = req.params.userId;
  const listId = req.params.listId;

  try {
    // Verifica se a lista pertence ao usuário antes de recuperar os itens
    const result = await client.query('SELECT * FROM lists WHERE id = $1 AND user_id = $2', [listId, userId]);
    const lista = result.rows[0];

    if (!lista) {
      return res.status(404).json({ error: 'Lista não encontrada para o usuário especificado' });
    }

    // Recupera os itens da lista do banco de dados
    const itemsResult = await client.query('SELECT * FROM items WHERE list_id = $1', [listId]);
    const itens = itemsResult.rows;

    res.json(itens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao recuperar os itens da lista do usuário' });
  }
});

// Cria um item em uma lista específica de um usuário específico
app.post('/user/:userId/list/:listId/item', async (req, res) => {
  const userId = req.params.userId;
  const listId = req.params.listId;
  const { id, name, value } = req.body;

  try {
    // Verifica se a lista pertence ao usuário antes de criar o item
    const result = await client.query('SELECT * FROM lists WHERE id = $1 AND user_id = $2', [listId, userId]);
    const lista = result.rows[0];

    if (!lista) {
      return res.status(404).json({ error: 'Lista não encontrada para o usuário especificado' });
    }

    // Insere o novo item no banco de dados associado à lista e ao usuário correspondentes
    await client.query('INSERT INTO items (id, name, value, list_id) VALUES ($1, $2, $3, $4)', [id, name, value, listId]);

    // Cria uma instância da classe Item com os dados do novo item
    const novoItem = new Item(id, name, value, listId);

    res.json(novoItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o novo item na lista do usuário' });
  }
});


// Excluir um item de uma lista específica de um usuário específico
app.delete('/user/:userId/list/:listId/item/:itemId', async (req, res) => {
  const userId = req.params.userId;
  const listId = req.params.listId;
  const itemId = req.params.itemId;

  try {
    // Verifica se a lista pertence ao usuário antes de excluir o item
    const result = await client.query('SELECT * FROM lists WHERE id = $1 AND user_id = $2', [listId, userId]);
    const lista = result.rows[0];

    if (!lista) {
      return res.status(404).json({ error: 'Lista não encontrada para o usuário especificado' });
    }

    // Exclui o item com o ID fornecido da lista e do banco de dados
    await client.query('DELETE FROM items WHERE id = $1 AND list_id = $2', [itemId, listId]);

    res.sendStatus(204); // Resposta de sucesso
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir o item da lista do usuário' });
  }
});

// Atualiza o status de isChecked de um item em uma lista específica de um usuário específico
app.put('/user/:userId/list/:listId/item/:itemId', async (req, res) => {
  const userId = req.params.userId;
  const listId = req.params.listId;
  const itemId = req.params.itemId;
  const { isChecked } = req.body;

  try {
    // Verifica se a lista pertence ao usuário antes de atualizar o item
    const result = await client.query('SELECT * FROM lists WHERE id = $1 AND user_id = $2', [listId, userId]);
    const lista = result.rows[0];

    if (!lista) {
      return res.status(404).json({ error: 'Lista não encontrada para o usuário especificado' });
    }

    // Atualiza o status de isChecked do item com o ID fornecido na lista e no banco de dados
    await client.query('UPDATE items SET is_checked = $1 WHERE id = $2 AND list_id = $3', [isChecked, itemId, listId]);

    res.sendStatus(200); // Resposta de sucesso
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o status do item na lista do usuário' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
