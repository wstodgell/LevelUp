import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
    // You’ll add real auth later here
  };

  return (
    <div className="login-container">
      <h2>Sign in with email</h2>
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
        <a href="#">Sign Up</a>
      </div>
    </div>
  );
}

export default Login;
