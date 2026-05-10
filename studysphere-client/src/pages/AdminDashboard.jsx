/* admin-only dashboard */
/* shows contact messages (with per-admin status), all resources, and all users */
/* frontend blocks access if user is not admin */
/* backend also enforces this using adminmiddleware */

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

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000";

/* status badge colors (matches theme) */
const status_colours = {
  "New": "status-new",
  "In Progress": "status-progress",
  "Closed": "status-closed",
};

function AdminDashboard() {
  const [theme, setTheme] = useState("glass");
  const navigate = useNavigate();

  /* active tab: messages | resources | users */
  const [activeTab, setActiveTab] = useState("messages");

  /* data states */
  const [messages, setMessages] = useState([]);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalResources: 0 });

  /* loading + error states */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  /* check admin access on load */
  useEffect(() => {
    checkAdminAccess();
  }, []);

  /* refetch data when tab changes */
  useEffect(() => {
    if (activeTab === "messages") fetchMessages();
    if (activeTab === "resources") fetchResources();
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  /* verify user is logged in and is admin */
  const checkAdminAccess = async () => {
    try {
      const res = await fetch(`${api_url}/auth/me`, { credentials: "include" });
      if (!res.ok) { navigate("/login"); return; }

      const data = await res.json();
      if (data.role !== "admin") { navigate("/dashboard"); return; }

      /* load initial admin data */
      fetchMessages();
      fetchStats();
    } catch {
      navigate("/login");
    }
  };

  /* fetch admin stats */
  const fetchStats = async () => {
    try {
      const res = await fetch(`${api_url}/admin/stats`, { credentials: "include" });
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error("failed to fetch stats:", err);
    }
  };

  /* fetch contact messages */
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${api_url}/contact`, { credentials: "include" });
      if (!res.ok) throw new Error();
      setMessages(await res.json());
    } catch {
      setError("could not load messages.");
    } finally {
      setLoading(false);
    }
  };

  /* fetch all resources */
  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${api_url}/admin/resources`, { credentials: "include" });
      if (!res.ok) throw new Error();
      setResources(await res.json());
    } catch {
      setError("could not load resources.");
    } finally {
      setLoading(false);
    }
  };

  /* fetch all users */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${api_url}/admin/users`, { credentials: "include" });
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch {
      setError("could not load users.");
    } finally {
      setLoading(false);
    }
  };

  /* update message status (per admin) */
  const handleStatusChange = async (messageId, newStatus) => {
    try {
      const res = await fetch(`${api_url}/contact/${messageId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();

      setMessages(messages.map(m =>
        m._id === messageId ? { ...m, myStatus: newStatus } : m
      ));
    } catch {
      alert("could not update status.");
    }
  };

  /* delete a contact message */
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("delete this message permanently?")) return;
    setActionLoadingId(id);

    try {
      const res = await fetch(`${api_url}/contact/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) throw new Error();
      setMessages(messages.filter(m => m._id !== id));
    } catch {
      alert("could not delete message.");
    } finally {
      setActionLoadingId(null);
    }
  };

  /* delete a resource */
  const handleDeleteResource = async (id) => {
    if (!window.confirm("remove this resource from the platform?")) return;
    setActionLoadingId(id);

    try {
      const res = await fetch(`${api_url}/admin/resources/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) throw new Error();
      setResources(resources.filter(r => r._id !== id));
    } catch {
      alert("could not remove resource.");
    } finally {
      setActionLoadingId(null);
    }
  };

  /* delete a user */
  const handleDeleteUser = async (id) => {
    if (!window.confirm("delete this user permanently?")) return;
    setActionLoadingId(id);

    try {
      const res = await fetch(`${api_url}/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) { alert(data.error); return; }

      setUsers(users.filter(u => u._id !== id));
    } catch {
      alert("could not delete user.");
    } finally {
      setActionLoadingId(null);
    }
  };

  /* toggle admin role */
  const handleToggleAdmin = async (user) => {
    const isAdmin = user.role === "admin";
    const endpoint = isAdmin ? "remove-admin" : "make-admin";

    const confirmMsg = isAdmin
      ? `remove admin role from ${user.name}?`
      : `make ${user.name} an admin?`;

    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(user._id);

    try {
      const res = await fetch(`${api_url}/admin/users/${user._id}/${endpoint}`, {
        method: "PATCH",
        credentials: "include"
      });

      if (!res.ok) throw new Error();

      setUsers(users.map(u =>
        u._id === user._id ? { ...u, role: isAdmin ? "user" : "admin" } : u
      ));
    } catch {
      alert("could not update role.");
    } finally {
      setActionLoadingId(null);
    }
  };

  /* format date nicely */
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-ie", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

  return (
    <div className={`admin-page ${theme}`}>
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="admin-layout">
        <Sidebar />

        <main className="admin-main">

          {/* page header */}
          <div className="admin-header">
            <p className="admin-tagline">admin panel</p>

            <div className="admin-title-row">
              <AdminPanelSettingsRoundedIcon className="admin-title-icon" />
              <h1>admin dashboard</h1>
            </div>

            <p className="admin-subtitle">
              manage messages, resources, and users
            </p>
          </div>

          {/* stats section */}
          <div className="admin-stats">
            <div className="stat-card">
              <PeopleRoundedIcon className="stat-icon" />
              <div>
                <p className="stat-number">{stats.totalUsers}</p>
                <p className="stat-label">total users</p>
              </div>
            </div>

            <div className="stat-card">
              <FolderRoundedIcon className="stat-icon" />
              <div>
                <p className="stat-number">{stats.totalResources}</p>
                <p className="stat-label">total resources</p>
              </div>
            </div>

            <div className="stat-card">
              <MailRoundedIcon className="stat-icon" />
              <div>
                <p className="stat-number">{messages.length}</p>
                <p className="stat-label">messages</p>
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === "messages" ? "admin-tab--active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              <MailRoundedIcon className="tab-icon" /> messages
            </button>

            <button
              className={`admin-tab ${activeTab === "resources" ? "admin-tab--active" : ""}`}
              onClick={() => setActiveTab("resources")}
            >
              <FolderRoundedIcon className="tab-icon" /> resources
            </button>

            <button
              className={`admin-tab ${activeTab === "users" ? "admin-tab--active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <PeopleRoundedIcon className="tab-icon" /> users
            </button>
          </div>

          {error && <div className="admin-error">{error}</div>}
          {loading && <div className="admin-loading">loading...</div>}

          {/* messages tab */}
          {!loading && activeTab === "messages" && (
            <section className="admin-section">
              <p className="admin-section-count">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </p>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;