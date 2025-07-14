import { useEffect, useState } from "react";
import "./style.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = saved === "dark" || (!saved && prefersDark);
    setDark(useDark);
    document.documentElement.classList.toggle("dark-theme", useDark);
  }, []);

  const handleThemeToggle = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark-theme", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // ✅ Check the given credentials
      if (
        username === "priyanka.khetarpal@valtech.com" &&
        password === "Priya@123"
      ) {
        // ✅ Redirect to localhost:3000
        window.location.href = "http://localhost:3000/";
      } else {
        setError("Invalid credentials");
      }
    }, 1500);
  };

  return (
    <div className="main-wrapper">
      {/* 🌙 Theme Switch */}
      <div
        className="theme-switch-wrapper"
        role="switch"
        aria-checked={dark}
        tabIndex={0}
        onClick={handleThemeToggle}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && handleThemeToggle()
        }
      >
        <div className={`theme-switch ${dark ? "dark" : ""}`}>
          <span className="switch-thumb">
            <span className="icon">{dark ? "🌙" : "☀️"}</span>
          </span>
        </div>
      </div>

      {/* 🟦 Left Branding Panel */}
      <section className="left-panel">
        <div className="brand-title">Performa X</div>
        <div className="brand-quote">
          Performa X brings your people, performance, and purpose into one place.
        </div>
      </section>

      {/* 🔐 Login Form */}
      <main className="login-container" aria-label="Login form">
        <div className="login-title">Sign In</div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username or Email</label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="checkbox-row">
            <label className="checkbox-label" htmlFor="remember">
              <input type="checkbox" id="remember" name="remember" />
              Remember Me
            </label>
            <a href="#" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {error && <div className="error-message" role="alert">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            <span>Sign In</span>
            {loading && <span className="spinner"></span>}
          </button>
        </form>

        <div className="signup-row">
          Don't have an account? <a href="#" className="signup-link">Sign up</a>
        </div>
      </main>
    </div>
  );
}
