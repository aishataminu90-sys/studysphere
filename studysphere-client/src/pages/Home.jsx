import React from "react";
import "../styles/Home.css";

import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ThemeToggle from "../components/ThemeToggle";

const themes = {
  glass: "Dark Mode",
  campus: "Light Mode",
};

const teamMembers = [
  {
    name: "Aishat Aminu",
    studentNo: "3135224",
    role: "Frontend Developer",
    contribution: "Built the Home, Login, and Register pages. Implemented React Router, the Navbar, ThemeToggle, and deployed the app to Render.",
    initial: "A",
  },
  {
    name: "Aisha Abdul Karim",
    studentNo: "3127257",
    role: "Frontend Developer",
    contribution: "Built the Dashboard, Resources, and Upload Resource pages. Created the Sidebar and DashboardNavbar components and integrated the dark/light theme system.",
    initial: "A",
  },
  {
    name: "Michelle Eberiere Otomewo",
    studentNo: "3135990",
    role: "Frontend Developer",
    contribution: "Built the Study Groups and Reminders pages with full client-side validation, join/leave logic, task completion with motivational messages, and wrote the README documentation.",
    initial: "M",
  },
];


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
        <div className="about-wrapper">
          {/* Hero section */}
          <section className="about-hero">
            <p className="about-tagline">WHO WE ARE</p>
            <h1>About StudySphere</h1>
            <p className="about-subtitle">
              StudySphere was built by three computing students at Griffith College Dublin
              who wanted to solve a real problem — study resources scattered across
              group chats, multiple platforms, and messy folders.
            </p>
          </section>

          {/* Mission section */}
          <section className="about-mission">
            <div className="mission-card">
              <SchoolRoundedIcon className="mission-icon" />
              <div>
                <h2>Our Mission</h2>
                <p>
                  To give every university student one centralised platform where they
                  can upload and discover study materials, join or create study groups,
                  and keep track of their deadlines — all in one place, without the
                  chaos of switching between apps.
                </p>
              </div>
            </div>
          </section>
           {/* Meet the team */}
        <section className="about-team">
          <h2>Meet the Team</h2>
          <p className="team-subtitle">
            Built as part of the Web Technologies module at Griffith College Dublin, Stage 3.
          </p>

          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.studentNo} className="team-card">

                {/* Avatar with initial */}
                <div className="team-avatar">
                  {member.initial}
                </div>

                <h3 className="team-name">{member.name}</h3>
                <p className="team-student-no">Student No. {member.studentNo}</p>
                <span className="team-role">{member.role}</span>
                <p className="team-contribution">{member.contribution}</p>
              </div>
            ))}
          </div>
        </section>
        </div>
      </div>
      <Footer theme={theme} />
    </main>
  );
}

export default Home;