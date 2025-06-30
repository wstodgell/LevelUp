// src/views/Signup.js
import React, { useState } from "react";
import axios from "axios";
import "../App.css"; // Ensure global styles apply
import "../components/FormCard.css"; // Ensure FormCard is styled

function SignUp({ setActiveComponent }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError(""); // Clear any previous errors

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        username,
        email,
        password,
      });

      console.log("User created:", response.data.user);
      setActiveComponent("Login"); // Move to login screen after successful signup
    } catch (err) {
      console.error("Signup failed:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error); // Show backend validation error
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="form-card">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Username *</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Email Address *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Confirm Password *</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-text">{error}</div>}

        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>

      <div className="login-footer">
        <button
          onClick={() => setActiveComponent("Login")}
          className="link-button"
        >
          Already have an account?
        </button>
      </div>
    </div>
  );
}

export default SignUp;
