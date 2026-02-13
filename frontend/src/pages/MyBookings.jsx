import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/bookings?userId=${user._id}`);
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="container">
        <h2>My Bookings</h2>
        <p>You need to login to see your bookings.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>My Bookings</h2>
      {loading && <p>Loading bookings...</p>}
      {bookings.length === 0 && !loading && <p>No bookings yet.</p>}

      {bookings.map((b) => (
        <div key={b._id} className="card">
          <h3>{b.flightId?.flightNumber}</h3>
          <p>
            {b.flightId?.source} → {b.flightId?.destination}
          </p>
          <p>Seats booked: {b.seatsBooked}</p>
          <p>
            Booked on:{" "}
            {new Date(b.bookingTime).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;

