// Dashboard.jsx - Main page shown after login
// Layout inspired by Moodle: top navbar, sidebar, course-style cards
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // Controls dark/light mode - matches Aishat's theme system
  const [theme, setTheme] = useState("glass");

  // Mock username - will come from backend auth later
  const username = "Aisha";

  // Mock recent resources - will be fetched from backend later
  const [recentResources] = useState([
    { id: 1, title: "Data Structures Notes", module: "CS201", type: "PDF" },
    { id: 2, title: "Contract Law Summary", module: "LAW101", type: "Document" },
    { id: 3, title: "Marketing Slides", module: "BUS301", type: "Slides" },
  ]);

  // Mock reminders - will be fetched from backend later
  const [reminders] = useState([
    { id: 1, title: "Study for Algorithms Exam", dueDate: "2026-05-01" },
    { id: 2, title: "Submit Law Essay", dueDate: "2026-05-03" },
  ]);

  // Mock study groups - will be fetched from backend later
  const [studyGroups] = useState([
    { id: 1, name: "CS Study Squad", module: "CS201", members: 5 },
    { id: 2, name: "Law Revision Group", module: "LAW101", members: 3 },
  ]);

  return (
    <div className={`dashboard-page ${theme}`}>

      {/* Sidebar navigation */}
      <Sidebar />

      <div className="dashboard-wrapper">

        {/* Top bar - like Moodle's header */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <h2>📘 My Dashboard</h2>
          </div>
          <div className="dash-topbar-right">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>

        {/* Welcome banner */}
        <div className="dash-welcome-banner">
          <div>
            <p className="dash-tagline">YOUR STUDY HUB</p>
            <h1>Welcome back, {username}! 👋</h1>
            <p className="dash-subtitle">You have {reminders.length} upcoming reminders and {studyGroups.length} active study groups.</p>
          </div>
          <div className="dash-quick-actions">
            <button className="action-btn" onClick={() => navigate("/upload")}>⬆️ Upload</button>
            <button className="action-btn" onClick={() => navigate("/resources")}>📚 Resources</button>
            <button className="action-btn" onClick={() => navigate("/studygroups")}>👥 Groups</button>
            <button className="action-btn" onClick={() => navigate("/reminders")}>🔔 Reminders</button>
          </div>
        </div>

        {/* Main content grid - Moodle style */}
        <main className="dash-content">

          {/* Left column - resources + groups */}
          <div className="dash-left-col">

            {/* Recent Resources - styled like Moodle course cards */}
            <section className="dash-section">
              <div className="dash-section-header">
                <h3>📚 Recent Resources</h3>
                <button className="dash-link-btn" onClick={() => navigate("/resources")}>View all</button>
              </div>
              <div className="dash-course-grid">
                {recentResources.map((resource) => (
                  <div key={resource.id} className="course-card">
                    {/* Coloured top bar like Moodle course cards */}
                    <div className="course-card-bar"></div>
                    <div className="course-card-body">
                      <span className="course-card-tag">{resource.type}</span>
                      <h4>{resource.title}</h4>
                      <p>{resource.module}</p>
                      <button className="course-card-btn" onClick={() => navigate("/resources")}>
                        Open →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Study Groups */}
            <section className="dash-section">
              <div className="dash-section-header">
                <h3>👥 My Study Groups</h3>
                <button className="dash-link-btn" onClick={() => navigate("/studygroups")}>View all</button>
              </div>
              <div className="dash-course-grid">
                {studyGroups.map((group) => (
                  <div key={group.id} className="course-card">
                    <div className="course-card-bar group-bar"></div>
                    <div className="course-card-body">
                      <span className="course-card-tag">{group.members} members</span>
                      <h4>{group.name}</h4>
                      <p>{group.module}</p>
                      <button className="course-card-btn" onClick={() => navigate("/studygroups")}>
                        Open →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right column - reminders timeline like Moodle timeline block */}
          <div className="dash-right-col">
            <section className="dash-section">
              <div className="dash-section-header">
                <h3>🔔 Upcoming</h3>
                <button className="dash-link-btn" onClick={() => navigate("/reminders")}>View all</button>
              </div>

              {/* Timeline list */}
              <div className="dash-timeline">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <p className="timeline-title">{reminder.title}</p>
                      <p className="timeline-date">📅 Due: {reminder.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick stats block like Moodle */}
            <section className="dash-section dash-stats">
              <h3>📊 Quick Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Resources</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">2</span>
                  <span className="stat-label">Groups</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">2</span>
                  <span className="stat-label">Reminders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Modules</span>
                </div>
              </div>
            </section>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Dashboard;