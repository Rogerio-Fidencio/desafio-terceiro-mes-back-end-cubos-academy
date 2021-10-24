const conexao = require('../conexao');

// Listar produtos.
const listarProdutos = async (req, res) => {
    const { id } = req.usuario;

    try {
        const query = 'select * from produtos where usuario_id = $1';
    
        const { rows } = await conexao.query(query, [id]);
        const listaDeProdutos = rows;

        return res.status(200).json(listaDeProdutos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

// Cadastrar produto.
const cadastrarProduto = async (req, res) => {
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body;
    const { id } = req.usuario;

    // Verificação do corpo da requisição.
    if (!nome) {
        return res.status(404).json({mensagem: 'O nome é obrigatório.'});
    }
    if (!quantidade) {
        return res.status(404).json({mensagem: 'A quantidade é obrigatória.'});
    }
    if (!preco) {
        return res.status(404).json({mensagem: 'O preço é obrigatório.'});
    }
    if (!descricao) {
        return res.status(404).json({mensagem: 'A descrição é obrigatória.'});
    }

    try {
        // Cadastro do produto.
        const query = 'insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)'

        const { rowCount } = await conexao.query(query, [id, nome, quantidade, categoria, preco, descricao, imagem]);

        if (rowCount === 0) {
            return res.status(400).json({mensagem: 'Não foi possível cadastrar o produto.'});
        }

        return res.status(201).json();
    } catch (error) {
        return res.status(400).json({mensagem: error.message});
    }
}

// Detalhar produto por ID.
const detalharProduto = async (req, res) => {
    const idProduto = req.params.id;
    const idUsuario = req.usuario.id;

    try {
        const query = 'select * from produtos where id = $1';
        const { rows, rowCount } = await conexao.query(query, [idProduto]);
        const produto = rows[0];

        if (rowCount === 0) {
            return res.status(404).json({mensagem: `Não existe produto cadastrado com ID ${idProduto}.`});
        }

        if (produto.usuario_id !== idUsuario) {
            return res.status(403).json({mensagem: 'O usuário logado não tem permissão para acessar este produto.'});
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json({mensagem: error.message});
    }

}

// Atualizar produto.
const atualizarProduto = async (req, res) => {
    const {nome, quantidade, categoria, preco, descricao, imagem} = req.body;
    const idProduto = req.params.id;
    const idUsuario = req.usuario.id;

    // Verificação do corpo da requisição.
    if (!nome) {
        return res.status(404).json({mensagem: 'O nome é obrigatório.'});
    }
    if (!quantidade) {
        return res.status(404).json({mensagem: 'A quantidade é obrigatória.'});
    }
    if (!preco) {
        return res.status(404).json({mensagem: 'O preço é obrigatório.'});
    }
    if (!descricao) {
        return res.status(404).json({mensagem: 'A descrição é obrigatória.'});
    }

    try {
        // Verificação se o produto existe e se pertence ao usuário logado.
        const queryProduto = 'select * from produtos where id = $1';
        const { rows, rowCount } = await conexao.query(queryProduto, [idProduto]);

        if (rowCount === 0) {
            return res.status(404).json({mensagem: `Não existe produto cadastrado com ID ${idProduto}.`});
        }

        if (rows[0].usuario_id !== idUsuario) {
            return res.status(403).json({mensagem: 'O usuário logado não tem permissão para acessar este produto.'});
        }

        // Atualização do produto.
        const query = 'update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7';

        const produtoAtualizado = await conexao.query(query, [nome, quantidade, categoria, preco, descricao, imagem, idProduto]);

        if (produtoAtualizado.rowCount === 0) {
            return res.status(400).json({mensagem: 'Não foi possivel atualizar o produto.'});
        }

        return res.status(204).json();
    } catch (error) {
        return res.status(400).json({mensagem: error.message});
    }

}

const excluirProduto = async (req, res) => {
    const idProduto = req.params.id;
    const idUsuario = req.usuario.id;

    try {
        // Verificação se o produto existe e se pertence ao usuário logado.
        const queryProduto = 'select * from produtos where id = $1';
        const { rows, rowCount } = await conexao.query(queryProduto, [idProduto]);
    
        if (rowCount === 0) {
            return res.status(404).json({mensagem: `Não existe produto cadastrado com ID ${idProduto}.`});
        }
    
        if (rows[0].usuario_id !== idUsuario) {
            return res.status(403).json({mensagem: 'O usuário logado não tem permissão para acessar este produto.'});
        }

        // Exclusão do produto.
        const query = 'delete from produtos where id = $1';
        const produtoExcluido = await conexao.query(query, [idProduto]);

        return res.status(204).json();
    } catch (error) {
        return res.status(400).json({mensagem: error.message});
    }
}

module.exports = { listarProdutos, cadastrarProduto, detalharProduto, atualizarProduto, excluirProduto };