import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react"; // Add this import

import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Dashboard from "./pages/Dashboard";
import Setting from "./pages/Setting";
import LogTimesheet from "./pages/LogTimesheet";
import PerformanceReview from "./pages/PerformanceReview";
import EmployeeProfile from "./pages/MyProfile";
import Integrations from "./pages/Integrations";
import Login from "./pages/Login";
import "./App.css";
import GithubDetails from "./pages/GithubDetails";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dark, setDark] = useState(false);

  // Detect and apply saved/system theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark-theme", isDark);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    document.documentElement.classList.toggle("dark-theme", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const handleLogin = (flag) => {
    setIsLoggedIn(flag);
  };

  if (!isLoggedIn) {
    return (
      <SessionProvider>
        {" "}
        {/* Wrap Login component too */}
        <Login onLogin={handleLogin} dark={dark} toggleTheme={toggleTheme} />
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      {" "}
      {/* Wrap the entire Router */}
      <Router>
        <div className="app-container">
          <Sidebar dark={dark} toggleTheme={toggleTheme} />
          <div className="main-content">
            <Header dark={dark} toggleTheme={toggleTheme} />
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
                <Route path="/github-details" element={<GithubDetails />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { useState, useEffect } from "react";

// import Sidebar from "./components/sidebar";
// import Header from "./components/header";
// import Dashboard from "./pages/Dashboard";
// import Setting from "./pages/Setting";
// import LogTimesheet from "./pages/LogTimesheet";
// import PerformanceReview from "./pages/PerformanceReview";
// import EmployeeProfile from "./pages/MyProfile";
// import Integrations from "./pages/Integrations";
// import Login from "./pages/Login";

// import "./App.css";

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [dark, setDark] = useState(false);

//   // Detect and apply saved/system theme
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme");
//     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
//     setDark(isDark);
//     document.documentElement.classList.toggle("dark-theme", isDark);
//   }, []);

//   // Toggle theme
//   const toggleTheme = () => {
//     const newDark = !dark;
//     setDark(newDark);
//     document.documentElement.classList.toggle("dark-theme", newDark);
//     localStorage.setItem("theme", newDark ? "dark" : "light");
//   };

//   const handleLogin = (flag) => {
//     setIsLoggedIn(flag);
//   };

//   if (!isLoggedIn) {
//     return <Login onLogin={handleLogin} dark={dark} toggleTheme={toggleTheme} />;
//   }

//   return (
//     <Router>
//       <div className="app-container">
//         <Sidebar dark={dark} toggleTheme={toggleTheme} />
//         <div className="main-content">
//           <Header dark={dark} toggleTheme={toggleTheme} />
//           <div className="screen-content">
//             <Routes>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/profile" element={<EmployeeProfile />} />
//               <Route path="/logtimesheet" element={<LogTimesheet />} />
//               <Route path="/integrations" element={<Integrations />} />
//               <Route path="/performancereview" element={<PerformanceReview />} />
//               <Route path="/setting" element={<Setting />} />
//               <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;
