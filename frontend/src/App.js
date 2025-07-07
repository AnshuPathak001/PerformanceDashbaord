import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/MyProfile';
import Setting from './pages/Setting';
import Integrations from './pages/Integrations';
import LogTimesheet from './pages/LogTimesheet';
import PerformanceReview from './pages/PerformanceReview';
import Header from './components/Header';

function App() {
  return (
  <Router>
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ flex: 1, padding: '20px', background: '#f9f9f9' }}>
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

