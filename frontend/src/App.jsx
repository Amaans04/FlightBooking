import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchFlights from "./pages/SearchFlights";
import AIAssistant from "./pages/AIAssistant";
import Login from "./pages/Login";
import BookFlight from "./pages/BookFlight";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchFlights />} />
        <Route path="/ai" element={<AIAssistant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book" element={<BookFlight />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;