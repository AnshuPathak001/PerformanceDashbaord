import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaUser } from "react-icons/fa";
import "./header.css";

export default function Header({ screenName = "Dashboard Overview" }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleViewProfile = () => {
    navigate("/profile"); // 🔥 Navigate to My Profile page
    setShowMenu(false); // Close the dropdown after navigation
  };

  return (
    <div className="header-container">
      <h2 className="header-screen-name">{screenName}</h2>

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
            <div className="dropdown-item">Sign Out</div>
          </div>
        )}
      </div>
    </div>
  );
}
