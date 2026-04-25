// useState is used to store the current theme, form values, and validation errors
import { useState } from "react";

//  navigation without refreshing the page
import { Link } from "react-router-dom";

import "../styles/Login.css";

// Shared components used across pages
import Navbar from "../components/Navbar";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  // Stores the current theme. "glass" is dark mode and "campus" is light mode.
  const [theme, setTheme] = useState("glass");

  // Stores the values typed into the login form
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Stores validation error messages for each input
  const [errors, setErrors] = useState({});

  // Checks whether the email has a basic valid email format
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Updates the form when the user types into an input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Clears the error for the field the user is currently editing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // Runs when the user submits the login form
  const handleSubmit = (e) => {
    // Stops the browser from refreshing the page
    e.preventDefault();

    const newErrors = {};

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    // Saves any validation errors so they can be shown on the page
    setErrors(newErrors);

    // If there are no errors, the form is ready to be sent to the backend
    if (Object.keys(newErrors).length === 0) {
      console.log("Login form submitted", form);
    }
  };

  return (
    // Adds the selected theme as a class so CSS can switch between dark and light mode
    <main className={`page login-page ${theme}`}>
      <Navbar />

      {/* Allows the user to switch between dark and light mode */}
      <ThemeToggle theme={theme} setTheme={setTheme} />

      <section className="login-wrapper">
        {/* Left side text section */}
        <div className="login-info">
          <p className="login-tagline">Welcome back</p>
          <h1>Continue your study journey.</h1>
          <p>
            Access saved resources, study groups, reminders, and everything you
            need to stay organised.
          </p>
        </div>

        {/* Login form */}
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h2>Login</h2>
          <p className="subtitle">Enter your details to continue</p>

          {/* Email input */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          {/* Password input */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

          <button type="submit">Login</button>

          <p className="forgot-link">
            <a href="#">Forgot password?</a>
          </p>

          <p className="link">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;