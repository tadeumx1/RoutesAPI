const Route = require('../models/Route')

// RoutesController

module.exports = {

    async index (req, res) {

        try {

            // O populate é a função de eager loading do Mongo assim
            // na hora de listar as informações do usuário que criou o projeto
            // ao invés de fazer muitas queries só vai ter duas queries uma 
            // para os projetos e outra para buscar os usuários daqueles projetos

            const routes = await Route.find().populate('author', '-password');
        
            return res.send({ routes });
    
    
        } catch (err) {
    
            return res.status(400).send({ error: 'Error loading routes' })
    
        }
    

    },

    async show (req, res) {

        try {

            const route = await Route.findById(req.params.id).populate('author', '-password');

            return res.json(route)

        } catch (err) {

            return res.status(400).send({ error: 'Error loading' })

        }

    },

    async store (req, res) {

        // Temos que cadastrar o anúncio com todas as suas informações
        // Para cadastrar seu autor vamos usar o usuário que vai estar logado

        try {

            const route = await Route.create({ ...req.body, author: req.userId })

            return res.json(route)

        } catch (err) {

            return res.status(400).send({ error: 'Error creating route' })

        }

    },

    async update (req, res) {


        try {

            // O método findByIdAndUpdate recebe o ID do que queremos autalizar
            // também as informações 

            const route = await Route.findByIdAndUpdate(req.params.id, req.body, {

                new: true

            }).populate('author', '-password');

            // O new true vai fazer com que depois dele dar o update colocar as informações
            // que foram atualizadas no Ad para ser possível retornar para o usuário

            return res.json(route)

        } catch (err) {

            return res.status(400).send({ error: 'Error updating' })

        }

    },

    async destroy (req, res ) {

        try {

            await Route.findOneAndDelete(req.params.id)

            return res.send()

        } catch (err) {

            return res.status(400).send({ error: 'Error deleting' })

        }

    }

}