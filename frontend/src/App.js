import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import Setting from "./pages/Setting";
import Integrations from "./pages/Integrations";
import LogTimesheet from "./pages/LogTimesheet";
import PerformanceReview from "./pages/PerformanceReview";
import Header from "./components/header";

function AppContent() {
  const location = useLocation();

  // Map paths to screen names
  const screenNames = {
    "/": "Dashboard Overview",
    "/profile": "My Profile",
    "/logTimesheet": "Log Timesheet",
    "/integrations": "Integrations",
    "/performancereview": "Performance Review",
    "/setting": "Settings",
  };

  const screenName = screenNames[location.pathname] || "";

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header screenName={screenName} />
        <div style={{ flex: 1, padding: "20px", background: "#f9f9f9" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/logTimesheet" element={<LogTimesheet />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/performancereview" element={<PerformanceReview />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
