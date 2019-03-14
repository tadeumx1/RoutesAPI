
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {

    const authHeader = req.headers.authorization

    if(!authHeader) {

        return res.status(401).json({ error: 'Token not provided' })

    }

    // Authorization: Bearer TOKEN

    // Agora vamos remover a palavra Bearer e só pegar o token
    // fazendo um split no authHeader

    const [, token] = authHeader.split(' ')

    try {

        // Verificando caso o token está correto
        // e pode ser usado

        // A função jwt.verify não retorna uma Promise então não é possível
        // utilizar o await com ela, assim teria que fazer com Callback 

        // Mas o Node tem uma funcionalidade nele que 
        // transforma as funções de padrão Callback em Promises automaticamente

        /* jwt.verify(token, authConfig.secret, () => {

        }) */

        // Usando o Promisify

        const decoded = await promisify(jwt.verify)(token, authConfig.secret)

        // Dentro do Decoded vai estar a informação que foi passada para gerar o token
        // Nesse caso vai ter um objeto com o ID do usuário

        // Aqui vamos colocar o ID do usuário que está acessando na req

        req.userId = decoded.id

        // O método next() vai passar para o próximo middleware ou para um Controller
        // da aplicação

        return next()

    } catch (err) {

        return res.status(401).json({ error: 'Token invalid' })

    }

}