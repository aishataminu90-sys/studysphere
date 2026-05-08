import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";

import "../styles/StudyGroups.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function StudyGroups() {
  const [theme, setTheme] = useState("glass");
  const [groups, setGroups] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [form, setForm] = useState({
    name: "",
    module: "",
    nextSession: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchGroups();
    fetchCurrentUser();
  }, []);

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      setLoading(true);
      setFetchError("");

      const res = await fetch(`${API_URL}/groups`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load groups");
      }

      const data = await res.json();
      setGroups(data);
    } catch (err) {
      setFetchError("Could not load study groups. Please try again.");
      console.error("Fetch groups error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current logged-in user
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

  // Status checks
  const isMember = (group) =>
    currentUserId &&
    group.members.some(
      (m) => (m._id || m).toString() === currentUserId.toString()
    );

  const isPending = (group) =>
    currentUserId &&
    group.pendingMembers.some(
      (m) => (m._id || m).toString() === currentUserId.toString()
    );

  const isLeader = (group) =>
    currentUserId &&
    (group.createdBy._id || group.createdBy).toString() ===
      currentUserId.toString();

  // Request to join
  const handleRequestJoin = async (groupId) => {
    setActionLoadingId(groupId);

    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/request`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      await fetchGroups();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Cancel request
  const handleCancelRequest = async (groupId) => {
    setActionLoadingId(groupId);

    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/request`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error();
      }

      await fetchGroups();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Approve user
  const handleApprove = async (groupId, userId) => {
    const key = `${groupId}-${userId}`;
    setActionLoadingId(key);

    try {
      const res = await fetch(
        `${API_URL}/groups/${groupId}/approve/${userId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      await fetchGroups();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Deny user
  const handleDeny = async (groupId, userId) => {
    const key = `${groupId}-${userId}`;
    setActionLoadingId(key);

    try {
      const res = await fetch(
        `${API_URL}/groups/${groupId}/deny/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      await fetchGroups();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Leave group
  const handleLeave = async (groupId) => {
    setActionLoadingId(groupId);

    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/leave`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      await fetchGroups();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Form input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // Create group
  const handleCreateGroup = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Group name is required";
    }

    if (!form.module.trim()) {
      newErrors.module = "Module is required";
    }

    if (!form.nextSession.trim()) {
      newErrors.nextSession = "Next session date is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/groups`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          module: form.module,
          nextSession: form.nextSession,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          general: data.error || "Failed to create group",
        });
        return;
      }

      setForm({
        name: "",
        module: "",
        nextSession: "",
      });

      setShowForm(false);
      await fetchGroups();

      setSuccessMessage(`"${form.name}" has been created!`);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setErrors({
        general: "Something went wrong. Please try again.",
      });
    }
  };

  // Format date
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

  // Group categories
  const myLeaderGroups = groups.filter((g) => isLeader(g));
  const joinedGroups = groups.filter((g) => isMember(g) && !isLeader(g));
  const pendingGroups = groups.filter((g) => isPending(g));
  const availableGroups = groups.filter(
    (g) => !isMember(g) && !isPending(g) && !isLeader(g)
  );

  return (
    <div
      className={`groups-page ${theme} ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="groups-layout">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        <main className="groups-main">
          <div className="groups-header">
            <p className="groups-tagline">COLLABORATION</p>
            <h1>Study Groups</h1>
            <p className="groups-subtitle">
              Find or create groups for your modules and study together.
            </p>
          </div>

          <div className="groups-controls">
            <p className="groups-count">
              {loading
                ? "Loading..."
                : `${groups.length} group${groups.length !== 1 ? "s" : ""} available`}
            </p>

            <button
              className="create-group-btn"
              onClick={() => setShowForm(!showForm)}
            >
              <AddRoundedIcon className="btn-icon" />
              {showForm ? "Cancel" : "Create Group"}
            </button>
          </div>

          {successMessage && <div className="success-banner">{successMessage}</div>}
          {fetchError && <div className="fetch-error">{fetchError}</div>}

          {/* CREATE GROUP FORM */}
          {showForm && (
            <form className="create-form" onSubmit={handleCreateGroup} noValidate>
              <h2>Create New Study Group</h2>

              {errors.general && (
                <p className="error-message">{errors.general}</p>
              )}

              <div className="form-field">
                <label>Group Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., CS301 Study Squad"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? "input-error" : ""}
                />
                {errors.name && (
                  <p className="error-message">{errors.name}</p>
                )}
              </div>

              <div className="form-field">
                <label>Module Code</label>
                <input
                  type="text"
                  name="module"
                  placeholder="e.g., CS301"
                  value={form.module}
                  onChange={handleChange}
                  className={errors.module ? "input-error" : ""}
                />
                {errors.module && (
                  <p className="error-message">{errors.module}</p>
                )}
              </div>

              <div className="form-field">
                <label>Next Session Date & Time</label>
                <input
                  type="datetime-local"
                  name="nextSession"
                  value={form.nextSession}
                  onChange={handleChange}
                  className={errors.nextSession ? "input-error" : ""}
                />
                {errors.nextSession && (
                  <p className="error-message">{errors.nextSession}</p>
                )}
              </div>

              <button type="submit" className="submit-form-btn">
                Create Group
              </button>
            </form>
          )}

          {/* MY GROUPS AS LEADER */}
          {myLeaderGroups.length > 0 && (
            <div className="groups-section">
              <div className="section-heading">
                <GroupsRoundedIcon className="section-heading-icon" />
                <h2>My Groups</h2>
              </div>
              <div className="groups-grid">
                {myLeaderGroups.map((group) => (
                  <div key={group._id} className="group-card joined">
                    <div className="group-card-top">
                      <span className="group-module-badge">{group.module}</span>
                      <span className="joined-badge">
                        <CheckRoundedIcon className="joined-icon" />
                        Leader
                      </span>
                    </div>

                    <h3 className="group-name">{group.name}</h3>

                    <div className="group-meta">
                      <span>
                        <PersonRoundedIcon className="meta-icon" />
                        {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        <CalendarTodayRoundedIcon className="meta-icon" />
                        Next: {formatSession(group.nextSession)}
                      </span>
                    </div>

                    {/* PENDING REQUESTS FOR LEADER */}
                    {group.pendingMembers.length > 0 && (
                      <div className="pending-section">
                        <p className="pending-title">
                          <HourglassEmptyRoundedIcon className="pending-icon" />
                          {group.pendingMembers.length} pending request
                          {group.pendingMembers.length !== 1 ? "s" : ""}
                        </p>
                        <div className="pending-actions">
                          {group.pendingMembers.map((user) => (
                            <div key={user._id} className="pending-user">
                              <span>{user.name}</span>
                              <div className="pending-buttons">
                                <button
                                  className="approve-btn"
                                  onClick={() =>
                                    handleApprove(group._id, user._id)
                                  }
                                  disabled={
                                    actionLoadingId === `${group._id}-${user._id}`
                                  }
                                >
                                  <CheckCircleOutlineRoundedIcon />
                                </button>
                                <button
                                  className="deny-btn"
                                  onClick={() => handleDeny(group._id, user._id)}
                                  disabled={
                                    actionLoadingId === `${group._id}-${user._id}`
                                  }
                                >
                                  <CancelRoundedIcon />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      className="leave-btn"
                      disabled={actionLoadingId === group._id}
                    >
                      Delete Group
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GROUPS I'VE JOINED */}
          {joinedGroups.length > 0 && (
            <div className="groups-section">
              <div className="section-heading">
                <GroupsRoundedIcon className="section-heading-icon" />
                <h2>Groups I've Joined</h2>
              </div>
              <div className="groups-grid">
                {joinedGroups.map((group) => (
                  <div key={group._id} className="group-card joined">
                    <div className="group-card-top">
                      <span className="group-module-badge">{group.module}</span>
                      <span className="joined-badge">
                        <CheckRoundedIcon className="joined-icon" />
                        Joined
                      </span>
                    </div>

                    <h3 className="group-name">{group.name}</h3>

                    <div className="group-meta">
                      <span>
                        <PersonRoundedIcon className="meta-icon" />
                        {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        <CalendarTodayRoundedIcon className="meta-icon" />
                        Next: {formatSession(group.nextSession)}
                      </span>
                    </div>

                    <button
                      className="leave-btn"
                      onClick={() => handleLeave(group._id)}
                      disabled={actionLoadingId === group._id}
                    >
                      <MeetingRoomRoundedIcon />
                      Leave Group
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PENDING REQUESTS */}
          {pendingGroups.length > 0 && (
            <div className="groups-section">
              <div className="section-heading">
                <HourglassEmptyRoundedIcon className="section-heading-icon" />
                <h2>Pending Requests</h2>
              </div>
              <div className="groups-grid">
                {pendingGroups.map((group) => (
                  <div key={group._id} className="group-card pending">
                    <div className="group-card-top">
                      <span className="group-module-badge">{group.module}</span>
                      <span className="pending-badge">
                        <HourglassEmptyRoundedIcon className="joined-icon" />
                        Pending
                      </span>
                    </div>

                    <h3 className="group-name">{group.name}</h3>

                    <div className="group-meta">
                      <span>
                        <PersonRoundedIcon className="meta-icon" />
                        {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        <CalendarTodayRoundedIcon className="meta-icon" />
                        Next: {formatSession(group.nextSession)}
                      </span>
                    </div>

                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelRequest(group._id)}
                      disabled={actionLoadingId === group._id}
                    >
                      <CancelRoundedIcon />
                      Cancel Request
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AVAILABLE GROUPS TO JOIN */}
          {availableGroups.length > 0 && (
            <div className="groups-section">
              <div className="section-heading">
                <AddRoundedIcon className="section-heading-icon" />
                <h2>Available Groups</h2>
              </div>
              <div className="groups-grid">
                {availableGroups.map((group) => (
                  <div key={group._id} className="group-card">
                    <div className="group-card-top">
                      <span className="group-module-badge">{group.module}</span>
                    </div>

                    <h3 className="group-name">{group.name}</h3>

                    <div className="group-meta">
                      <span>
                        <PersonRoundedIcon className="meta-icon" />
                        {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                      </span>
                      <span>
                        <CalendarTodayRoundedIcon className="meta-icon" />
                        Next: {formatSession(group.nextSession)}
                      </span>
                    </div>

                    <button
                      className="join-btn"
                      onClick={() => handleRequestJoin(group._id)}
                      disabled={actionLoadingId === group._id}
                    >
                      <AddRoundedIcon />
                      Request to Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NO GROUPS MESSAGE */}
          {!loading && groups.length === 0 && (
            <div className="no-results">
              <GroupsRoundedIcon
                style={{ fontSize: "3rem", marginBottom: "12px", opacity: 0.3 }}
              />
              <p>No study groups yet. Create one to get started!</p>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <p>Loading groups...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default StudyGroups;