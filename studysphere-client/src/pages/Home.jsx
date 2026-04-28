import React from "react";
import "../styles/Home.css";

import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";

import Navbar from "../components/Navbar";
import ThemeToggle from "../components/ThemeToggle";

const themes = {
  glass: "Dark Mode",
  campus: "Light Mode",
};

// Added setTheme to props so ThemeToggle works
function Home({ theme, setTheme }) {

  return (
    <main className={`home ${theme}`}>
       <Navbar theme={theme} />
       <ThemeToggle theme={theme} setTheme={setTheme} />

      <div className="page-content">
        <section className="hero">
          <div className="hero-text">
            <p className="tagline">Your academic life, organised</p>

            <h1>Study smarter with your own student learning hub.</h1>

            <p className="description">
              Upload resources, discover useful notes, join study groups, save
              materials, and manage reminders all in one place.
            </p>

            <div className="hero-buttons">
              <a href="/register" className="primary-btn">
                Get Started
              </a>
              <a href="/login" className="secondary-btn">
                Login
              </a>
            </div>
          </div>

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