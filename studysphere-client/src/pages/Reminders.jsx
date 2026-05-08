// Reminders.jsx - Connected to the backend API
// Fetches reminders from GET /reminders
// Adds via POST /reminders, completes via PATCH /reminders/:id/complete
// Deletes via DELETE /reminders/:id

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

import AccessAlarmRoundedIcon from "@mui/icons-material/AccessAlarmRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

import "../styles/Reminders.css";

// Base API URL - set VITE_API_URL in your .env file
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Random motivational messages shown when a task is marked complete
const motivationalMessages = [
  "Great work! Keep it up! 🎉",
  "One step closer to your goals! 💪",
  "You are on a roll! 🔥",
  "That is the spirit! ⭐",
  "Smashing it! Keep going! 🚀",
  "Amazing effort! 👏",
];

function Reminders() {
  const [theme, setTheme] = useState("glass");

  // All reminders fetched from the backend
  const [reminders, setReminders] = useState([]);

  // Page-level loading and error states
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // Add reminder form visibility and values
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", dueDate: "" });
  const [errors, setErrors] = useState({});

  // Motivational message shown briefly after completing a task
  const [motivMessage, setMotivMessage] = useState("");

  // Tracks which reminder's button is currently loading
  const [loadingId, setLoadingId] = useState(null);

  // Fetch all reminders when page loads
  useEffect(() => {
    fetchReminders();
  }, []);

  // GET /reminders - fetches all reminders for the logged-in user
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/reminders`, {
        credentials: "include", // sends session cookie with request
      });
      if (!res.ok) throw new Error("Failed to load reminders");
      const data = await res.json();
      setReminders(data);
    } catch (err) {
      setFetchError("Could not load reminders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Updates a form field and clears its error as the user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // POST /reminders - validates and submits the add reminder form
  const handleAddReminder = async (e) => {
    e.preventDefault();

    // Client-side validation before hitting the API
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Reminder title is required";

    if (!form.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(form.dueDate) < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch(`${API_URL}/reminders`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          dueDate: form.dueDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || "Failed to add reminder" });
        return;
      }

      // Reset form, close it, and refresh reminders list
      setForm({ title: "", dueDate: "" });
      setShowForm(false);
      await fetchReminders();
    } catch (err) {
      setErrors({ general: "Something went wrong. Please try again." });
    }
  };

  // PATCH /reminders/:id/complete - toggles a reminder complete or incomplete
  const handleToggleComplete = async (id, currentlyCompleted) => {
    setLoadingId(id);
    try {
      const res = await fetch(`${API_URL}/reminders/${id}/complete`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update reminder");

      // Only show motivational message when marking as complete (not un-completing)
      if (!currentlyCompleted) {
        const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        setMotivMessage(msg);
        setTimeout(() => setMotivMessage(""), 3000);
      }

      await fetchReminders(); // refresh to get updated completed status
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  // DELETE /reminders/:id - permanently removes a reminder
  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      const res = await fetch(`${API_URL}/reminders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete reminder");

      // Remove the deleted reminder from state without refetching
      setReminders(reminders.filter((r) => r._id !== id));
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  // Formats a date into a readable string e.g. "10 May 2026"
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Separate reminders into pending and completed for two-section display
  const pendingReminders = reminders.filter((r) => !r.completed);
  const completedReminders = reminders.filter((r) => r.completed);

  return (
    <div className={`reminders-page ${theme}`}>
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="reminders-layout">
        <Sidebar />

        <main className="reminders-main">

          {/* Page heading */}
          <div className="reminders-header">
            <p className="reminders-tagline">STUDY TASKS</p>
            <h1>Reminders</h1>
            <p className="reminders-subtitle">
              Track your deadlines and stay on top of your study schedule.
            </p>
          </div>

          {/* Controls row */}
          <div className="reminders-controls">
            <p className="reminders-count">
              {loading ? "Loading..." : `${pendingReminders.length} pending`}
              {completedReminders.length > 0 && ` · ${completedReminders.length} completed`}
            </p>

            <button className="add-reminder-btn" onClick={() => setShowForm(!showForm)}>
              <AddRoundedIcon className="btn-icon" />
              {showForm ? "Cancel" : "Add Reminder"}
            </button>
          </div>

          {/* Motivational message shown after completing a task */}
          {motivMessage && <div className="motiv-banner">{motivMessage}</div>}

          {/* Fetch error */}
          {fetchError && <div className="fetch-error">{fetchError}</div>}

          {/* Add Reminder Form */}
          {showForm && (
            <form className="add-form" onSubmit={handleAddReminder} noValidate>
              <h2>Add a New Reminder</h2>

              {errors.general && <p className="error-message">{errors.general}</p>}

              <div className="form-field">
                <label htmlFor="title">Title</label>
                <input
                  id="title" type="text" name="title"
                  placeholder="e.g. Study for Algorithms Exam"
                  value={form.title} onChange={handleChange}
                  className={errors.title ? "input-error" : ""}
                />
                {errors.title && <p className="error-message">{errors.title}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate" type="date" name="dueDate"
                  value={form.dueDate} onChange={handleChange}
                  className={errors.dueDate ? "input-error" : ""}
                />
                {errors.dueDate && <p className="error-message">{errors.dueDate}</p>}
              </div>

              <button type="submit" className="submit-form-btn">Add Reminder</button>
            </form>
          )}

          {/* Loading state */}
          {loading && <div className="loading-state"><p>Loading reminders...</p></div>}

          {/* Empty state */}
          {!loading && reminders.length === 0 && (
            <div className="no-results"><p>No reminders yet. Add one to get started!</p></div>
          )}

          {/* All done banner */}
          {!loading && pendingReminders.length === 0 && completedReminders.length > 0 && (
            <div className="all-done-banner">🎉 All tasks completed! You are amazing!</div>
          )}

          {/* Pending reminders */}
          {!loading && pendingReminders.length > 0 && (
            <section className="reminders-section">
              <div className="section-heading">
                <AccessAlarmRoundedIcon className="section-heading-icon" />
                <h2>Upcoming</h2>
              </div>
              <div className="reminders-list">
                {pendingReminders.map((reminder) => (
                  <div key={reminder._id} className="reminder-card">
                    <div className="reminder-info">
                      {/* Circle button - marks reminder as complete */}
                      <button
                        className="complete-btn"
                        onClick={() => handleToggleComplete(reminder._id, reminder.completed)}
                        disabled={loadingId === reminder._id}
                        aria-label="Mark as complete"
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
                      onClick={() => handleDelete(reminder._id)}
                      disabled={loadingId === reminder._id}
                      aria-label="Delete reminder"
                    >
                      <DeleteRoundedIcon className="delete-icon" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed reminders */}
          {!loading && completedReminders.length > 0 && (
            <section className="reminders-section">
              <div className="section-heading">
                <CheckCircleRoundedIcon className="section-heading-icon done-icon" />
                <h2>Completed</h2>
              </div>
              <div className="reminders-list">
                {completedReminders.map((reminder) => (
                  <div key={reminder._id} className="reminder-card completed">
                    <div className="reminder-info">
                      {/* Filled circle - click to un-complete */}
                      <button
                        className="complete-btn done"
                        onClick={() => handleToggleComplete(reminder._id, reminder.completed)}
                        disabled={loadingId === reminder._id}
                        aria-label="Mark as incomplete"
                      >
                        <CheckCircleRoundedIcon className="complete-icon" />
                      </button>
                      <div className="reminder-text">
                        {/* Strikethrough on completed titles */}
                        <p className="reminder-title strikethrough">{reminder.title}</p>
                        <p className="reminder-date">
                          <CalendarTodayRoundedIcon className="date-icon" />
                          Due: {formatDate(reminder.dueDate)}
                        </p>
                      </div>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(reminder._id)}
                      disabled={loadingId === reminder._id}
                      aria-label="Delete reminder"
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