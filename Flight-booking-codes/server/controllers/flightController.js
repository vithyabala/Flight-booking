import { Flight } from '../models/flightSchema.js';
import { Booking } from '../models/bookingSchema.js';

export const addFlight = async (req, res)=>{
        const {flightName, flightId, origin, destination, departureTime, 
                                arrivalTime, basePrice, totalSeats} = req.body;
        try{

            const flight = new Flight({flightName, flightId, origin, destination, 
                                        departureTime, arrivalTime, basePrice, totalSeats});
            const newFlight = flight.save();

            res.json({message: 'flight added'});

        }catch(err){
            console.log(err);
        }
    }

export const updateFlight = async (req, res)=>{
        const {_id, flightName, flightId, origin, destination, 
                    departureTime, arrivalTime, basePrice, totalSeats} = req.body;
        try{

            const flight = await Flight.findById(_id)

            flight.flightName = flightName;
            flight.flightId = flightId;
            flight.origin = origin;
            flight.destination = destination;
            flight.departureTime = departureTime;
            flight.arrivalTime = arrivalTime;
            flight.basePrice = basePrice;
            flight.totalSeats = totalSeats;

            const newFlight = flight.save();

            res.json({message: 'flight updated'});

        }catch(err){
            console.log(err);
        }
    }

export const fetchFlight = async (req, res)=>{
        
        try{
            const flights = await Flight.find();
            res.json(flights);

        }catch(err){
            console.log(err);
        }
    }

export const fetchFlightById =  async (req, res)=>{
        const id = await req.params.id;
        console.log(req.params.id)
        try{
            const flight = await Flight.findById(req.params.id);
            console.log(flight);
            res.json(flight);

        }catch(err){
            console.log(err);
        }
    }

export const fetchBookings =  async (req, res)=>{
        
        try{
            const bookings = await Booking.find();
            res.json(bookings);

        }catch(err){
            console.log(err);
        }
    }