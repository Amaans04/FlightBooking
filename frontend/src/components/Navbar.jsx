import { Link } from "react-router-dom";

function getInitials(user) {
  const name = user?.name || user?.email || "";
  if (!name) return "?";
  const parts = name.trim().split(" ");
  const first = parts[0]?.[0] || "";
  const second = parts[1]?.[0] || "";
  return (first + second).toUpperCase() || first.toUpperCase() || "?";
}

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>✈️ FlySmart</h2>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={styles.link}>
          Search
        </Link>
        <Link to="/ai" style={styles.link}>
          AI Assistant
        </Link>
        <Link to="/my-bookings" style={styles.link}>
          My Bookings
        </Link>
        {!user && (
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        )}
        {user && (
          <div style={{ display: "flex", alignItems: "center", marginLeft: "16px" }}>
            <div style={styles.avatar}>
              {getInitials(user)}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "#1e293b",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
  },
  logo: {
    margin: 0,
    color: "#3b82f6"
  },
  link: {
    marginLeft: "20px",
    textDecoration: "none",
    color: "white",
    fontWeight: "500"
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "9999px",
    background: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 600,
    fontSize: "0.8rem",
    textTransform: "uppercase",
    boxShadow: "0 0 0 2px rgba(15,23,42,0.8)",
  }
};

export default Navbar;