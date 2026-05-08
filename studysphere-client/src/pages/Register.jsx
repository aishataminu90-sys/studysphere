import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import ThemeToggle from "../components/ThemeToggle";

import "../styles/Register.css";

function Register({ theme, setTheme }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    course: "",
    year: "",
  });


  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

     // Full name validation
    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Other fields validation
    if (!form.university.trim()) {
      newErrors.university = "University is required";
    }

    if (!form.course.trim()) {
      newErrors.course = "Course is required";
    }

    if (!form.year.trim()) {
      newErrors.year = "Year is required";
    }

    // Save all errors to state so they appear on the UI
    setErrors(newErrors);

    // If no errors exist, the form is valid
    if (Object.keys(newErrors).length === 0) {
      console.log("Register form submitted", form);
    }
  };
  return (
    <main className={`page register-page ${theme}`}>
      <Navbar theme={theme} />
      <ThemeToggle theme={theme} setTheme={setTheme} />

      <section className="register-wrapper">
        <div className="register-info">
          <h1>Create your account</h1>
          <p>Join StudySphere today.</p>
          
        </div>

        {/* Registration form */}
        <form className="register-card" onSubmit={handleSubmit} noValidate>
          <h2>Create Account</h2>
          <p className="subtitle">Join StudySphere today</p>

          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className={errors.fullName ? "input-error" : ""}
          />
          {errors.fullName && (
            <p className="error-message">{errors.fullName}</p>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "input-error" : ""}
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}

          {/* University */}
          <input
            type="text"
            name="university"
            placeholder="University"
            value={form.university}
            onChange={handleChange}
            className={errors.university ? "input-error" : ""}
          />
          {errors.university && (
            <p className="error-message">{errors.university}</p>
          )}

          {/* Course */}
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={form.course}
            onChange={handleChange}
            className={errors.course ? "input-error" : ""}
          />
          {errors.course && <p className="error-message">{errors.course}</p>}

          {/* Year */}
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            className={errors.year ? "input-error" : ""}
          />
          {errors.year && <p className="error-message">{errors.year}</p>}

          <button type="submit">Register</button>

          <p className="link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;