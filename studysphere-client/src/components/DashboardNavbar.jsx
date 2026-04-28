// DashboardNavbar.jsx - Top navbar shown only on logged-in pages
// (Dashboard, Resources, UploadResource)
// Has: logo, dark/light mode toggle, Home link, Logout button

import { Link, useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import "../styles/DashboardNavbar.css";

function DashboardNavbar({ theme, setTheme }) {
  const navigate = useNavigate();

  // Toggle between dark (glass) and light (campus)
  const toggleTheme = () => {
    setTheme(theme === "glass" ? "campus" : "glass");
  };

  const handleLogout = () => {
    // Will hook into auth context later — for now just redirect home
    navigate("/");
  };

  return (
    <header className="dash-navbar">
      {/* Left: logo */}
      <div className="dash-navbar-logo">
        <span className="dash-navbar-logo-text">StudySphere</span>
      </div>

      {/* Right: controls */}
      <div className="dash-navbar-controls">
        {/* Dark / light toggle */}
        <button
          className="dash-navbar-btn dash-navbar-theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "glass" ? "light" : "dark"} mode`}
          title={theme === "glass" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "glass" ? (
            <LightModeRoundedIcon className="dash-navbar-icon" />
          ) : (
            <DarkModeRoundedIcon className="dash-navbar-icon" />
          )}
          <span className="dash-navbar-btn-label">
            {theme === "glass" ? "Light" : "Dark"}
          </span>
        </button>

        {/* Home link */}
        <Link to="/" className="dash-navbar-btn dash-navbar-home-btn" title="Go to Home">
          <HomeRoundedIcon className="dash-navbar-icon" />
          <span className="dash-navbar-btn-label">Home</span>
        </Link>

        {/* Logout */}
        <button
          className="dash-navbar-btn dash-navbar-logout-btn"
          onClick={handleLogout}
          title="Log out"
        >
          <LogoutRoundedIcon className="dash-navbar-icon" />
          <span className="dash-navbar-btn-label">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default DashboardNavbar;