import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  const [theme, setTheme] = useState("glass");

  return (
    <Router>
      <main className={`app ${theme}`}>
        <Navbar theme={theme} />
        <ThemeToggle theme={theme} setTheme={setTheme} />

        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/register" element={<Register theme={theme} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;