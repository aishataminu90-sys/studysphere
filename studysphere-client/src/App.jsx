import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import UploadResource from "./pages/UploadResource";
import StudyGroups from "./pages/StudyGroups";
import Reminders from "./pages/Reminders";

// Paths that use the dashboard layout (full width, no root centering)
const LOGGED_IN_PATHS = ["/dashboard", "/resources", "/upload", "/studygroups", "/reminders"];

function AppContent() {
  const [theme, setTheme] = useState("glass");
  const location = useLocation();
  const isLoggedIn = LOGGED_IN_PATHS.includes(location.pathname);

  return (
    <main className={`app ${isLoggedIn ? "" : theme}`}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
        <Route path="/login" element={<Login theme={theme} setTheme={setTheme} />} />
        <Route path="/register" element={<Register theme={theme} setTheme={setTheme} />} />

        {/* LOGGED IN ROUTES */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/upload" element={<UploadResource />} />
        <Route path="/studygroups" element={<StudyGroups />} />
        <Route path="/reminders" element={<Reminders />} />
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