import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/index";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/employeeProfile/index";
import Setting from "./pages/Setting/index";
import Integrations from "./pages/Integrations/index";
import LogTimesheet from "./pages/LogTimesheet";
import PerformanceReview from "./pages/PerformanceReview/index";
import Header from "./components/header/index";
import Login from "./pages/Login_Page/index";
import "./App.css";
 
function AppLayout() {
  return (
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
  );
}
 
function App() {
  return (
<Router>
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/*" element={<AppLayout />} />
</Routes>
</Router>
  );
}
 
export default App;