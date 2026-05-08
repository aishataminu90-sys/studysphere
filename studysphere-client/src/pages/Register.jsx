import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ThemeToggle from "../components/ThemeToggle";

import "../styles/Register.css";

function Register({ theme, setTheme }) {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Email validation
  const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  // Full name validation
  const isValidFullName = (name) => /^[A-Za-z\s'-]+$/.test(name);

  // Password validation
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);

  // Text field validation
  const isValidText = (text) => /^[A-Za-z\s'-]+$/.test(text);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
      general: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();
    const university = form.university.trim();
    const course = form.course.trim();
    const year = form.year.trim();

    // Full name validation
    if (!fullName) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.split(" ").length < 2) {
      newErrors.fullName = "Please enter your first and last name";
    } else if (!isValidFullName(fullName)) {
      newErrors.fullName = "Full name can only contain letters";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (email.includes(" ")) {
      newErrors.email = "Email cannot contain spaces";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!isStrongPassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // University validation
    if (!university) {
      newErrors.university = "University is required";
    } else if (university.length < 2) {
      newErrors.university = "University name is too short";
    }

    // Course validation
    if (!course) {
      newErrors.course = "Course is required";
    }

    // Year validation
    if (!year) {
      newErrors.year = "Year is required";
    }

    // Save all errors to state so they appear on the UI
    setErrors(newErrors);

    // If no errors exist, the form is valid
    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: fullName,
            email,
            password,
            university,
            year,
            course,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ general: data.error || "Registration failed" });
          return;
        }

        setSuccess("Registration successful! Redirecting to login...");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } catch (error) {
        setErrors({ general: "Could not connect to server" });
      } finally {
        setIsSubmitting(false);
      }
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

          {errors.general && <p className="error-message">{errors.general}</p>}
          {success && <p className="success-message">{success}</p>}

          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className={errors.fullName ? "input-error" : ""}
          />
          {errors.fullName && <p className="error-message">{errors.fullName}</p>}

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
          <select
            name="course"
            value={form.course}
            onChange={handleChange}
            className={errors.course ? "input-error" : ""}
          >
            <option value=""disabled>Select Course</option>
            <option value="Law">Law</option>
            <option value="Computing Science">Computing Science</option>
            <option value="Business">Business</option>
          </select>

          {errors.course && (
            <p className="error-message">{errors.course}</p>
          )}

          {/* Year */}
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className={errors.year ? "input-error" : ""}
          >
            <option value="" disabled>Select Year</option>
            <option value="Year 1">Year 1</option>
            <option value="Year 2">Year 2</option>
            <option value="Year 3">Year 3</option>
            <option value="Year 4">Year 4</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
          {errors.year && <p className="error-message">{errors.year}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <p className="link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>

      <Footer theme={theme} />
    </main>
  );
}

export default Register;