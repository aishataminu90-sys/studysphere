// Sidebar.jsx - Collapsible left navigation for logged-in pages
// Arrow button at the bottom toggles open/closed

import { useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import "../styles/Sidebar.css";

function Sidebar() {
  // true = full width sidebar, false = collapsed icon-only strip
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <nav className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-collapsed"}`}>

      {/* Navigation links */}
      <ul className="sidebar-links">

        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            title="Dashboard"
          >
            <DashboardRoundedIcon className="sidebar-icon" />
            {isOpen && <span className="sidebar-label">Dashboard</span>}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/resources"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            title="Resources"
          >
            <FolderRoundedIcon className="sidebar-icon" />
            {isOpen && <span className="sidebar-label">Resources</span>}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/upload"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            title="Upload Resource"
          >
            <UploadFileRoundedIcon className="sidebar-icon" />
            {isOpen && <span className="sidebar-label">Upload Resource</span>}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/studygroups"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            title="Study Groups"
          >
            <GroupsRoundedIcon className="sidebar-icon" />
            {isOpen && <span className="sidebar-label">Study Groups</span>}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/reminders"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            title="Reminders"
          >
            <AccessAlarmRoundedIcon className="sidebar-icon" />
            {isOpen && <span className="sidebar-label">Reminders</span>}
          </NavLink>
        </li>

      </ul>

      {/* Toggle button sits at the bottom of the sidebar */}
      <button
        className="sidebar-toggle-btn"
        onClick={toggle}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? (
          <>
            <ChevronLeftRoundedIcon className="sidebar-toggle-icon" />
            <span className="sidebar-toggle-label">Collapse</span>
          </>
        ) : (
          <ChevronRightRoundedIcon className="sidebar-toggle-icon" />
        )}
      </button>

    </nav>
  );
}

export default Sidebar;