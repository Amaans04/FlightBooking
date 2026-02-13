const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

// Create a new booking and decrement available seats
exports.createBooking = async (req, res) => {
  try {
    const { userId, flightId, seatsBooked } = req.body;

    if (!userId || !flightId || !seatsBooked) {
      return res
        .status(400)
        .json({ error: "userId, flightId and seatsBooked are required" });
    }

    const seats = Number(seatsBooked);
    if (!Number.isFinite(seats) || seats <= 0) {
      return res.status(400).json({ error: "seatsBooked must be > 0" });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ error: "Flight not found" });
    }

    if (flight.seatsAvailable < seats) {
      return res.status(400).json({ error: "Not enough seats available" });
    }

    const booking = await Booking.create({
      userId,
      flightId,
      seatsBooked: seats,
    });

    flight.seatsAvailable -= seats;
    await flight.save();

    return res.status(201).json({
      booking,
      flight,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ error: "Failed to create booking" });
  }
};

// Get bookings for a user
exports.getBookingsForUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId query param is required" });
    }

    const bookings = await Booking.find({ userId })
      .populate("flightId")
      .sort({ bookingTime: -1 });

    return res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

