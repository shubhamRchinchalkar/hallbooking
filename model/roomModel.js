const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    seats : Number,
    amenities: String,
    price: Number
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room