const Flight = require("../models/Flight");
const dynamicPricing = require("../services/pricingService");

exports.createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFlights = async (req, res) => {
  const { source, destination } = req.query;

  const flights = await Flight.find({ source, destination });

  const updatedFlights = flights.map(flight => ({
    ...flight.toObject(),
    price: dynamicPricing(flight.price, flight.seatsAvailable)
  }));

  res.json(updatedFlights);
};