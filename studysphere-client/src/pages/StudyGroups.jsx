// StudyGroups.jsx - Page where users can view, join and create study groups
// Layout matches Resources.jsx: DashboardNavbar + Sidebar + main content area

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

// Material UI icons
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

import "../styles/StudyGroups.css";

// Mock data - will be fetched from the backend later
const initialGroups = [
  { id: 1, name: "Web Development Study Group", module: "CS204", members: 5, nextSession: "Tuesday 7:00 PM", joined: false },
  { id: 2, name: "Database Systems Study Group", module: "CS210", members: 3, nextSession: "Thursday 6:00 PM", joined: false },
  { id: 3, name: "Contract Law Revision", module: "LAW101", members: 6, nextSession: "Wednesday 4:00 PM", joined: false },
  { id: 4, name: "Marketing Strategy Group", module: "BUS301", members: 4, nextSession: "Friday 5:00 PM", joined: false },
  { id: 5, name: "Networking Fundamentals", module: "CS205", members: 7, nextSession: "Monday 6:30 PM", joined: false },
];

function StudyGroups() {
  // Theme state - glass is dark mode, campus is light mode
  const [theme, setTheme] = useState("glass");

  // Full list of study groups
  const [groups, setGroups] = useState(initialGroups);

  // Controls whether the create group form panel is visible
  const [showForm, setShowForm] = useState(false);

  // Stores the values the user types into the create group form
  const [form, setForm] = useState({ name: "", module: "", nextSession: "" });

  // Stores validation error messages for each form field
  const [errors, setErrors] = useState({});

  // Temporarily shows a confirmation message after creating a group
  const [successMessage, setSuccessMessage] = useState("");

  // Updates a specific form field when the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear the error for this field as the user corrects it
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validates the form and adds the new group to the list
  const handleCreateGroup = (e) => {
    e.preventDefault(); // prevent page reload

    const newErrors = {};

    // Group name must not be empty
    if (!form.name.trim()) newErrors.name = "Group name is required";

    // Module must not be empty
    if (!form.module.trim()) newErrors.module = "Module is required";

    // Session time must not be empty
    if (!form.nextSession.trim()) newErrors.nextSession = "Next session date and time is required";

    setErrors(newErrors);

    // Only proceed if there are no validation errors
    if (Object.keys(newErrors).length === 0) {
      const newGroup = {
        id: groups.length + 1,
        name: form.name,
        module: form.module,
        members: 1,            // creator is the first member
        nextSession: form.nextSession,
        joined: true,          // creator automatically joins
      };

      setGroups([...groups, newGroup]);

      // Reset and close the form
      setForm({ name: "", module: "", nextSession: "" });
      setShowForm(false);

      // Show success message for 3 seconds then clear it
      setSuccessMessage(`"${newGroup.name}" has been created!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // Toggles a group between joined and not joined, adjusting the member count
  const handleJoinToggle = (groupId) => {
    setGroups(groups.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          joined: !group.joined,
          members: group.joined ? group.members - 1 : group.members + 1,
        };
      }
      return group;
    }));
  };

  // Split groups into two lists for the "My Groups" and "Available Groups" sections
  const joinedGroups = groups.filter((g) => g.joined);
  const availableGroups = groups.filter((g) => !g.joined);

  return (
    <div className={`groups-page ${theme}`}>

      {/* Top navbar - logo, theme toggle, home, logout */}
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="groups-layout">
        <Sidebar />

        <main className="groups-main">

          {/* Page heading - matches the style of Resources.jsx */}
          <div className="groups-header">
            <p className="groups-tagline">COLLABORATION</p>
            <h1>Study Groups</h1>
            <p className="groups-subtitle">
              Find or create groups for your modules and study together.
            </p>
          </div>

          {/* Top action row: result count + create button */}
          <div className="groups-controls">
            <p className="groups-count">
              {groups.length} group{groups.length !== 1 ? "s" : ""} available
              {joinedGroups.length > 0 && ` · ${joinedGroups.length} joined`}
            </p>

            {/* Toggles the create group form open/closed */}
            <button
              className="create-group-btn"
              onClick={() => setShowForm(!showForm)}
            >
              <AddRoundedIcon className="btn-icon" />
              {showForm ? "Cancel" : "Create Group"}
            </button>
          </div>

          {/* Success banner - appears briefly after creating a group */}
          {successMessage && (
            <div className="success-banner">{successMessage}</div>
          )}

          {/* Create Group Form - only rendered when showForm is true */}
          {showForm && (
            <form className="create-form" onSubmit={handleCreateGroup} noValidate>
              <h2>Create a New Study Group</h2>

              {/* Group Name input */}
              <div className="form-field">
                <label htmlFor="name">Group Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="e.g. Web Dev Study Group"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>

              {/* Module input */}
              <div className="form-field">
                <label htmlFor="module">Module</label>
                <input
                  id="module"
                  type="text"
                  name="module"
                  placeholder="e.g. CS204"
                  value={form.module}
                  onChange={handleChange}
                  className={errors.module ? "input-error" : ""}
                />
                {errors.module && <p className="error-message">{errors.module}</p>}
              </div>

              {/* Next Session input */}
              <div className="form-field">
                <label htmlFor="nextSession">Next Session</label>
                <input
                  id="nextSession"
                  type="text"
                  name="nextSession"
                  placeholder="e.g. Monday 6:00 PM"
                  value={form.nextSession}
                  onChange={handleChange}
                  className={errors.nextSession ? "input-error" : ""}
                />
                {errors.nextSession && <p className="error-message">{errors.nextSession}</p>}
              </div>

              <button type="submit" className="submit-form-btn">
                Create Group
              </button>
            </form>
          )}

          {/* My Groups section - only shown when the user has joined at least one group */}
          {joinedGroups.length > 0 && (
            <section className="groups-section">
              <div className="section-heading">
                <GroupsRoundedIcon className="section-heading-icon" />
                <h2>My Groups</h2>
              </div>
              <div className="groups-grid">
                {joinedGroups.map((group) => (
                  <div key={group.id} className="group-card joined">

                    {/* Top row: module badge + joined badge */}
                    <div className="group-card-top">
                      <span className="group-module-badge">{group.module}</span>
                      <span className="joined-badge">
                        <CheckRoundedIcon className="joined-icon" /> Joined
                      </span>
                    </div>

                    <h3 className="group-name">{group.name}</h3>

                    {/* Members and session info */}
                    <div className="group-meta">
                      <span><PersonRoundedIcon className="meta-icon" /> {group.members} members</span>
                      <span><CalendarTodayRoundedIcon className="meta-icon" /> {group.nextSession}</span>
                    </div>

                    {/* Leave group button */}
                    <button className="leave-btn" onClick={() => handleJoinToggle(group.id)}>
                      Leave Group
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Available Groups section */}
          <section className="groups-section">
            <div className="section-heading">
              <GroupsRoundedIcon className="section-heading-icon" />
              <h2>Available Groups</h2>
            </div>

            {availableGroups.length === 0 ? (
              // Empty state when all groups have been joined
              <div className="no-results">
                <p>You have joined all available groups!</p>
              </div>
            ) : (
              <div className="groups-grid">
                {availableGroups.map((group) => (
                  <div key={group.id} className="group-card">

                    {/* Module badge */}
                    <div className="group-card-top">
                      <span className="group-module-badge">{group.module}</span>
                    </div>

                    <h3 className="group-name">{group.name}</h3>

                    {/* Members and session info */}
                    <div className="group-meta">
                      <span><PersonRoundedIcon className="meta-icon" /> {group.members} members</span>
                      <span><CalendarTodayRoundedIcon className="meta-icon" /> {group.nextSession}</span>
                    </div>

                    {/* Join group button */}
                    <button className="join-btn" onClick={() => handleJoinToggle(group.id)}>
                      Join Group
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

export default StudyGroups;