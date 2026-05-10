//  Admin-only dashboard
// Shows: contact messages with per-admin status, all resources, all users
// Access is blocked on the frontend if the user is not an admin
// The backend also enforces this with adminMiddleware

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import Sidebar from "../components/Sidebar";

import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

import "../styles/AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Status badge colours  matches the theme
const STATUS_COLOURS = {
  "New": "status-new",
  "In Progress": "status-progress",
  "Closed": "status-closed",
};

function AdminDashboard() {
  const [theme, setTheme] = useState("glass");
  const navigate = useNavigate();

  // Which tab is active: messages | resources | users
  const [activeTab, setActiveTab] = useState("messages");

  // Data states
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalResources: 0 });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Check on load if user is actually an admin — redirect if not
  useEffect(() => {
    checkAdminAccess();
  }, []);

  // Fetch data whenever the active tab changes
  useEffect(() => {
    if (activeTab === "messages") fetchMessages();
    if (activeTab === "resources") fetchResources();
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  // GET /auth/me — verify user is logged in and is an admin
  const checkAdminAccess = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
      if (!res.ok) { navigate("/login"); return; }
      const data = await res.json();
      if (data.role !== "admin") { navigate("/dashboard"); return; }
      // Fetch initial data and stats once access is confirmed
      fetchMessages();
      fetchStats();
    } catch {
      navigate("/login");
    }
  };

  // GET /admin/stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { credentials: "include" });
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error("Could not fetch stats:", err);
    }
  };

  // GET /contact — all contact messages with this admin's status
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/contact`, { credentials: "include" });
      if (!res.ok) throw new Error();
      setMessages(await res.json());
    } catch {
      setError("Could not load messages.");
    } finally {
      setLoading(false);
    }
  };

  // GET /admin/resources — all platform resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/resources`, { credentials: "include" });
      if (!res.ok) throw new Error();
      setResources(await res.json());
    } catch {
      setError("Could not load resources.");
    } finally {
      setLoading(false);
    }
  };

  // GET /admin/users — all registered users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/users`, { credentials: "include" });
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  // PATCH /contact/:id/status — update this admin's status on a message
  const handleStatusChange = async (messageId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/contact/${messageId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      // Update the message in local state without refetching
      setMessages(messages.map(m =>
        m._id === messageId ? { ...m, myStatus: newStatus } : m
      ));
    } catch {
      alert("Could not update status. Please try again.");
    }
  };

  // DELETE /contact/:id — admin deletes a message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`${API_URL}/contact/${id}`, {
        method: "DELETE", credentials: "include"
      });
      if (!res.ok) throw new Error();
      setMessages(messages.filter(m => m._id !== id));
    } catch {
      alert("Could not delete message.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // DELETE /admin/resources/:id — admin removes a resource
  const handleDeleteResource = async (id) => {
    if (!window.confirm("Remove this resource from the platform?")) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`${API_URL}/admin/resources/${id}`, {
        method: "DELETE", credentials: "include"
      });
      if (!res.ok) throw new Error();
      setResources(resources.filter(r => r._id !== id));
    } catch {
      alert("Could not remove resource.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // DELETE /admin/users/:id — admin deletes a user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user account permanently?")) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "DELETE", credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error); return; }
      setUsers(users.filter(u => u._id !== id));
    } catch {
      alert("Could not delete user.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // PATCH /admin/users/:id/make-admin or /remove-admin
  const handleToggleAdmin = async (user) => {
    const isAdmin = user.role === "admin";
    const endpoint = isAdmin ? "remove-admin" : "make-admin";
    const confirm_msg = isAdmin
      ? `Remove admin role from ${user.name}?`
      : `Make ${user.name} an admin?`;
    if (!window.confirm(confirm_msg)) return;

    setActionLoadingId(user._id);
    try {
      const res = await fetch(`${API_URL}/admin/users/${user._id}/${endpoint}`, {
        method: "PATCH", credentials: "include"
      });
      if (!res.ok) throw new Error();
      setUsers(users.map(u =>
        u._id === user._id ? { ...u, role: isAdmin ? "user" : "admin" } : u
      ));
    } catch {
      alert("Could not update role.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Format date nicely
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IE", {
    day: "numeric", month: "short", year: "numeric"
  });

  return (
    <div className={`admin-page ${theme}`}>
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="admin-layout">
        <Sidebar />

        <main className="admin-main">

          {/* Page heading */}
          <div className="admin-header">
            <p className="admin-tagline">ADMIN PANEL</p>
            <div className="admin-title-row">
              <AdminPanelSettingsRoundedIcon className="admin-title-icon" />
              <h1>Admin Dashboard</h1>
            </div>
            <p className="admin-subtitle">Manage messages, resources, and users.</p>
          </div>

          {/* Stats row */}
          <div className="admin-stats">
            <div className="stat-card">
              <PeopleRoundedIcon className="stat-icon" />
              <div>
                <p className="stat-number">{stats.totalUsers}</p>
                <p className="stat-label">Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <FolderRoundedIcon className="stat-icon" />
              <div>
                <p className="stat-number">{stats.totalResources}</p>
                <p className="stat-label">Total Resources</p>
              </div>
            </div>
            <div className="stat-card">
              <MailRoundedIcon className="stat-icon" />
              <div>
                <p className="stat-number">{messages.length}</p>
                <p className="stat-label">Messages</p>
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === "messages" ? "admin-tab--active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              <MailRoundedIcon className="tab-icon" /> Messages
            </button>
            <button
              className={`admin-tab ${activeTab === "resources" ? "admin-tab--active" : ""}`}
              onClick={() => setActiveTab("resources")}
            >
              <FolderRoundedIcon className="tab-icon" /> Resources
            </button>
            <button
              className={`admin-tab ${activeTab === "users" ? "admin-tab--active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <PeopleRoundedIcon className="tab-icon" /> Users
            </button>
          </div>

          {error && <div className="admin-error">{error}</div>}
          {loading && <div className="admin-loading">Loading...</div>}

          {/*  MESSAGES TAB  */}
          {!loading && activeTab === "messages" && (
            <section className="admin-section">
              <p className="admin-section-count">{messages.length} message{messages.length !== 1 ? "s" : ""}</p>

              {messages.length === 0 ? (
                <div className="admin-empty">No contact messages yet.</div>
              ) : (
                <div className="messages-list">
                  {messages.map((msg) => (
                    <div key={msg._id} className={`message-card ${STATUS_COLOURS[msg.myStatus]}`}>

                      {/* Message header: name + date + status dropdown */}
                      <div className="message-header">
                        <div className="message-sender">
                          <p className="message-name">{msg.name}</p>
                          <p className="message-email">{msg.email}</p>
                        </div>
                        <div className="message-actions">
                          {/* Status dropdown — each admin sets their own */}
                          <select
                            className={`status-select ${STATUS_COLOURS[msg.myStatus]}`}
                            value={msg.myStatus}
                            onChange={(e) => handleStatusChange(msg._id, e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                          </select>

                          <button
                            className="admin-delete-btn"
                            onClick={() => handleDeleteMessage(msg._id)}
                            disabled={actionLoadingId === msg._id}
                            title="Delete message"
                          >
                            <DeleteRoundedIcon className="delete-icon" />
                          </button>
                        </div>
                      </div>

                      <p className="message-body">{msg.message}</p>
                      <p className="message-date">{formatDate(msg.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/*  RESOURCES TAB  */}
          {!loading && activeTab === "resources" && (
            <section className="admin-section">
              <p className="admin-section-count">{resources.length} resource{resources.length !== 1 ? "s" : ""}</p>

              {resources.length === 0 ? (
                <div className="admin-empty">No resources uploaded yet.</div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Module</th>
                        <th>Uploaded By</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map((resource) => (
                        <tr key={resource._id}>
                          <td className="resource-title">{resource.title}</td>
                          <td><span className="module-pill">{resource.module}</span></td>
                          <td>{resource.uploadedBy?.name || "Unknown"}</td>
                          <td>{formatDate(resource.createdAt)}</td>
                          <td>
                            <button
                              className="admin-delete-btn"
                              onClick={() => handleDeleteResource(resource._id)}
                              disabled={actionLoadingId === resource._id}
                              title="Remove resource"
                            >
                              <DeleteRoundedIcon className="delete-icon" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/*  USERS TAB  */}
          {!loading && activeTab === "users" && (
            <section className="admin-section">
              <p className="admin-section-count">{users.length} user{users.length !== 1 ? "s" : ""}</p>

              {users.length === 0 ? (
                <div className="admin-empty">No users found.</div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="user-name">{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-pill ${user.role === "admin" ? "role-admin" : "role-user"}`}>
                              {user.role === "admin" && <ShieldRoundedIcon className="role-icon" />}
                              {user.role}
                            </span>
                          </td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td className="user-actions">
                            {/* Toggle admin role */}
                            <button
                              className={`toggle-admin-btn ${user.role === "admin" ? "demote" : "promote"}`}
                              onClick={() => handleToggleAdmin(user)}
                              disabled={actionLoadingId === user._id}
                              title={user.role === "admin" ? "Remove admin" : "Make admin"}
                            >
                              {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                            </button>

                            {/* Delete user */}
                            <button
                              className="admin-delete-btn"
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={actionLoadingId === user._id}
                              title="Delete user"
                            >
                              <DeleteRoundedIcon className="delete-icon" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;