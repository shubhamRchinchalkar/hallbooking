const express = require('express')
const bodyParser = require('body-parser')
const connectDB = require('./db')
const Room = require('./model/roomModel')
const Booking = require('./model/bookingModel')
const app = express()
const PORT = 3000

connectDB()
app.use(bodyParser.json())

app.get('/', async(req, res) => {
  res.json({ message : `application successful` })
})

//1. creating a room
app.post('/rooms', async (req, res) => {
   try {
    const { seats, amenities, price } = req.body;
    const room = new Room({ seats, amenities, price })
    await room.save()
    res.json({message : 'Room created successfully', room})
   } catch (error) {
    res.status(500).json({ error : 'Internal server error' })
   }
})

//2. Booking a room
app.post('/bookings', async (req, res) => {
    try {
       const { customerName, date, startTime, endTime, roomId } = req.body
       const room = await Room.findById(roomId)
       if(!room){
        return res.status(404).json({ error : 'Room not found' })
       }
       const booking = new Booking({
        customerName,
        date,
        startTime,
        endTime,
        roomId : room._id
       })
       await booking.save()
       res.json({ message : 'Room booked successfully', booking })
    } catch (error) {
      res.status(500).json({ error : 'Internal server error' })  
    }
})

//3. all rooms with booked data
app.get('/rooms/booked', async (req, res) => {
    try {
      const result = await Room.aggregate([
        {
          $lookup: {
            from: 'bookings',
            localField: '_id',
            foreignField: 'roomId',
            as: 'bookings',
          },
        },
      ]);
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

//4. List all customers with booked data
app.get('/customers/booked', async (req, res) => {
    try {
       const result = await Booking.find().populate('roomId', 'seats amenities price')
       res.json(result) 
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

//5. list how many times a customer has booked the room
app.get('/customer/bookings/:customerName', async (req, res) => {
    try {
        const customerName = req.params.customerName
        const result = await Booking.find({ customerName })
        .populate('roomId', 'seats amenities price')
        res.json(result)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})