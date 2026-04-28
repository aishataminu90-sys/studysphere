import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import UploadResource from "./pages/UploadResource";

const LOGGED_IN_PATHS = ["/dashboard", "/resources", "/upload"];

function AppContent() {
  const [theme, setTheme] = useState("glass");
  const location = useLocation();
  const isLoggedIn = LOGGED_IN_PATHS.includes(location.pathname);

  return (
    <main className={`app ${isLoggedIn ? "" : theme}`}>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
        <Route path="/login" element={<Login theme={theme} setTheme={setTheme} />} />
        <Route path="/register" element={<Register theme={theme} setTheme={setTheme} />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/upload" element={<UploadResource />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;