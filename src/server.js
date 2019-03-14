require('dotenv').config()
const express = require('express');
const mongoose = require ('mongoose');
const Youch = require('youch')
const validate = require('express-validation');
const databaseConfig = require('./config/database');

class App {

    constructor() {

        this.express = express()
        this.isDev = process.env.NODE_ENV =! 'production'

        this.database()
        this.middlewares()
        this.routes()
        this.exception()

    }

    database() {

        // mongodb://usuario:senha@localhost:27017/nomedatabase

        mongoose.connect(databaseConfig.uri, { 
            useCreateIndex: true,
            useNewUrlParser: true
        });
        
    }

    middlewares() {

        this.express.use(express.json())

    }

    routes () {

        this.express.use(require('./routes'))

    }

    exception() {

        // Toda vez que o Middleware tiver quatros parâmetros o Express sabe
        // que ele será usado para tratar erros

        this.express.use(async (err, req, res, next) => {

            if(err instanceof validate.ValidationError) {
                return res.status(err.status).json(err)
            }

            if(process.env.NODE_ENV != 'production')  {

                const youch = new Youch(err, req)

                return res.json(await youch.toJSON())

            }

            return res.status(err.status || 500).json({ error: 'Ìnternal Server Error' })

        })

    }

}

module.exports = new App().express