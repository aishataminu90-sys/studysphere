import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ThemeToggle from "../components/ThemeToggle";

import "../styles/Login.css";

function Login({ theme, setTheme }) {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  // Controlled form state for email and password fields
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Basic email format check using regex
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Updates the matching form field and clears its error on every keystroke
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation before hitting the API
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    // Only proceed if there are no validation errors
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // sends the session cookie with the request
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ general: data.error || "Login failed" });
          return;
        }

        // Fetch the logged-in user's role to determine where to redirect
        const meRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: "include",
        });
        const meData = await meRes.json();

        setSuccess("Login successful! Redirecting...");

        // Redirect admins to /admin, all other users to /dashboard
        setTimeout(() => {
          if (meData.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 1000);

      } catch (error) {
        setErrors({ general: "Could not connect to server" });
      }
    }
  };

  return (
    <main className={`page login-page ${theme}`}>
      <Navbar theme={theme} />
      <ThemeToggle theme={theme} setTheme={setTheme} />

      <section className="login-wrapper">
        {/* Left side  marketing copy */}
        <div className="login-info">
          <p className="login-tagline">Welcome back</p>
          <h1>Continue your study journey.</h1>
          <p>
            Access resources, study groups, and reminders easily.
          </p>
        </div>

        {/* Right side  login form */}
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h2>Login</h2>
          <p className="subtitle">Enter your details to continue</p>

          {/* General API error (e.g. wrong credentials) */}
          {errors.general && <p className="error-message">{errors.general}</p>}
          {success && <p className="success-message">{success}</p>}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

          <button type="submit">Login</button>

          <p className="forgot-link">
            <a href="#">Forgot password?</a>
          </p>

          <p className="link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </section>
      <Footer theme={theme} />
    </main>
  );
}

export default Login;