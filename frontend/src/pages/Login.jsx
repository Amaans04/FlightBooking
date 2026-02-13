import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (mode === "register" && !name)) return;
    setLoading(true);
    try {
      const url = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "register"
          ? { name, email, password }
          : { email, password };

      const res = await api.post(url, payload);
      const user = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      if (onLogin) onLogin(user);
      navigate("/");
    } catch (err) {
      alert(
        err.response?.data?.error ||
          (mode === "register" ? "Registration failed" : "Login failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>{mode === "register" ? "Create Account" : "Login"}</h2>

      <div style={{ marginBottom: "15px" }}>
        <button
          type="button"
          onClick={() => setMode("login")}
          style={{
            marginRight: "8px",
            background: mode === "login" ? "#3b82f6" : "#1e293b",
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          style={{
            background: mode === "register" ? "#3b82f6" : "#1e293b",
          }}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        {mode === "register" && (
          <div style={{ marginBottom: "10px" }}>
            <input
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                outline: "none",
              }}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div style={{ marginBottom: "10px" }}>
          <input
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
            }}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              outline: "none",
            }}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading
            ? mode === "register"
              ? "Registering..."
              : "Logging in..."
            : mode === "register"
            ? "Register"
            : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
