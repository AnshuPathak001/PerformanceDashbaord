import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [flag, setFlag] = useState(true);

  useEffect(() => {
    console.log("flag changed:", flag);
    if (flag) {
      onLogin(true); // notify parent on successful login
    }
  }, [flag, onLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get("http://localhost:5000/users/" + email);

      if (res.data && res.data.password === password) {
        console.log("✅ Password matched");

        const userData = {
          name: res.data.userName || "Default Name",
          email: res.data.email,
          timezone: res.data.timezone || "Indian Standard Time (IST)",
          language: res.data.language || "English (US)",
        };

        localStorage.setItem("user", JSON.stringify(userData));

        setFlag(true);
      } else {
        alert("❌ Incorrect password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("⚠️ User not found or server error.");
    }
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
        <div className="login-box">
          <h2>Sign In</h2>

          <label>Email</label>
          <input
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
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

          <button onClick={handleLogin} className="signin-button">
            Sign In
          </button>

          <p className="signup-text">
            Don't have an account? <a href="#">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
