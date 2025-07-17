import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./style.css";

export default function Setting() {
  const handleTabClick = (tab) => {
    const profileTab = document.getElementById("profile-tab");
    const passwordTab = document.getElementById("password-tab");

    const profileSection = document.getElementById("profile-section");
    const passwordSection = document.getElementById("password-section");

    if (tab === "profile") {
      profileTab.classList.add("active");
      passwordTab.classList.remove("active");
      profileSection.style.display = "block";
      passwordSection.style.display = "none";
    } else {
      profileTab.classList.remove("active");
      passwordTab.classList.add("active");
      profileSection.style.display = "none";
      passwordSection.style.display = "block";
    }
  };

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
        <p className="setting-description">Manage your account preferences and system settings</p>
      </div>

      <div className="settings-tabs">
        <div
          className="tab active"
          id="profile-tab"
          onClick={() => handleTabClick("profile")}
        >
          👤 Profile Settings
        </div>
        <div
          className="tab"
          id="password-tab"
          onClick={() => handleTabClick("password")}
        >
          🛡️ Change Password
        </div>
      </div>

      {/* Profile Settings Section */}
      <div className="settings-form-section" id="profile-section">
        <h3>Profile Settings</h3>
        <form className="settings-form">
          <div className="form-row">
            <div className="form-group">
              <label>Display Name</label>
              <input type="text" value="Priyanka khetarpal" readOnly />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value="priyanka.khetarpal@valtech.com"
                readOnly
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Time Zone</label>
            <input type="text" value="Indian Standard Time (IST)" readOnly />
          </div>

          <div className="form-group full-width">
            <label>Language</label>
            <select className="dropdown" defaultValue="English (US)">
              <option>English (US)</option>
              <option>Hindi</option>
            </select>
          </div>

          <div className="button-row">
            <button type="button" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div
        className="settings-form-section"
        id="password-section"
        style={{ display: "none" }}
      >
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
      onClick={() => togglePassword("new-password", "eye-open-new", "eye-closed-new")}
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
      onClick={() => togglePassword("confirm-password", "eye-open-confirm", "eye-closed-confirm")}
    >
      <FaEye id="eye-open-confirm" style={{ display: "none" }} />
      <FaEyeSlash id="eye-closed-confirm" style={{ display: "inline" }} />
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
    </div>
  );
}