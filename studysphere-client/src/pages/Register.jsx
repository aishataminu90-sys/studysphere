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

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email required";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Invalid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password required";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Register submitted", form);
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

        <form className="register-card" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p>{errors.fullName}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

          <button type="submit">Register</button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;