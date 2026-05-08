// StudyGroups.jsx - Connected to the backend API
// Fetches groups from GET /groups, joins/leaves via POST /groups/:id/join
// Creates groups via POST /groups, all protected by session auth

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

import "../styles/StudyGroups.css";

// Base API URL - set VITE_API_URL in your .env file
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Random motivational messages shown when marking a reminder complete
const motivationalMessages = [
  "Great work! Keep it up! 🎉",
  "One step closer to your goals! 💪",
  "You are on a roll! 🔥",
  "That is the spirit! ⭐",
  "Smashing it! Keep going! 🚀",
  "Amazing effort! 👏",
];

function StudyGroups() {
  const [theme, setTheme] = useState("glass");

  // All groups fetched from the backend
  const [groups, setGroups] = useState([]);

  // The logged-in user's ID - used to check if they are a member of each group
  const [currentUserId, setCurrentUserId] = useState(null);

  // Page-level loading and error states
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Create form visibility and values
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", module: "", nextSession: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Tracks which group's join/leave button is currently loading
  const [joiningId, setJoiningId] = useState(null);

  // Fetch groups and current user when page loads
  useEffect(() => {
    fetchGroups();
    fetchCurrentUser();
  }, []);

  // GET /groups - fetches all study groups from the backend
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/groups`, {
        credentials: "include", // sends the session cookie with the request
      });
      if (!res.ok) throw new Error("Failed to load groups");
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      setFetchError("Could not load study groups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // GET /auth/me - fetches the current logged-in user so we can check membership
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data._id);
      }
    } catch (err) {
      console.error("Could not fetch current user:", err);
    }
  };

  // POST /groups/:id/join - toggles the user joining or leaving a group
  const handleJoinToggle = async (groupId) => {
    setJoiningId(groupId); // show loading state on this button only
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/join`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update membership");
      await fetchGroups(); // refresh list to reflect new member count
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setJoiningId(null);
    }
  };

  // Updates a form field and clears its error as the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // POST /groups - validates and submits the create group form
  const handleCreateGroup = async (e) => {
    e.preventDefault();

    // Client-side validation before hitting the API
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Group name is required";
    if (!form.module.trim()) newErrors.module = "Module is required";
    if (!form.nextSession.trim()) newErrors.nextSession = "Next session is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch(`${API_URL}/groups`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          module: form.module,
          nextSession: form.nextSession,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || "Failed to create group" });
        return;
      }

      // Reset form, close it, and refresh the groups list
      setForm({ name: "", module: "", nextSession: "" });
      setShowForm(false);
      await fetchGroups();

      setSuccessMessage(`"${form.name}" has been created!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  // Returns true if the current user is in this group's members array
  const isMember = (group) => {
    if (!currentUserId) return false;
    return group.members.some(
      (m) => (m._id || m).toString() === currentUserId.toString()
    );
  };

  // Formats a date string into a readable format e.g. "Tue, 10 Jun, 07:00 PM"
  const formatSession = (dateStr) => {
    if (!dateStr) return "TBC";
    return new Date(dateStr).toLocaleDateString("en-IE", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Separate groups into joined and available for display in two sections
  const joinedGroups = groups.filter((g) => isMember(g));
  const availableGroups = groups.filter((g) => !isMember(g));

  return (
    <div className={`groups-page ${theme}`}>
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="groups-layout">
        <Sidebar />

        <main className="groups-main">

          {/* Page heading */}
          <div className="groups-header">
            <p className="groups-tagline">COLLABORATION</p>
            <h1>Study Groups</h1>
            <p className="groups-subtitle">
              Find or create groups for your modules and study together.
            </p>
          </div>

          {/* Controls row */}
          <div className="groups-controls">
            <p className="groups-count">
              {loading
                ? "Loading..."
                : `${groups.length} group${groups.length !== 1 ? "s" : ""} available`}
              {joinedGroups.length > 0 && ` · ${joinedGroups.length} joined`}
            </p>

            <button className="create-group-btn" onClick={() => setShowForm(!showForm)}>
              <AddRoundedIcon className="btn-icon" />
              {showForm ? "Cancel" : "Create Group"}
            </button>
          </div>

          {/* Success banner */}
          {successMessage && <div className="success-banner">{successMessage}</div>}

          {/* Fetch error message */}
          {fetchError && <div className="fetch-error">{fetchError}</div>}

          {/* Create Group Form */}
          {showForm && (
            <form className="create-form" onSubmit={handleCreateGroup} noValidate>
              <h2>Create a New Study Group</h2>

              {errors.general && <p className="error-message">{errors.general}</p>}

              <div className="form-field">
                <label htmlFor="name">Group Name</label>
                <input
                  id="name" type="text" name="name"
                  placeholder="e.g. Web Dev Study Group"
                  value={form.name} onChange={handleChange}
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="module">Module</label>
                <input
                  id="module" type="text" name="module"
                  placeholder="e.g. CS204"
                  value={form.module} onChange={handleChange}
                  className={errors.module ? "input-error" : ""}
                />
                {errors.module && <p className="error-message">{errors.module}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="nextSession">Next Session</label>
                {/* datetime-local matches the Date type expected by the backend */}
                <input
                  id="nextSession" type="datetime-local" name="nextSession"
                  value={form.nextSession} onChange={handleChange}
                  className={errors.nextSession ? "input-error" : ""}
                />
                {errors.nextSession && <p className="error-message">{errors.nextSession}</p>}
              </div>

              <button type="submit" className="submit-form-btn">Create Group</button>
            </form>
          )}

          {/* Loading state */}
          {loading && <div className="loading-state"><p>Loading groups...</p></div>}

          {/* My Groups */}
          {!loading && joinedGroups.length > 0 && (
            <section className="groups-section">
              <div className="section-heading">
                <GroupsRoundedIcon className="section-heading-icon" />
                <h2>My Groups</h2>
              </div>
              <div className="groups-grid">
                {joinedGroups.map((group) => (
                  <div key={group._id} className="group-card joined">
                    <div className="group-card-top">
                      <span className="group-module-badge">{group.module}</span>
                      <span className="joined-badge">
                        <CheckRoundedIcon className="joined-icon" /> Joined
                      </span>
                    </div>
                    <h3 className="group-name">{group.name}</h3>
                    <div className="group-meta">
                      <span><PersonRoundedIcon className="meta-icon" /> {group.members.length} member{group.members.length !== 1 ? "s" : ""}</span>
                      <span><CalendarTodayRoundedIcon className="meta-icon" /> {formatSession(group.nextSession)}</span>
                    </div>
                    <button className="leave-btn" onClick={() => handleJoinToggle(group._id)} disabled={joiningId === group._id}>
                      {joiningId === group._id ? "Updating..." : "Leave Group"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Available Groups */}
          {!loading && (
            <section className="groups-section">
              <div className="section-heading">
                <GroupsRoundedIcon className="section-heading-icon" />
                <h2>Available Groups</h2>
              </div>
              {availableGroups.length === 0 ? (
                <div className="no-results"><p>You have joined all available groups!</p></div>
              ) : (
                <div className="groups-grid">
                  {availableGroups.map((group) => (
                    <div key={group._id} className="group-card">
                      <div className="group-card-top">
                        <span className="group-module-badge">{group.module}</span>
                      </div>
                      <h3 className="group-name">{group.name}</h3>
                      <div className="group-meta">
                        <span><PersonRoundedIcon className="meta-icon" /> {group.members.length} member{group.members.length !== 1 ? "s" : ""}</span>
                        <span><CalendarTodayRoundedIcon className="meta-icon" /> {formatSession(group.nextSession)}</span>
                      </div>
                      <button className="join-btn" onClick={() => handleJoinToggle(group._id)} disabled={joiningId === group._id}>
                        {joiningId === group._id ? "Joining..." : "Join Group"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default StudyGroups;