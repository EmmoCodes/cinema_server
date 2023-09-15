import express from 'express'
import nodemailer from 'nodemailer'
import 'dotenv/config'
import cors from 'cors'

const PORT = 9999
const app = express()

const transport = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,
  auth: {
    user: process.env.USER_ID,
    pass: process.env.USER_PW,
  },
})

app.use(cors())
app.use(express.json())

const send = () => {
  const mail = {
    from: 'system@cineplex.de',
    to: 'order@cineplex.de',
    subject: 'Neuer Auftrag im System',
    text: 'Wir haben einen neuen Besucher',
  }
  transport
    .sendMail(mail)
    .then(result => console.error(result))
    .catch(err => console.log(err))
}

const seats = []
const reservedSeats = []

for (let i = 1; i <= 12; i++) {
  const seat = {
    id: i,
    type: 'loge',
    price: 12,
    reserved: false,
  }
  seats.push(seat)
}

for (let i = 13; i <= 24; i++) {
  const seat = {
    id: i,
    type: 'parkett',
    price: 10,
    reserved: false,
  }
  seats.push(seat)
}

app.put('/api/seats', (req, res) => {
  const reservatedSeat = req.body.id

  const seat = seats.find(s => s.id === reservatedSeat)

  seat.reserved = req.body.reserved

  const filteredSeats = seats.filter(arr => arr.reserved)
  reservedSeats.length = 0
  filteredSeats.forEach(seat => reservedSeats.push(seat))

  send()
  res.json(seat)
})

app.get('/api/seats', (_, res) => {
  res.json(seats)
})

app.get('/api/reserved', (_, res) => {
  res.json(reservedSeats)
})

app.post('/api/reserved', (req, res) => {
  seats.forEach(seat => (seat.reserved = false))
  reservedSeats.length = 0
  res.end()
})

app.listen(PORT, () => console.log('im listening on:', PORT))
