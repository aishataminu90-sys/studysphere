

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import "../styles/Sidebar.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Sidebar() {
  // true = full sidebar, false = collapsed icon-only strip
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

  // Stores whether the logged-in user is an admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Collapse sidebar on small screens automatically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setIsOpen(false);
      else setIsOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch current user role to decide whether to show Admin Panel link
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          // Only show admin link if the user has the admin role
          setIsAdmin(data.role === "admin");
        }
      } catch (err) {
        console.error("Could not fetch user role:", err);
      }
    };
    fetchUserRole();
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <nav className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-collapsed"}`}>

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

        {/* Admin Panel link — only rendered for admin users */}
        {isAdmin && (
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => isActive ? "sidebar-link active sidebar-admin" : "sidebar-link sidebar-admin"}
              title="Admin Panel"
            >
              <AdminPanelSettingsRoundedIcon className="sidebar-icon" />
              {isOpen && <span className="sidebar-label">Admin Panel</span>}
            </NavLink>
          </li>
        )}

      </ul>

      {/* Toggle button at the bottom */}
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