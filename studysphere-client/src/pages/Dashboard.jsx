import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import "../styles/Dashboard.css";

const API = import.meta.env.VITE_API_URL;

function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("glass");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [username, setUsername] = useState("Student");
  const [recentResources, setRecentResources] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get username from /auth/me endpoint
        const meRes = await fetch(`${API}/auth/me`, {
          credentials: "include",
        });
        if (meRes.ok) {
          const userData = await meRes.json();
          setUsername(userData.name);
        }

        // Fetch resources
        const resourcesRes = await fetch(`${API}/resources`, {
          credentials: "include",
        });
        if (resourcesRes.ok) {
          const resourcesData = await resourcesRes.json();
          setRecentResources(resourcesData.slice(0, 3));
        }

        // Fetch study groups
        const groupsRes = await fetch(`${API}/groups`, {
          credentials: "include",
        });
        if (groupsRes.ok) {
          const groupsData = await groupsRes.json();
          setStudyGroups(groupsData.slice(0, 2));
        }

        // Fetch reminders
        const remindersRes = await fetch(`${API}/reminders`, {
          credentials: "include",
        });
        if (remindersRes.ok) {
          const remindersData = await remindersRes.json();
          setReminders(remindersData.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={`dashboard-page ${theme} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="dashboard-layout">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

        <div className="dashboard-wrapper">
          <header className="dash-topbar">
            <div className="dash-topbar-left">
              <div className="feature">
                <DashboardRoundedIcon className="feature-icons" />
                <h2>My Dashboard</h2>
              </div>
            </div>
          </header>

          <div className="dash-welcome-banner">
            <div>
              <p className="dash-tagline">YOUR STUDY HUB</p>
              <h1>Welcome back, {username}! 👋</h1>
              <p className="dash-subtitle">
                You have {reminders.length} upcoming reminders and{" "}
                {studyGroups.length} active study groups.
              </p>
            </div>
          </div>

          {loading ? (
            <p style={{ padding: "2rem", opacity: 0.6 }}>Loading your dashboard...</p>
          ) : (
            <main className="dash-content">
              <div className="dash-left-col">

                {/* Recent Resources */}
                <section className="dash-section">
                  <div className="dash-section-header">
                    <div className="feature">
                      <FolderRoundedIcon className="feature-icons" />
                      <h3>Recent Resources</h3>
                    </div>
                    <button className="dash-link-btn" onClick={() => navigate("/resources")}>
                      View all
                    </button>
                  </div>

                  {recentResources.length === 0 ? (
                    <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>No resources yet.</p>
                  ) : (
                    <div className="dash-course-grid">
                      {recentResources.map((resource) => (
                        <div key={resource._id} className="course-card">
                          <div className="course-card-bar"></div>
                          <div className="course-card-body">
                            <span className="course-card-tag">
                              {Array.isArray(resource.tags) ? resource.tags[0] : resource.tags}
                            </span>
                            <h4>{resource.title}</h4>
                            <p>{resource.module}</p>
                            <button
                              className="course-card-btn"
                              onClick={() => navigate("/resources")}
                            >
                              Open →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Study Groups */}
                <section className="dash-section">
                  <div className="dash-section-header">
                    <div className="feature">
                      <GroupsRoundedIcon className="feature-icons" />
                      <h3>My Study Groups</h3>
                    </div>
                    <button className="dash-link-btn" onClick={() => navigate("/studygroups")}>
                      View all
                    </button>
                  </div>

                  {studyGroups.length === 0 ? (
                    <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>No study groups yet.</p>
                  ) : (
                    <div className="dash-course-grid">
                      {studyGroups.map((group) => (
                        <div key={group._id} className="course-card">
                          <div className="course-card-bar group-bar"></div>
                          <div className="course-card-body">
                            <span className="course-card-tag">
                              {group.members?.length ?? 0} members
                            </span>
                            <h4>{group.name}</h4>
                            <p>{group.module}</p>
                            <button
                              className="course-card-btn"
                              onClick={() => navigate("/studygroups")}
                            >
                              Open →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* Right column */}
              <div className="dash-right-col">
                <section className="dash-section">
                  <div className="dash-section-header">
                    <div className="feature">
                      <AccessAlarmRoundedIcon className="feature-icons" />
                      <h3>Upcoming</h3>
                    </div>
                    <button className="dash-link-btn" onClick={() => navigate("/reminders")}>
                      View all
                    </button>
                  </div>

                  {reminders.length === 0 ? (
                    <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>No reminders yet.</p>
                  ) : (
                    <div className="dash-timeline">
                      {reminders.map((reminder) => (
                        <div key={reminder._id} className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <p className="timeline-title">{reminder.title}</p>
                            <p className="timeline-date">
                              📅 Due:{" "}
                              {reminder.dueDate
                                ? new Date(reminder.dueDate).toLocaleDateString()
                                : "No date set"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Quick Stats */}
                <section className="dash-section dash-stats">
                  <div className="feature">
                    <BarChartRoundedIcon className="feature-icons" />
                    <h3>Quick Stats</h3>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-number">{recentResources.length}</span>
                      <span className="stat-label">Resources</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{studyGroups.length}</span>
                      <span className="stat-label">Groups</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{reminders.length}</span>
                      <span className="stat-label">Reminders</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">
                        {[...new Set(recentResources.map((r) => r.module))].length}
                      </span>
                      <span className="stat-label">Modules</span>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;