const express = require('express');
const { login } = require('../src/controladores/login');
const { cadastrarUsuario, obterUsuario, atualizarUsuario } = require('../src/controladores/usuarios');
const { listarProdutos, cadastrarProduto, detalharProduto, atualizarProduto, excluirProduto } = require('../src/controladores/produtos');
const verificaLogin = require('../src/filtros/verificarLogin');
const rotas = express();

// Cadastro de usuário.
rotas.post('/usuarios', cadastrarUsuario);


// Login.
rotas.post('/login', login);


// Verificar login.
rotas.use(verificaLogin);


// Obter dados de usuário.
rotas.get('/usuario', obterUsuario);

// Atualizar dados do usuário.
rotas.put('/usuario', atualizarUsuario);

// Cadastrar produto.
rotas.post('/produtos', cadastrarProduto);

// Listar produtos do usuário.
rotas.get('/produtos', listarProdutos);

// Detalhar produto.
rotas.get('/produtos/:id', detalharProduto);

// Atualizar produto.
rotas.put('/produtos/:id', atualizarProduto);

// Excluir produto.
rotas.delete('/produtos/:id', excluirProduto);

module.exports = rotas;