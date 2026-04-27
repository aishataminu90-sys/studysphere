import React from "react";
// Imports the CSS file for the Home page
import "../styles/Home.css";

// Material UI icons used for the feature cards and study plan card
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

// Theme names used by the ThemeToggle component
const themes = {
  glass: "Dark Mode",
  campus: "Light Mode",
};

function Home({theme}) {

  return (
    // The selected theme is added as a class name so CSS can change the page style
    <main className={`home ${theme}`}>

      {/* Keeps the main page content aligned and centered */}
      <div className="page-content">
        {/* Main hero section */}
        <section className="hero">
          <div className="hero-text">
            <p className="tagline">Your academic life, organised</p>

            <h1>Study smarter with your own student learning hub.</h1>

            <p className="description">
              Upload resources, discover useful notes, join study groups, save
              materials, and manage reminders all in one place.
            </p>

            {/* Main call-to-action buttons */}
            <div className="hero-buttons">
              <a href="/register" className="primary-btn">
                Get Started
              </a>
              <a href="/login" className="secondary-btn">
                Login
              </a>
            </div>
          </div>

          {/* Preview card showing what the user see after logging in */}
          <div className="hero-card">
            <div className="card-header">
              <span>Today&apos;s Study Plan</span>
              <span className="status">On track</span>
            </div>

            <div className="task-card">
              <h3>Database Notes</h3>
              <p>Saved from CS210 resources</p>
            </div>

            <div className="task-card">
              <h3>Web Dev Study Group</h3>
              <p>Next session: 7:00 PM</p>
            </div>

            <div className="task-card">
              <h3>Assignment Reminder</h3>

        
              <p className="task-text">
                Due tomorrow - stay on track
                <span className="task-icons">
                  <TaskAltRoundedIcon />
                  <MenuBookRoundedIcon />
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Feature cards showing the main StudySphere functionality */}
        <section className="features">
          <div className="feature-card">
            <FolderRoundedIcon className="feature-icon" />
            <h3>Share Resources</h3>
            <p>Upload notes, PDFs, links, and videos for your modules.</p>
          </div>

          <div className="feature-card">
            <SearchRoundedIcon className="feature-icon" />
            <h3>Find Materials</h3>
            <p>Search and filter resources by title, module, or tags.</p>
          </div>

          <div className="feature-card">
            <GroupsRoundedIcon className="feature-icon" />
            <h3>Study Groups</h3>
            <p>Create or join groups for exams, assignments, and revision.</p>
          </div>

          <div className="feature-card">
            <AccessAlarmRoundedIcon className="feature-icon" />
            <h3>Reminders</h3>
            <p>Track study tasks with motivational messages when completed.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;