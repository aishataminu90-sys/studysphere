import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/InfoPages.css";

function Terms({ theme, setTheme }) {
  return (
    <main className={`info-page ${theme}`}>
      <Navbar theme={theme} />

      <div className="info-wrapper">
        <section className="info-hero">
          <p className="info-tagline">LEGAL</p>
          <h1>Terms & Conditions</h1>
          <p className="info-subtitle">
            By using StudySphere, you agree to the following terms and conditions.
          </p>
        </section>

        <section className="terms-card">
          <div className="terms-section">
            <h2>User Accounts</h2>
            <p>
              Users are responsible for maintaining the confidentiality of their
              accounts and passwords.
            </p>
          </div>

          <div className="terms-section">
            <h2>Acceptable Use</h2>
            <p>
              Users must not upload harmful, offensive, or copyrighted content
              without permission.
            </p>
          </div>

          <div className="terms-section">
            <h2>Resources & Content</h2>
            <p>
              StudySphere allows students to share educational materials for
              academic purposes only.
            </p>
          </div>

          <div className="terms-section">
            <h2>Privacy</h2>
            <p>
              We respect user privacy and do not share personal data with third
              parties.
            </p>
          </div>

          <div className="terms-section">
            <h2>Changes to Terms</h2>
            <p>
              StudySphere may update these terms in the future as the platform
              develops.
            </p>
          </div>
        </section>
      </div>

      <Footer theme={theme} />
    </main>
  );
}

export default Terms;