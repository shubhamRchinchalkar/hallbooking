const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    customerName : String,
    date : String,
    startTime : String,
    endTime : String,
    roomId : { type : mongoose.Schema.Types.ObjectId, ref:'Room' }
})

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking