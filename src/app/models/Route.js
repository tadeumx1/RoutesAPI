const mongoose = require('mongoose')

const Route = new mongoose.Schema({

    name: {

        type: String, 
        required : true
    },

    description: {

        type: String, 
        required : true
    },

    type: {

        type: String, 
        required : true
        
    },

    distance: {

        type: Number,
        required: true,

    },

    duration: {

        // Minutos  

        type: Number,
        required: true

    },

    geo : {

        type : {type: String,
        default: "LineString"},
        coordinates : Array

    },

    author: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },

    createdAt: {

        type: Date,
        default: Date.now

    },

    updatedAt: {
        
        type: Date, 
        default: Date.now
    }

})

module.exports = mongoose.model('Route' , Route)