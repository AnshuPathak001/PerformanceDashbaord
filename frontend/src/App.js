import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import Setting from "./pages/Setting/index";
import Integrations from "./pages/Integrations";
import LogTimesheet from "./pages/LogTimesheet";
import PerformanceReview from "./pages/PerformanceReview";
import Header from "./components/header";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="screen-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<MyProfile />} />
              <Route path="/logtimesheet" element={<LogTimesheet />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/performancereview" element={<PerformanceReview />} />
              <Route path="/setting" element={<Setting />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
