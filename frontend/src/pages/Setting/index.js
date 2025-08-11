import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./style.css";

export default function Setting() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    timezone: "Indian Standard Time (IST)",
    language: "English (US)",
  });

  const [activeTab, setActiveTab] = useState("profile");

  // 🔠 Format display name to Title Case
  const formatName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser((prev) => ({
        ...prev,
        name: formatName(storedUser.name || "Default Name"),
        email: storedUser.email || "",
        timezone: storedUser.timezone || "Indian Standard Time (IST)",
        language: storedUser.language || "English (US)",
      }));
    }
  }, []);

  const togglePassword = (inputId, showId, hideId) => {
    const input = document.getElementById(inputId);
    const showIcon = document.getElementById(showId);
    const hideIcon = document.getElementById(hideId);

    if (input.type === "password") {
      input.type = "text";
      showIcon.style.display = "inline";
      hideIcon.style.display = "none";
    } else {
      input.type = "password";
      showIcon.style.display = "none";
      hideIcon.style.display = "inline";
    }
  };

  const validatePasswords = () => {
    const newPass = document.getElementById("new-password").value;
    const confirmPass = document.getElementById("confirm-password").value;

    if (!newPass || !confirmPass) {
      alert("Please fill in both password fields.");
      return;
    }

    if (newPass.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (newPass !== confirmPass) {
      alert("Passwords do not match.");
      return;
    }

    alert("Password updated successfully!");
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
        <p className="setting-description">
          Manage your account preferences and system settings
        </p>
      </div>

      <div className="settings-tabs">
        <div
          className={`tab ${activeTab === "profile" ? "active" : ""}`}
          id="profile-tab"
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile Settings
        </div>
        <div
          className={`tab ${activeTab === "password" ? "active" : ""}`}
          id="password-tab"
          onClick={() => setActiveTab("password")}
        >
          🛡️ Change Password
        </div>
      </div>

      {/* Profile Settings Section */}
      {activeTab === "profile" && (
        <div className="settings-form-section" id="profile-section">
          <h3>Profile Settings</h3>
          <form className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" value={user.name} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user.email} readOnly />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Time Zone</label>
              <input type="text" value={user.timezone} readOnly />
            </div>

            <div className="form-group full-width">
              <label>Language</label>
              <select className="dropdown" value={user.language} disabled>
                <option>English (US)</option>
              </select>
            </div>

            <div className="button-row">
              <button type="button" className="save-button" disabled>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Section */}
      {activeTab === "password" && (
        <div className="settings-form-section" id="password-section">
          <h3>Change Password</h3>
          <form className="settings-form">
            <div className="form-group full-width password-field">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type="password"
                  id="new-password"
                  placeholder="Enter new password"
                />
                <span
                  className="toggle-password"
                  onClick={() =>
                    togglePassword(
                      "new-password",
                      "eye-open-new",
                      "eye-closed-new"
                    )
                  }
                >
                  <FaEye id="eye-open-new" style={{ display: "none" }} />
                  <FaEyeSlash id="eye-closed-new" style={{ display: "inline" }} />
                </span>
              </div>
            </div>

            <div className="form-group full-width password-field">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Re-enter password"
                />
                <span
                  className="toggle-password"
                  onClick={() =>
                    togglePassword(
                      "confirm-password",
                      "eye-open-confirm",
                      "eye-closed-confirm"
                    )
                  }
                >
                  <FaEye id="eye-open-confirm" style={{ display: "none" }} />
                  <FaEyeSlash
                    id="eye-closed-confirm"
                    style={{ display: "inline" }}
                  />
                </span>
              </div>
            </div>

            <div className="button-row">
              <button
                type="button"
                className="save-button"
                onClick={validatePasswords}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
