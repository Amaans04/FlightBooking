import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/ai`,
        { question: input }
      );

      const botMessage = {
        type: "bot",
        text: res.data.answer,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        type: "bot",
        text: "AI service failed."
      }]);
    }

    setLoading(false);
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container">
      <h2>AI Travel Assistant</h2>

      <div style={chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...bubble,
              alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
              background: msg.type === "user" ? "#3b82f6" : "#334155"
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && <p>Thinking...</p>}
        <div ref={chatRef} />
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          style={{ ...inputStyle, flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about refund policy..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const chatBox = {
  display: "flex",
  flexDirection: "column",
  minHeight: "350px",
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  overflowY: "auto"
};

const bubble = {
  padding: "10px 15px",
  borderRadius: "10px",
  marginBottom: "10px",
  maxWidth: "70%"
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  marginRight: "10px"
};

export default AIAssistant;