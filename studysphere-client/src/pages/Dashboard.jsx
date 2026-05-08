import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import "../styles/Dashboard.css";

// Dashboard is the main page the user lands on after logging in
// Layout is inspired by Moodle - course cards, timeline, and stats
function Dashboard() {
  const navigate = useNavigate();

  // Theme state - glass is dark mode, campus is light mode
  const [theme, setTheme] = useState("glass");

  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Hardcoded username for now - will come from auth/backend later
  const username = "Aisha";

  // Mock resources - will be replaced with real API call later
  const [recentResources] = useState([
    { id: 1, title: "Data Structures Notes", module: "CS201", type: "PDF" },
    { id: 2, title: "Contract Law Summary", module: "LAW101", type: "Document" },
    { id: 3, title: "Marketing Slides", module: "BUS301", type: "Slides" },
  ]);

  // Mock reminders - will be replaced with real API call later
  const [reminders] = useState([
    { id: 1, title: "Study for Algorithms Exam", dueDate: "2026-05-01" },
    { id: 2, title: "Submit Law Essay", dueDate: "2026-05-03" },
  ]);

  // Mock study groups - will be replaced with real API call later
  const [studyGroups] = useState([
    { id: 1, name: "CS Study Squad", module: "CS201", members: 5 },
    { id: 2, name: "Law Revision Group", module: "LAW101", members: 3 },
  ]);

  return (
     <div className={`dashboard-page ${theme} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>

      {/* Collapsible sidebar on the left */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Top navbar with theme toggle, home link, logout */}
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      {/* Main content area */}
      <div className="dashboard-content-wrapper">

        {/* Welcome banner */}
        <div className="dash-welcome-banner">
          <div>
            <p className="dash-tagline">YOUR STUDY HUB</p>
            <h1>Welcome back, {username}! 👋</h1>
            <p className="dash-subtitle">
              You have {reminders.length} upcoming reminders and {studyGroups.length} active study groups.
              Use the sidebar to navigate between pages.
            </p>
          </div>
        </div>

        {/* Main content - two columns like Moodle */}
        <main className="dash-content">

<<<<<<< HEAD
          {/* Left column - resources and groups */}
          <div className="dash-left-col">

            {/* Recent Resources section */}
            <section className="dash-section">
              <div className="dash-section-header">
                <div className="section-title">
                  <FolderRoundedIcon className="section-icon" />
                  <h3>Recent Resources</h3>
                </div>
                {/* Takes user to the full resources page */}
                <button className="dash-link-btn" onClick={() => navigate("/resources")}>
                  View all
                </button>
              </div>

              {/* Resource cards in a grid */}
              <div className="dash-course-grid">
                {recentResources.map((resource) => (
                  <div key={resource.id} className="course-card">
                    {/* Coloured top strip like Moodle course cards */}
                    <div className="course-card-bar"></div>
                    <div className="course-card-body">
                      <span className="course-card-tag">{resource.type}</span>
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
            </section>

            {/* Study Groups section */}
            <section className="dash-section">
              <div className="dash-section-header">
                <div className="section-title">
                  <GroupsRoundedIcon className="section-icon" />
                  <h3>My Study Groups</h3>
                </div>
                {/* Takes user to the full study groups page */}
                <button className="dash-link-btn" onClick={() => navigate("/studygroups")}>
                  View all
                </button>
              </div>

              <div className="dash-course-grid">
                {studyGroups.map((group) => (
                  <div key={group.id} className="course-card">
                    {/* Green bar for groups to distinguish from resources */}
                    <div className="course-card-bar group-bar"></div>
                    <div className="course-card-body">
                      <span className="course-card-tag">{group.members} members</span>
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
            </section>

=======
          {/* Page title bar */}
          <header className="dash-topbar">
            <div className="dash-topbar-left">
             <div className="feature">
              <FolderRoundedIcon className="feature-icons"/>
              <h2> My Dashboard</h2>
              </div> 
            </div>
          </header>

          {/* Welcome banner */}
          <div className="dash-welcome-banner">
            <div>
              <p className="dash-tagline">YOUR STUDY HUB</p>
              <h1>Welcome back, {username}! 👋</h1>
              <p className="dash-subtitle">You have {reminders.length} upcoming reminders and {studyGroups.length} active study groups.</p>
            </div>
>>>>>>> 4401871dd59f7689a1ac52b6f07f25d9a48c58b6
          </div>

          {/* Right column - reminders and stats */}
          <div className="dash-right-col">

<<<<<<< HEAD
            {/* Upcoming reminders timeline */}
            <section className="dash-section">
              <div className="dash-section-header">
                <div className="section-title">
                  <AccessAlarmRoundedIcon className="section-icon" />
                  <h3>Upcoming</h3>
=======
            {/* Left column - resources + groups */}
            <div className="dash-left-col">

              {/* Recent Resources - styled like Moodle course cards */}
              <section className="dash-section">
                <div className="dash-section-header">
                  <div className="feature">
                  <FolderRoundedIcon className="feature-icons"/>
                  <h3> Recent Resources</h3>
                  </div>
                  <button className="dash-link-btn" onClick={() => navigate("/resources")}>View all</button>
>>>>>>> 4401871dd59f7689a1ac52b6f07f25d9a48c58b6
                </div>
                <button className="dash-link-btn" onClick={() => navigate("/reminders")}>
                  View all
                </button>
              </div>

              <div className="dash-timeline">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="timeline-item">
                    {/* Dot on the left of each reminder */}
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <p className="timeline-title">{reminder.title}</p>
                      <p className="timeline-date">Due: {reminder.dueDate}</p>
                    </div>
<<<<<<< HEAD
=======
                  ))}
                </div>
              </section>

              {/* Study Groups */}
              <section className="dash-section">
                <div className="dash-section-header">
                  <div className="feature">
                  <GroupsRoundedIcon className="feature-icons"/>
                  <h3>My Study Groups</h3>
                  </div>
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
                  <div className="feature">
                    <AccessAlarmRoundedIcon className="feature-icons"/>
                    <h3>Upcoming</h3>
                  </div>
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
                <div className="feature">
                  <BarChartRoundedIcon className="feature-icons"/>
                  <h3>Quick Stats</h3>
                </div>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Resources</span>
>>>>>>> 4401871dd59f7689a1ac52b6f07f25d9a48c58b6
                  </div>
                ))}
              </div>
            </section>

            {/* Quick stats block */}
            <section className="dash-section dash-stats">
              <div className="section-title" style={{ marginBottom: "16px" }}>
                <BarChartRoundedIcon className="section-icon" />
                <h3>Quick Stats</h3>
              </div>
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