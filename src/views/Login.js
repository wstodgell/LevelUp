import React, { useState } from "react";
import axios from "axios"; // Make sure axios is imported
import FormCard from "../components/FormCard";

function Login({ setActiveComponent, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log("Login ok:", res.data);
      onLoginSuccess(res.data); // <— send user data up to App
      setActiveComponent("Home");
    } catch (err) {
      console.error(err);
      alert("Login failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <FormCard title="Sign in with email">
      <form onSubmit={handleSubmit}>
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

        <button type="submit" className="submit-button">
          Sign In
        </button>
      </form>

      <div className="login-footer">
        <a href="#">Forgot password?</a>
        <span> | </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveComponent("SignUp");
          }}
        >
          Sign Up
        </a>
      </div>
    </FormCard>
  );
}

export default Login;
