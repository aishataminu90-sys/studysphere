import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

/**
 * Sidebar component - Navigation menu shown after login
 * Highlights the currently active page link
 */
function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <h2>StudySphere</h2>
      </div>

      <ul className="sidebar-links">
        {/* Link to Dashboard */}
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            Dashboard
          </NavLink>
        </li>

        {/* Link to Resources page */}
        <li>
          <NavLink
            to="/resources"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
             Resources
          </NavLink>
        </li>

        {/* Link to Upload Resource page */}
        <li>
          <NavLink
            to="/upload"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
             Upload Resource
          </NavLink>
        </li>

        {/* Link to Study Groups page */}
        <li>
          <NavLink
            to="/studygroups"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
            👥 Study Groups
          </NavLink>
        </li>

        {/* Link to Reminders page */}
        <li>
          <NavLink
            to="/reminders"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
          >
             Reminders
          </NavLink>
        </li>
      </ul>

      {/* Logout link at bottom of sidebar */}
      <div className="sidebar-logout">
        <NavLink to="/" className="sidebar-link logout">
           Logout
        </NavLink>
      </div>
    </nav>
  );
}

export default Sidebar;