// Reminders.jsx - Page where users manage study tasks and deadlines
// Layout mirrors Resources.jsx: DashboardNavbar + Sidebar + main content

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

// Material UI icons
import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

import "../styles/Reminders.css";

// Motivational messages shown when a task is marked complete - adds fun to the experience
const motivationalMessages = [
  "Great work! Keep it up! 🎉",
  "One step closer to your goals! 💪",
  "You're on a roll! 🔥",
  "That's the spirit! ⭐",
  "Smashing it! Keep going! 🚀",
  "Amazing effort! 👏",
];

// Mock reminder data - will be fetched from the backend later
const initialReminders = [
  { id: 1, title: "Study for Algorithms Exam", dueDate: "2026-05-10", completed: false },
  { id: 2, title: "Submit Law Essay", dueDate: "2026-05-12", completed: false },
  { id: 3, title: "Prepare Marketing Presentation", dueDate: "2026-05-14", completed: false },
  { id: 4, title: "Review Database Notes", dueDate: "2026-05-08", completed: false },
];

function Reminders() {
  // Theme state - glass is dark mode, campus is light mode
  const [theme, setTheme] = useState("glass");

  // Full list of reminders
  const [reminders, setReminders] = useState(initialReminders);

  // Controls whether the add reminder form is visible
  const [showForm, setShowForm] = useState(false);

  // Stores the values the user types into the add reminder form
  const [form, setForm] = useState({ title: "", dueDate: "" });

  // Stores validation error messages for each form field
  const [errors, setErrors] = useState({});

  // Stores a motivational message to show after completing a task
  const [motivMessage, setMotivMessage] = useState("");

  // Updates a form field as the user types and clears its error
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validates the form and adds the new reminder to the list
  const handleAddReminder = (e) => {
    e.preventDefault(); // prevent page reload

    const newErrors = {};

    // Title must not be empty
    if (!form.title.trim()) newErrors.title = "Reminder title is required";

    // Due date must not be empty
    if (!form.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      // Due date must not be in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(form.dueDate) < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);

    // Only add if no validation errors exist
    if (Object.keys(newErrors).length === 0) {
      const newReminder = {
        id: reminders.length + 1,
        title: form.title,
        dueDate: form.dueDate,
        completed: false,
      };

      setReminders([...reminders, newReminder]);

      // Reset and close the form
      setForm({ title: "", dueDate: "" });
      setShowForm(false);
    }
  };

  // Toggles a reminder between complete and incomplete
  // Shows a motivational message when marking as complete
  const handleToggleComplete = (id) => {
    setReminders(reminders.map((r) => {
      if (r.id === id) {
        // Only show the message when marking as complete (not when un-completing)
        if (!r.completed) {
          const randomMsg = motivationalMessages[
            Math.floor(Math.random() * motivationalMessages.length)
          ];
          setMotivMessage(randomMsg);
          // Clear the message after 3 seconds
          setTimeout(() => setMotivMessage(""), 3000);
        }
        return { ...r, completed: !r.completed };
      }
      return r;
    }));
  };

  // Removes a reminder from the list permanently
  const handleDelete = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  // Split reminders into pending and completed for separate display
  const pendingReminders = reminders.filter((r) => !r.completed);
  const completedReminders = reminders.filter((r) => r.completed);

  // Format the date string into a readable format e.g. "10 May 2026"
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={`reminders-page ${theme}`}>

      {/* Top navbar - logo, theme toggle, home, logout */}
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="reminders-layout">
        <Sidebar />

        <main className="reminders-main">

          {/* Page heading - matches Resources and StudyGroups heading style */}
          <div className="reminders-header">
            <p className="reminders-tagline">STUDY TASKS</p>
            <h1>Reminders</h1>
            <p className="reminders-subtitle">
              Track your deadlines and stay on top of your study schedule.
            </p>
          </div>

          {/* Controls row: stats + add button */}
          <div className="reminders-controls">
            <p className="reminders-count">
              {pendingReminders.length} pending
              {completedReminders.length > 0 && ` · ${completedReminders.length} completed`}
            </p>

            {/* Toggles the add reminder form */}
            <button
              className="add-reminder-btn"
              onClick={() => setShowForm(!showForm)}
            >
              <AddRoundedIcon className="btn-icon" />
              {showForm ? "Cancel" : "Add Reminder"}
            </button>
          </div>

          {/* Motivational message shown briefly after completing a task */}
          {motivMessage && (
            <div className="motiv-banner">{motivMessage}</div>
          )}

          {/* Add Reminder Form - only shown when showForm is true */}
          {showForm && (
            <form className="add-form" onSubmit={handleAddReminder} noValidate>
              <h2>Add a New Reminder</h2>

              {/* Title input */}
              <div className="form-field">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="e.g. Study for Algorithms Exam"
                  value={form.title}
                  onChange={handleChange}
                  className={errors.title ? "input-error" : ""}
                />
                {errors.title && <p className="error-message">{errors.title}</p>}
              </div>

              {/* Due Date input */}
              <div className="form-field">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className={errors.dueDate ? "input-error" : ""}
                />
                {errors.dueDate && <p className="error-message">{errors.dueDate}</p>}
              </div>

              <button type="submit" className="submit-form-btn">
                Add Reminder
              </button>
            </form>
          )}

          {/* Pending reminders section */}
          {pendingReminders.length > 0 && (
            <section className="reminders-section">
              <div className="section-heading">
                <AccessAlarmRoundedIcon className="section-heading-icon" />
                <h2>Upcoming</h2>
              </div>

              <div className="reminders-list">
                {pendingReminders.map((reminder) => (
                  <div key={reminder.id} className="reminder-card">
                    <div className="reminder-info">

                      {/* Circle button to mark complete */}
                      <button
                        className="complete-btn"
                        onClick={() => handleToggleComplete(reminder.id)}
                        aria-label="Mark as complete"
                        title="Mark as complete"
                      >
                        <RadioButtonUncheckedRoundedIcon className="complete-icon" />
                      </button>

                      <div className="reminder-text">
                        <p className="reminder-title">{reminder.title}</p>
                        <p className="reminder-date">
                          <CalendarTodayRoundedIcon className="date-icon" />
                          Due: {formatDate(reminder.dueDate)}
                        </p>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(reminder.id)}
                      aria-label="Delete reminder"
                      title="Delete reminder"
                    >
                      <DeleteRoundedIcon className="delete-icon" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state when there are no pending reminders */}
          {pendingReminders.length === 0 && completedReminders.length === 0 && (
            <div className="no-results">
              <p>No reminders yet. Add one to get started!</p>
            </div>
          )}

          {pendingReminders.length === 0 && completedReminders.length > 0 && (
            <div className="all-done-banner">
              🎉 All tasks completed! You are amazing!
            </div>
          )}

          {/* Completed reminders section - shown when at least one is done */}
          {completedReminders.length > 0 && (
            <section className="reminders-section">
              <div className="section-heading">
                <CheckCircleRoundedIcon className="section-heading-icon done-icon" />
                <h2>Completed</h2>
              </div>

              <div className="reminders-list">
                {completedReminders.map((reminder) => (
                  <div key={reminder.id} className="reminder-card completed">
                    <div className="reminder-info">

                      {/* Filled circle button to un-complete */}
                      <button
                        className="complete-btn done"
                        onClick={() => handleToggleComplete(reminder.id)}
                        aria-label="Mark as incomplete"
                        title="Mark as incomplete"
                      >
                        <CheckCircleRoundedIcon className="complete-icon" />
                      </button>

                      <div className="reminder-text">
                        {/* Title gets strikethrough when completed */}
                        <p className="reminder-title strikethrough">{reminder.title}</p>
                        <p className="reminder-date">
                          <CalendarTodayRoundedIcon className="date-icon" />
                          Due: {formatDate(reminder.dueDate)}
                        </p>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(reminder.id)}
                      aria-label="Delete reminder"
                      title="Delete reminder"
                    >
                      <DeleteRoundedIcon className="delete-icon" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}

export default Reminders;