const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const senhaParaToken = require('../segredo');

// Verificação do token.
const verificaLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(404).json({mensagem: 'Token não informado'});
    }

    try {
        // Inserindo os dados do usuário no corpo da requisição através do Bearer token.
        const token = authorization.replace('Bearer', '').trim();


        const { id } = jwt.verify(token, senhaParaToken);

        const query = 'select * from usuarios where id = $1';
        const { rows, rowCount } = await conexao.query(query, [id]);

        if (rowCount === 0) {
            return res.status(404).json({mensagem: 'O usuário não foi encontrado'});
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json({mensagem: error.message});
    }
}

module.exports = verificaLogin;