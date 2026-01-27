import { useState } from "react";
import api from "../api/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/forgot-password", { email });
      setMessage("Password reset email sent. Check your inbox.");
      setError("");
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
      setMessage("");
    }
  };

  const containerStyle = {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "#ffffff", // White background
    color: "#333333", // Dark text
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #cccccc",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    color: "#333333",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff", // Blue button
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const messageStyle = {
    marginTop: "10px",
    color: "green",
  };

  const errorStyle = {
    marginTop: "10px",
    color: "red",
  };

  return (
    <div style={containerStyle}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          Send Reset Email
        </button>
      </form>
      {message && <p style={messageStyle}>{message}</p>}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
