import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

function BookFlight() {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;
  const [seats, setSeats] = useState(1);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!flight) {
    return (
      <div className="container">
        <h2>No flight selected</h2>
        <button onClick={() => navigate("/")}>Back to search</button>
      </div>
    );
  }

  const handleBook = async () => {
    if (!user) {
      alert("Please login before booking.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/bookings`, {
        userId: user._id,
        flightId: flight._id,
        seatsBooked: seats,
      });
      alert("Booking successful!");
      navigate("/my-bookings");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to book ticket");
    }
  };

  return (
    <div className="container">
      <h2>Book Flight</h2>
      <div className="card">
        <h3>{flight.flightNumber}</h3>
        <p>
          {flight.source} → {flight.destination}
        </p>
        <p>
          Price: ₹{" "}
          {Number(flight.price).toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}
        </p>
        <p>Seats Available: {flight.seatsAvailable}</p>
      </div>

      <div style={{ maxWidth: 300 }}>
        <label>
          Seats:
          <input
            type="number"
            min="1"
            max={flight.seatsAvailable}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            style={{
              marginLeft: "10px",
              padding: "6px",
              borderRadius: "6px",
              border: "none",
              outline: "none",
            }}
          />
        </label>
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={handleBook}>Confirm Booking</button>
      </div>
    </div>
  );
}

export default BookFlight;

