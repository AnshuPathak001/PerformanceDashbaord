import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaCog,
  FaPlug,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import "./style.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h3>Performance Hub</h3>
      <ul>
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            <FaTachometerAlt className="sidebar-icon" />
            Dashboard Overview
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className={location.pathname === "/profile" ? "active" : ""}
          >
            <FaUser className="sidebar-icon" />
            My Profile
          </Link>
        </li>
        <li>
          <Link
            to="/logTimesheet"
            className={location.pathname === "/logTimesheet" ? "active" : ""}
          >
            <FaClock className="sidebar-icon" />
            Log Timesheet
          </Link>
        </li>
        <li>
          <Link
            to="/integrations"
            className={location.pathname === "/integrations" ? "active" : ""}
          >
            <FaPlug className="sidebar-icon" />
            Integration
          </Link>
        </li>
        <li>
          <Link
            to="/performancereview"
            className={
              location.pathname === "/performancereview" ? "active" : ""
            }
          >
            <FaChartLine className="sidebar-icon" />
            Performance Review
          </Link>
        </li>
        <li>
          <Link
            to="/setting"
            className={location.pathname === "/setting" ? "active" : ""}
          >
            <FaCog className="sidebar-icon" />
            Setting
          </Link>
        </li>
      </ul>
    </div>
  );
}
