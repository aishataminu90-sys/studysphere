import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ThemeToggle from "../components/ThemeToggle";

import "../styles/Login.css";

function Login({ theme, setTheme }) {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  // form state
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // simple email check
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // update form values + clear errors as user types
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

    // basic validation before api call
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "email is required";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || "login failed" });
        return;
      }

      // check user role
      const meRes = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        { credentials: "include" }
      );

      const meData = await meRes.json();

      setSuccess("login successful. redirecting...");

      setTimeout(() => {
        if (meData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch {
      setErrors({ general: "could not connect to server" });
    }
  };

  return (
    <main className={`page login-page ${theme}`}>
      <Navbar theme={theme} />
      <ThemeToggle theme={theme} setTheme={setTheme} />

      <section className="login-wrapper">
        {/* left side */}
        <div className="login-info">
          <p className="login-tagline">welcome back</p>
          <h1>continue your study journey.</h1>
          <p>access resources, study groups, and reminders easily.</p>
        </div>

        {/* right side form */}
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <h2>login</h2>
          <p className="subtitle">enter your details to continue</p>

          {errors.general && (
            <p className="error-message">{errors.general}</p>
          )}

          {success && (
            <p className="success-message">{success}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="error-message">{errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}

          <button type="submit">login</button>

          <p className="forgot-link">
            <a href="#">forgot password?</a>
          </p>

          <p className="link">
            don't have an account? <Link to="/register">register</Link>
          </p>
        </form>
      </section>

      <Footer theme={theme} />
    </main>
  );
}

export default Login;