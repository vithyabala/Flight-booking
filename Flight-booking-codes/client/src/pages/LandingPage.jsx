import React, { useContext, useEffect, useState } from 'react'
import '../styles/LandingPage.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const LandingPage = () => {
  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userType') === 'admin') {
      navigate('/admin');
    } else if (localStorage.getItem('userType') === 'flight-operator') {
      navigate('/flight-admin');
    }
  }, [navigate]);

  const [Flights, setFlights] = useState([]);

  const fetchFlights = async () => {
    if (checkBox) {
      if (departure && destination && departureDate && returnDate) {
        const date = new Date();
        const date1 = new Date(departureDate);
        const date2 = new Date(returnDate);

        if (date1 > date && date2 > date1) {
          setError("");
          await axios.get('http://localhost:6001/fetch-flights')
            .then((res) => setFlights(res.data));
        } else {
          setError("Please check the dates");
        }
      } else {
        setError("Please fill all the inputs");
      }
    } else {
      if (departure && destination && departureDate) {
        const date = new Date();
        const date1 = new Date(departureDate);

        if (date1 >= date) {
          setError("");
          await axios.get('http://localhost:6001/fetch-flights')
            .then((res) => setFlights(res.data));
        } else {
          setError("Please check the dates");
        }
      } else {
        setError("Please fill all the inputs");
      }
    }
  };

  const { setTicketBookingDate } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');

  const handleTicketBooking = (id, origin, destinationCity) => {
    if (userId) {
      if (origin === departure) {
        setTicketBookingDate(departureDate);
      } else if (destinationCity === departure) {
        setTicketBookingDate(returnDate);
      }
      navigate(`/book-flight/${id}`);
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="landingPage">
      <div className="landingHero">

        {/* Hero Title */}
        <div className="landingHero-title">
          <h1 className="banner-h1">Find the Perfect Flight for Your Next Trip!!</h1>
          <p className="banner-p">
            Unleash your travel desires and explore unforgettable destinations.
          </p>
        </div>

        {/* Search Container */}
        <div className="Flight-search-container">

          {/* Custom Toggle Switch */}
          <div className="toggle-container">
            <span>One Way</span>

            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={checkBox}
                onChange={(e) => setCheckBox(e.target.checked)}
              />
              <span className="slider"></span>
            </label>

            <span>Round Trip</span>
          </div>

          {/* Search Inputs */}
          <div className='Flight-search-container-body'>

            <div className="form-floating">
              <select className="form-select" value={departure}
                onChange={(e) => setDeparture(e.target.value)}>
                <option value="" disabled>Select</option>
                {["Chennai", "Banglore", "Hyderabad", "Mumbai", "Indore", "Delhi", "Pune", "Trivendrum", "Bhopal", "Kolkata", "Varanasi", "Jaipur"]
                  .map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              <label>Departure City</label>
            </div>

            <div className="form-floating">
              <select className="form-select" value={destination}
                onChange={(e) => setDestination(e.target.value)}>
                <option value="" disabled>Select</option>
                {["Chennai", "Banglore", "Hyderabad", "Mumbai", "Indore", "Delhi", "Pune", "Trivendrum", "Bhopal", "Kolkata", "Varanasi", "Jaipur"]
                  .map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              <label>Destination City</label>
            </div>

            <div className="form-floating">
              <input type="date" className="form-control"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
              <label>Journey date</label>
            </div>

            {checkBox &&
              <div className="form-floating">
                <input type="date" className="form-control"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
                <label>Return date</label>
              </div>
            }

            <button className="btn btn-primary search-btn" onClick={fetchFlights}>
              Search
            </button>
          </div>

          <p className="error-text">{error}</p>
        </div>

        {/* Available Flights */}
        {Flights.length > 0 && (
          <div className="availableFlightsContainer">
            <h1>Available Flights</h1>
            <div className="Flights">
              {Flights
                .filter(f =>
                  checkBox
                    ? (f.origin === departure && f.destination === destination) ||
                    (f.origin === destination && f.destination === departure)
                    : f.origin === departure && f.destination === destination
                )
                .map((Flight) => (
                  <div className="Flight" key={Flight._id}>
                    <div>
                      <p><b>{Flight.flightName}</b></p>
                      <p><b>Flight Number:</b> {Flight.flightId}</p>
                    </div>
                    <div>
                      <p><b>Start:</b> {Flight.origin}</p>
                      <p><b>Departure Time:</b> {Flight.departureTime}</p>
                    </div>
                    <div>
                      <p><b>Destination:</b> {Flight.destination}</p>
                      <p><b>Arrival Time:</b> {Flight.arrivalTime}</p>
                    </div>
                    <div>
                      <p><b>Price:</b> {Flight.basePrice}</p>
                      <p><b>Seats:</b> {Flight.totalSeats}</p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleTicketBooking(Flight._id, Flight.origin, Flight.destination)}
                    >
                      Book Now
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>

      {/* About Section */}
      <section id="about" className="section-about p-4">
        <div className="container">
          <h2 className="section-title">About Us</h2>
          <p className="section-description">
            We're Changing Flight Booking

            Tired of confusing airline websites? Frustrated with hidden fees? Done with
            endless clicking?

            So were we. That's why we built SB Flights.

            We're not just another booking platform. We're a complete rethinking of how
            flight booking should work in 2024.

            The SB Difference
            → Lightning-fast search across all airlines
            → Real-time pricing with zero surprises
            → One-click booking (yes, really)
            → AI-powered recommendations
            → Instant confirmation & mobile boarding passes

            No tricks. No gimmicks. Just honest, efficient flight booking.

            Your next adventure is one search away.
          </p>

          <span><h5>2025 AerovistaConnect - © All rights reserved</h5></span>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
