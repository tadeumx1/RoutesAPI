const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth') 

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,

    },

    password: {

        type: String,
        required: true,

    },

    passwordResetToken: {

        type: String,
        select: false,

    },

    passwordResetExpires: {

        type: Date,
        select: false, 

    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})

// No Sequelize e MongoDB existem os Hooks que ouvem as ações realizadas pelo
// usuário para ser possível manipular os dados

// Com o pre() definimos que um Hook aconteça antes de alguma ação

// Nesse caso ele sempre vai executar antes do Schema ser salvado e isso
// acontece quando ele é criado ou atualizado

// Não está sendo usada arrow function pois nesse caso o Mongoose no this vai
// dar o usuário com todas as suas informações

UserSchema.pre('save', async function (next) {

    // Caso a senha não foi modificada

    if(!this.isModified('password')) {

        // O método next() passa para um próximo Hook ou 
        // já salva as informações no banco de dados


        return next()
    }

    this.password = await bcrypt.hash(this.password, 8)

})

UserSchema.methods = {

    // Esse método compara a senha do usuário sem criptografia com a que está no
    // banco criptografada

    compareHash (password) {

        return bcrypt.compare(password, this.password)

    }

}

// Esse método é estático pois ele não vai ser chamado a partir
// de uma classe

// Ele vai ser chamado a patir desse model User

UserSchema.statics = {

    // Esse método vai gerar o token JWT que vai ser usado
    // para a autenticação da API

    // Estamos passando para o token o ID do usuário

    generateToken ({ id }) {

        return jwt.sign({ id }, authConfig.secret, {
            expiresIn: authConfig.ttl,
        })

    }

}

module.exports = mongoose.model('User', UserSchema)