const Marker = require('../models/Marker')

// MarkerController

module.exports = {

    async index (req, res) {

        try {

            // O populate é a função de eager loading do Mongo assim
            // na hora de listar as informações do usuário que criou o projeto
            // ao invés de fazer muitas queries só vai ter duas queries uma 
            // para os projetos e outra para buscar os usuários daqueles projetos

            const markers = await Marker.find().populate('author', '-password');
        
            return res.send({ markers }); 
    
    
        } catch (err) {
    
            return res.status(400).send({ error: 'Error loading markers' })
    
        }
    
    },

    async show (req, res) {

        try {

            const marker = await Marker.findById(req.params.id).populate('author', '-password')

            return res.json(marker)
        
        } catch (err) {

            return res.status(400).send({ error: 'Error loading' })

        }

    },

    async store (req, res) {

        // Temos que cadastrar o anúncio com todas as suas informações
        // Para cadastrar seu autor vamos usar o usuário que vai estar logado

        try {

            const marker = await Marker.create({ ...req.body, author: req.userId })

            return res.json(marker)

        } catch (err) {

            return res.status(400).send({ error: 'Error creating marker' })

        }

    },

    async update (req, res) {

        try {

            // O método findByIdAndUpdate recebe o ID do que queremos autalizar
            // também as informações 

            const marker = await Marker.findByIdAndUpdate(req.params.id, req.body, {

                new: true

            })

            // O new true vai fazer com que depois dele dar o update colocar as informações
            // que foram atualizadas no Ad para ser possível retornar para o usuário

            return res.json(marker)

        } catch (err) {

            return res.status(400).send({ error: 'Error updating marker' })

        }

    },

    async destroy (req, res ) {

        try {

            // await Marker.findOneAndDelete(req.params.id)

            // return res.send()

            await Marker.findById(req.params.id)
            .remove()
            .exec( error => { // Reply to the client, otherwise the request will hang and timeout.
             if(error) {
                return res.status(500).send(error); 
             }

             res.status(200).end()
             
            })

        } catch(err) {

            return res.status(400).send({ error: 'Error deleting marker' })

        }

    }

}