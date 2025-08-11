import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaUser } from "react-icons/fa";
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import "./style.css";

export default function Header({ dark, toggleTheme }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  // Capitalize each word
  const formatName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      setUsername(formatName(storedUser.name));
    }
  }, []);

  const handleToggleMenu = () => setShowMenu(!showMenu);
  const handleViewProfile = () => {
    navigate("/profile");
    setShowMenu(false);
  };
  const handleSignOut = () => {
    setShowLogoutModal(true);
    setShowMenu(false);
  };
  const confirmSignOut = () => {
    setShowLogoutModal(false);
    navigate("/");
  };
  const cancelSignOut = () => setShowLogoutModal(false);

  return (
    <>
      <div className="header-container">
        {/* 🌗 Theme Toggle Button */}
        <div className="theme-toggle-button" onClick={toggleTheme} title="Toggle Theme">
          {dark ? <BsMoonFill size={18} /> : <BsSunFill size={20} />}
        </div>

        {/* Profile Dropdown */}
        <div className="header-profile" onClick={handleToggleMenu}>
          <div className="profile-avatar">
            <FaUser size={18} color="#fff" />
          </div>
          <div className="profile-info">
            <div className="profile-texts">
              <span className="profile-name">{username || "User"}</span>
              <span className="profile-role">Software Engineer</span>
            </div>
            <FaChevronDown className="profile-chevron" />
          </div>

          {showMenu && (
            <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-item" onClick={handleViewProfile}>View Profile</div>
              <div className="dropdown-item" onClick={handleSignOut}>Sign Out</div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button onClick={cancelSignOut}>Cancel</button>
              <button onClick={confirmSignOut}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
