const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const client = require('./db').default;
const List = require('./api/List');
const Item = require('./api/Item');
const User = require('./api/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Cria uma lista
app.post('/listas', (req, res) => {
  const { name, itens } = req.body;

  // Falta a lógica para persistir a lista no banco de dados

  // Exemplo de código para inserção de uma nova lista
  const novaLista = new List(1, name, itens);
  res.json(novaLista);
});

// Recupera todas as listas
app.get('/listas', (req, res) => {
  // Falta a lógica para recuperar todas as listas do banco de dados

  // Exemplo de como recuperar todas as listas
  const lista1 = new List(1, 'Lista da feira', []);
  const lista2 = new List(2, 'Lista de roupas', []);
  res.json([lista1, lista2]);
});

// Recupera uma lista específica
app.get('/listas/:id', (req, res) => {
  const id = req.params.id;

  // Falta a lógica para recuperar a lista com o ID fornecido do banco de dados

  // Exemplo de como recuperar uma lista por ID
  const lista = new List(id, 'Nome da lista', []);
  res.json(lista);
});

// Atualiza uma lista
app.put('/listas/:id', (req, res) => {
  const id = req.params.id;
  const { name, itens } = req.body;

  // Falta a lógica para atualizar a lista com o ID fornecido no banco de dados

  // Exemplo de como atualizar uma lista
  const listaAtualizada = new List(id, name, itens);
  res.json(listaAtualizada);
});

// Excluir uma lista
app.delete('/listas/:id', (req, res) => {
  const id = req.params.id;

  // Falta a lógica para excluir a lista com o ID fornecido do banco de dados

  res.sendStatus(204); // Resposta de sucesso 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
