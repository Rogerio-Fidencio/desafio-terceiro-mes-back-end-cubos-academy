const conexao = require('../conexao');
const bcrypt = require('bcrypt');


// Cryptografar senha.
const cryptografarSenha = async (senha) => {
    const senhaCryptografada = await bcrypt.hash(senha, 10);
    return senhaCryptografada;
}


// Cadastro de usuário.
const cadastrarUsuario = async (req, res) => {
    const {nome, nomeLoja, email, senha} = req.body;

    // Verificação do corpo da requisição.
    if (!nome) {
        return res.status(404).json({mensagem: 'O nome é obrigatório.'});
    }
    if (!nomeLoja) {
        return res.status(404).json({mensagem: 'O nome da loja é obrigatório.'});
    }
    if (!email) {
        return res.status(404).json({mensagem: 'O email é obrigatório.'});
    }
    if (!senha) {
        return res.status(404).json({mensagem: 'A senha é obrigatória.'});
    }

    
    try {
        // Verificação de E-Mail.
        const queryConsultaEmail = 'select * from usuarios where email = $1';

        const { rowCount } = await conexao.query(queryConsultaEmail, [email]);

        if (rowCount > 0) {
            return res.status(400).json({mensagem: 'Email já cadastrado.'});
        }

        // Cryptografia da senha.
        const senhaCryptografada = await cryptografarSenha(senha);

        // Criação do usuário.
        const query = 'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)'

        const usuarioCadastrado = await conexao.query(query, [nome, nomeLoja, email, senhaCryptografada]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(400).json({mensagem: 'Não foi possivel cadastrar usuário.'});
        }

        return res.status(201).json({mensagem: 'Usuário cadastrado com sucesso.'});
    } catch (error) {
        return res.status(400).json({mensagem: error.message});
    }

}

// Obter dados do usuário.
const obterUsuario = async (req, res) => {
    const usuario = req.usuario;

    try {
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(400).json({mensagem: error.message});
    }
}

// Atualizar usuário.
const atualizarUsuario = async (req, res) => {
    const {nome, nomeLoja, email, senha} = req.body;
    const { id } = req.usuario;

    // Verificação do corpo da requisição.
    if (!nome) {
        return res.status(404).json({mensagem: 'O nome é obrigatório.'});
    }
    if (!nomeLoja) {
        return res.status(404).json({mensagem: 'O nome da loja é obrigatório.'});
    }
    if (!email) {
        return res.status(404).json({mensagem: 'O email é obrigatório.'});
    }
    if (!senha) {
        return res.status(404).json({mensagem: 'A senha é obrigatória.'});
    }

    try {
        // Verificação se o email existe em outro usuário, diferente da verificação padrão.
        const queryConsultaEmail = 'select * from usuarios where email = $1';

        const emailConsultado = await conexao.query(queryConsultaEmail, [email]);

        if (emailConsultado.rowCount > 0 && emailConsultado.rows[0].id !== id) {
            return res.status(400).json({mensagem: 'O email informado já está cadastrado'});
        }

        // Cryptografia da senha.
        const senhaCryptografada = await cryptografarSenha(senha);

        // Atualização do usuário.
        const query = 'update usuarios set nome = $1, nome_loja = $2, email = $3, senha = $4 where id = $5';

        const usuarioAtualizado = await conexao.query(query, [nome, nomeLoja, email, senhaCryptografada, id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(400).json({mensagem: 'Não foi possivel atualizar usuário.'});
        }

        return res.status(204).json();;
    } catch (error) {
        return res.status(400).json({mensagem: error.message});
    }

}

module.exports = { cadastrarUsuario, obterUsuario, atualizarUsuario};