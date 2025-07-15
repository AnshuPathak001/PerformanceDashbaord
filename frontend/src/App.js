import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/sidebar/index";
import Dashboard from "./pages/Dashboard";
import Setting from "./pages/Setting/index";
import LogTimesheet from "./pages/LogTimesheet";
import PerformanceReview from "./pages/PerformanceReview/index";
import Header from "./components/header/index";
import EmployeeProfile from "./pages/employeeProfile/index";
import Integrations from "./pages/Integrations/index";
import Login from "./pages/Dashboard/login/index"; // 👈 import login page
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="screen-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<EmployeeProfile />} />
              <Route path="/logtimesheet" element={<LogTimesheet />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route
                path="/performancereview"
                element={<PerformanceReview />}
              />
              <Route path="/setting" element={<Setting />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
