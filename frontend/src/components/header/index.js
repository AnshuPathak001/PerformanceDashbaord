import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaUser } from "react-icons/fa";
import "./style.css";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleViewProfile = () => {
    navigate("/profile");
    setShowMenu(false);
  };

  const handleSignOut = () => {
    setShowLogoutModal(true); // Show the modal
    setShowMenu(false);
  };

  const confirmSignOut = () => {
    setShowLogoutModal(false);
    navigate("/"); // Change to login page if you have one
  };

  const cancelSignOut = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="header-container">

        <div className="header-profile" onClick={handleToggleMenu}>
          <div className="profile-avatar">
            <FaUser size={18} color="#fff" />
          </div>

          <div className="profile-info">
            <div className="profile-texts">
              <span className="profile-name">Anshu Pathak</span>
              <span className="profile-role">Software Engineer</span>
            </div>
            <FaChevronDown className="profile-chevron" />
          </div>

          {showMenu && (
            <div
              className="profile-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dropdown-item" onClick={handleViewProfile}>
                View Profile
              </div>
              <div className="dropdown-item" onClick={handleSignOut}>
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>

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
