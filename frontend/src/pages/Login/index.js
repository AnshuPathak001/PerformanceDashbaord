import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (flag) {
      onLogin(true); // Notify parent on successful login
    }
  }, [flag, onLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Fetch the user attempting login
      const res = await axios.get(`http://localhost:5000/users/${email}`);
      const loggedUser = res.data;

      if (loggedUser && loggedUser.password === password) {
        console.log("✅ Password matched");

        // Step 2: Store current user in localStorage
        const userData = {
          name: loggedUser.userName || "Default Name",
          email: loggedUser.email,
          timezone: loggedUser.timezone || "Indian Standard Time (IST)",
          language: loggedUser.language || "English (US)",
          employeeId: loggedUser.employeeID || "EMP-0000",
          department: loggedUser.department || "Engineering",
          joinDate: loggedUser.joiningDate || "2022-01-01",
          manager: loggedUser.directManager || "John Smith",
          role: loggedUser.designation || "Software Engineer",
        };
        localStorage.setItem("user", JSON.stringify(userData));

        // Step 3: Fetch and store all users list
        const allUsersRes = await axios.get("http://localhost:5000/users");
        localStorage.setItem("allUsers", JSON.stringify(allUsersRes.data));

        setFlag(true); // trigger redirect or parent change
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
