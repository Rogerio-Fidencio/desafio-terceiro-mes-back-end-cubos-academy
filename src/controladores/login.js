const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaParaToken = require('../segredo');

const login = async (req, res) => {
    const {email, senha} = req.body;

    // Verificação do corpo da requisição.
    if (!email || !senha) {
        res.status(404).json({mensagem: 'Email e senha são obrigatórios.'});
    }

    try {
        // Verificação de email.
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rows, rowCount } = await conexao.query(queryConsultaEmail, [email]);
    
        if (rowCount === 0) {
            return res.status(404).json({mensagem: 'Email não encontrado'});
        }

        // Verificação de senha.
        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if (!senhaVerificada) {
            return res.status(400).json({mensagem: 'Email ou senha incorreto.'});
        }

        // Criação de token.
        const token = jwt.sign({ id: usuario.id }, senhaParaToken, {expiresIn: '1d'});

        // Retorno do token para o usuário
        const {senha: senhaUsuario, ...dadosUsuario} = usuario;
        
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(400).json({mensagem: error.message});
    }

}

module.exports = { login };