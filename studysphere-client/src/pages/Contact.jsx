// Contact.jsx - Contact page with form that saves messages to the database
// Messages appear in the Admin Dashboard for admins to manage

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/InfoPages.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Contact({ theme, setTheme }) {
  // Form field values
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Validation errors per field
  const [errors, setErrors] = useState({});

  // Success message shown after sending
  const [success, setSuccess] = useState("");

  // Prevents double submission
  const [submitting, setSubmitting] = useState(false);

  // Updates a field and clears its error
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validates and submits the contact form to POST /contact
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || "Failed to send message" });
        return;
      }

      // Clear the form and show success message
      setForm({ name: "", email: "", message: "" });
      setSuccess("Message sent successfully! We will get back to you soon.");
      setTimeout(() => setSuccess(""), 5000);

    } catch {
      setErrors({ general: "Could not connect to server. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={`info-page ${theme}`}>
      <Navbar theme={theme} />
      <ThemeToggle theme={theme} setTheme={setTheme} />

      <div className="info-wrapper">
        <section className="info-hero">
          <p className="info-tagline">CONTACT</p>
          <h1>Get in Touch</h1>
          <p className="info-subtitle">
            Have questions, feedback, or suggestions? We'd love to hear from you.
          </p>
        </section>

        <section className="contact-grid">
          <div className="contact-card">
            <h3>Email</h3>
            <p>studysphere.team@gmail.com</p>
          </div>
          <div className="contact-card">
            <h3>Location</h3>
            <p>Griffith College Dublin, Ireland</p>
          </div>
          <div className="contact-card">
            <h3>Support Hours</h3>
            <p>Monday – Friday · 9:00 AM – 5:00 PM</p>
          </div>
        </section>

        <section className="contact-form-card">
          <h2>Send a Message</h2>

          {/* Success message */}
          {success && <p className="contact-success">{success}</p>}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>

            {errors.general && <p className="contact-error">{errors.general}</p>}

            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <p className="contact-field-error">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <p className="contact-field-error">{errors.email}</p>}
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                rows="6"
                value={form.message}
                onChange={handleChange}
                className={errors.message ? "input-error" : ""}
              ></textarea>
              {errors.message && <p className="contact-field-error">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </div>

      <Footer theme={theme} />
    </main>
  );
}

export default Contact;