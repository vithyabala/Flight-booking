import { Booking } from '../models/bookingSchema.js';

export const bookTicket = async (req, res) => {
  const user = req.user.id; // Get from JWT payload

  const { flight, flightName, flightId, departure, destination,
    email, mobile, passengers, totalPrice, journeyDate, journeyTime, seatClass } = req.body;

  try {
    const bookings = await Booking.find({ flight, journeyDate, seatClass });
    const numBookedSeats = bookings.reduce((acc, booking) => acc + booking.passengers.length, 0);

    // Example max seats per flight/class - adjust accordingly
    const MAX_SEATS = 100; 
    if (numBookedSeats + passengers.length > MAX_SEATS) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    let seats = "";
    const seatCode = { 'economy': 'E', 'premium-economy': 'P', 'business': 'B', 'first-class': 'A' };
    const coach = seatCode[seatClass];

    for (let i = numBookedSeats + 1; i < numBookedSeats + passengers.length + 1; i++) {
      seats += (seats === "" ? "" : ", ") + coach + '-' + i;
    }

    const booking = new Booking({
      user,
      flight,
      flightName,
      flightId,
      departure,
      destination,
      email,
      mobile,
      passengers,
      totalPrice,
      journeyDate,
      journeyTime,
      seatClass,
      seats
    });

    await booking.save();

    res.status(201).json({ message: 'Booking successful!!', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while booking' });
  }
};

export const cancelTicket = async (req, res) => {
  const id = req.params.id;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while cancelling booking' });
  }
};
