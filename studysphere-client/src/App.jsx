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
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import AdminDashboard from "./pages/AdminDashboard"; 
import ScrollToHash from "./components/ScrollToHash";

const LOGGED_IN_PATHS = [
  "/dashboard",
  "/resources",
  "/upload",
  "/studygroups",
  "/reminders",
  "/admin" 
];

function AppContent() {
  const [theme, setTheme] = useState("glass");
  const location = useLocation();
  const isLoggedIn = LOGGED_IN_PATHS.includes(location.pathname);

  return (
    <main className={`app ${isLoggedIn ? "" : theme}`}>
      <ScrollToHash />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
        <Route path="/login" element={<Login theme={theme} setTheme={setTheme} />} />
        <Route path="/register" element={<Register theme={theme} setTheme={setTheme} />} />
        <Route path="/faq" element={<FAQ theme={theme} setTheme={setTheme} />} />
        <Route path="/contact" element={<Contact theme={theme} setTheme={setTheme} />} />
        <Route path="/terms" element={<Terms theme={theme} setTheme={setTheme} />} />

        {/* LOGGED IN ROUTES */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/upload" element={<UploadResource />} />
        <Route path="/studygroups" element={<StudyGroups />} />
        <Route path="/reminders" element={<Reminders />} />

        {/* ADMIN ROUTE - redirects away if user is not an admin */}
        <Route path="/admin" element={<AdminDashboard />} />
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