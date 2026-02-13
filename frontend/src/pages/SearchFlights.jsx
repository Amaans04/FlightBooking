import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchFlights() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchFlights = async () => {
    if (!source || !destination) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5050/api/flights?source=${source}&destination=${destination}`
      );
      const data = Array.isArray(res.data) ? res.data : [];
      // Sort by price ascending for a nicer UX
      data.sort((a, b) => Number(a.price) - Number(b.price));
      setFlights(data);
    } catch (err) {
      alert("Error fetching flights");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>Search Flights</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={inputStyle}
        />
        <button onClick={searchFlights}>Search</button>
      </div>

      {loading && <p>Loading flights...</p>}

      {!loading && flights.length === 0 && (
        <p>No flights found. Try different cities.</p>
      )}

      {flights.map((flight) => (
        <div key={flight._id} className="card">
          <h3>
            {flight.flightNumber || "Flight"} – {flight.source} →{" "}
            {flight.destination}
          </h3>

          {flight.departureTime && flight.arrivalTime && (
            <p style={{ marginTop: "4px", fontSize: "0.9rem", opacity: 0.85 }}>
              Depart:{" "}
              {new Date(flight.departureTime).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              | Arrive:{" "}
              {new Date(flight.arrivalTime).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}

          <p style={{ marginTop: "8px" }}>
            <strong>Price:</strong>{" "}
            ₹ {flight.price}
          </p>

          <p>
            <strong>Seats Available:</strong>{" "}
            {flight.seatsAvailable}
          </p>

          <button
            style={{ marginTop: "10px" }}
            onClick={() => navigate("/book", { state: { flight } })}
          >
            Book
          </button>
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none"
};

export default SearchFlights;