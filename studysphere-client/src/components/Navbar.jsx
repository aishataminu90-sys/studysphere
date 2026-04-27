// useState is used to track whether the mobile menu is open or closed
import { useState } from "react";

// NavLink is used instead of Link so active page is styled automatically
import { NavLink } from "react-router-dom";

// Material UI icons for the hamburger menu
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// Navbar styling
import "../styles/Navbar.css";

function Navbar({ theme }) {
  // Controls whether the mobile dropdown menu is visible
  const [menuOpen, setMenuOpen] = useState(false);

  // Closes the menu (used when a link is clicked)
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Logo  */}
      <NavLink to="/" className="logo" onClick={closeMenu}>
        StudySphere
      </NavLink>

      {/* Hamburger button thats only visible on small screens */}
      <button
        className="hamburger-btn"
        onClick={() => setMenuOpen(!menuOpen)} // toggles open/close
        aria-label="Toggle navigation menu"
      >
        {/* Switch icon depending on menu state */}
        {menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
      </button>

      {/* Navigation links */}
      {/* "open" class is added when menuOpen = true */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        
        {/* "end" ensures Home is only active on "/" exactly */}
        <NavLink to="/" end onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/login" onClick={closeMenu}>
          Login
        </NavLink>

        <NavLink to="/register" onClick={closeMenu}>
          Register
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;