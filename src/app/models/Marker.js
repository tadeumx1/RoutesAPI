const mongoose = require('mongoose')

const MarkerLocation = require('./MarkerLocation')

/* const MarkerLocation = new mongoose.Schema({

    type: {
        type: String,
        enum: ['Point'],
        required: true
    },

    coordinates: {

        type: [Number],
        required: true
    },

}) */

const Marker = new mongoose.Schema({

    name: {

      type: String,
      required: true

    },

    location: {

      type: MarkerLocation,
      required: true

    },

    author: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },

    color: {

        type: String,
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

});

Marker.methods = {

    colorValidator (v) {

        if (v.indexOf('#') == 0) {
            if (v.length == 7) {  // #f0f0f0
                return true;
            } else if (v.length == 4) {  // #fff
                return true;
            }
        }

        return COLORS.indexOf(v) > -1;

    }

}

module.exports = mongoose.model('Marker', Marker);