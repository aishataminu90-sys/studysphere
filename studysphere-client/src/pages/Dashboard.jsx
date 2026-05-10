// dashboard.jsx - main page shown after login
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

const api = import.meta.env.VITE_API_URL;

function Dashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("glass");

  /* user + dashboard data */
  const [username, setUsername] = useState("Student");
  const [recentResources, setRecentResources] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        /* get username from cookie (set during login) */
        const cookies = document.cookie.split(";");
        const usernameCookie = cookies.find((c) =>
          c.trim().startsWith("username=")
        );

        if (usernameCookie) {
          setUsername(decodeURIComponent(usernameCookie.split("=")[1]));
        }

        /* fetch recent resources */
        const resourcesRes = await fetch(`${api}/resources`, {
          credentials: "include",
        });

        if (resourcesRes.ok) {
          const resourcesData = await resourcesRes.json();
          setRecentResources(resourcesData.slice(0, 3));
        }

        /* fetch study groups */
        const groupsRes = await fetch(`${api}/groups`, {
          credentials: "include",
        });

        if (groupsRes.ok) {
          const groupsData = await groupsRes.json();
          setStudyGroups(groupsData.slice(0, 2));
        }

        /* fetch reminders */
        const remindersRes = await fetch(`${api}/reminders`, {
          credentials: "include",
        });

        if (remindersRes.ok) {
          const remindersData = await remindersRes.json();
          setReminders(remindersData.slice(0, 5));
        }
      } catch (err) {
        console.error("failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={`dashboard-page ${theme}`}>
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="dashboard-layout">
        <Sidebar />

        <div className="dashboard-wrapper">

          {/* top bar */}
          <header className="dash-topbar">
            <div className="dash-topbar-left">
              <div className="feature">
                <DashboardRoundedIcon className="feature-icons" />
                <h2>my dashboard</h2>
              </div>
            </div>
          </header>

          {/* welcome banner */}
          <div className="dash-welcome-banner">
            <div>
              <p className="dash-tagline">your study hub</p>
              <h1>Welcome back, {username}! 👋</h1>
              <p className="dash-subtitle">
                You have {reminders.length} upcoming reminders and{" "}
                {studyGroups.length} active study groups.
              </p>
            </div>
          </div>

          {loading ? (
            <p style={{ padding: "2rem", opacity: 0.6 }}>
              loading your dashboard...
            </p>
          ) : (
            <main className="dash-content">

              {/* left column */}
              <div className="dash-left-col">

                {/* recent resources */}
                <section className="dash-section">
                  <div className="dash-section-header">
                    <div className="feature">
                      <FolderRoundedIcon className="feature-icons" />
                      <h3>recent resources</h3>
                    </div>

                    <button
                      className="dash-link-btn"
                      onClick={() => navigate("/resources")}
                    >
                      view all
                    </button>
                  </div>

                  {recentResources.length === 0 ? (
                    <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>
                      no resources yet.
                    </p>
                  ) : (
                    <div className="dash-course-grid">
                      {recentResources.map((resource) => (
                        <div key={resource._id} className="course-card">
                          <div className="course-card-bar"></div>
                          <div className="course-card-body">
                            <span className="course-card-tag">
                              {Array.isArray(resource.tags)
                                ? resource.tags[0]
                                : resource.tags}
                            </span>
                            <h4>{resource.title}</h4>
                            <p>{resource.module}</p>
                            <button
                              className="course-card-btn"
                              onClick={() => navigate("/resources")}
                            >
                              open →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* study groups */}
                <section className="dash-section">
                  <div className="dash-section-header">
                    <div className="feature">
                      <GroupsRoundedIcon className="feature-icons" />
                      <h3>my study groups</h3>
                    </div>

                    <button
                      className="dash-link-btn"
                      onClick={() => navigate("/studygroups")}
                    >
                      view all
                    </button>
                  </div>

                  {studyGroups.length === 0 ? (
                    <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>
                      no study groups yet.
                    </p>
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
                              open →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* right column */}
              <div className="dash-right-col">

                {/* reminders */}
                <section className="dash-section">
                  <div className="dash-section-header">
                    <div className="feature">
                      <AccessAlarmRoundedIcon className="feature-icons" />
                      <h3>upcoming</h3>
                    </div>

                    <button
                      className="dash-link-btn"
                      onClick={() => navigate("/reminders")}
                    >
                      view all
                    </button>
                  </div>

                  {reminders.length === 0 ? (
                    <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>
                      no reminders yet.
                    </p>
                  ) : (
                    <div className="dash-timeline">
                      {reminders.map((reminder) => (
                        <div key={reminder._id} className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div className="timeline-content">
                            <p className="timeline-title">
                              {reminder.title}
                            </p>
                            <p className="timeline-date">
                              📅 due:{" "}
                              {reminder.dueDate
                                ? new Date(reminder.dueDate).toLocaleDateString()
                                : "no date set"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* quick stats */}
                <section className="dash-section dash-stats">
                  <div className="feature">
                    <BarChartRoundedIcon className="feature-icons" />
                    <h3>quick stats</h3>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-number">
                        {recentResources.length}
                      </span>
                      <span className="stat-label">resources</span>
                    </div>

                    <div className="stat-item">
                      <span className="stat-number">
                        {studyGroups.length}
                      </span>
                      <span className="stat-label">groups</span>
                    </div>

                    <div className="stat-item">
                      <span className="stat-number">{reminders.length}</span>
                      <span className="stat-label">reminders</span>
                    </div>

                    <div className="stat-item">
                      <span className="stat-number">
                        {[...new Set(recentResources.map((r) => r.module))]
                          .length}
                      </span>
                      <span className="stat-label">modules</span>
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