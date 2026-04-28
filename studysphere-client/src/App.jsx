import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import UploadResource from "./pages/UploadResource";

import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import "./styles/Layout.css";

// App.jsx - sets up all routes for the application
// Theme is managed here and passed down to Aishat's pages
function App() {
  // Shared theme state - glass is dark mode, campus is light mode
  const [theme, setTheme] = useState("glass");

  return (
    <Router>
      <Routes>
        {/* Aishat's pages - receive theme as a prop */}
        <Route path="/" element={<Home theme={theme} />} />
        <Route path="/login" element={<Login theme={theme} />} />
        <Route path="/register" element={<Register theme={theme} />} />

        {/* Aisha's pages - manage their own theme internally */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/upload" element={<UploadResource />} />
      </Routes>
    </Router>
  );
}

export default App;