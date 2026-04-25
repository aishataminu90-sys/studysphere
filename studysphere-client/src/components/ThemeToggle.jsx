// This component receives two props:
//  theme the current selected theme glass or campus
//  setTheme function used to change the theme
function ThemeToggle({ theme, setTheme }) {
  return (
    // Container for the theme buttons
    <section className="theme-switcher">

      {/* Dark Mode button */}
      <button
        // When clicked, sets theme to "glass"  dark mode
        onClick={() => setTheme("glass")}

        // If current theme is "glass", add "active" class for styling
        className={theme === "glass" ? "active" : ""}
      >
        Dark Mode
      </button>

      {/* Light Mode button */}
      <button
        // When clicked, sets theme to "campus" light mode
        onClick={() => setTheme("campus")}

        // If current theme is "campus", add "active" class
        className={theme === "campus" ? "active" : ""}
      >
        Light Mode
      </button>
    </section>
  );
}

export default ThemeToggle;