import React, { useState } from "react";
import "./style.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1>Performa X</h1>
        <p>
          Performa X brings your people,
          <br />
          performance, and purpose into one place.
        </p>
      </div>
      <div className="login-right">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2>Sign In</h2>
          <label>Username or Email</label>
          <input
            type="text"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="signin-button">
            Sign In
          </button>
          <p className="signup-text">
            Don't have an account? <a href="#">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}
