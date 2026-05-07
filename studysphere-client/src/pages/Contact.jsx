import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/InfoPages.css";

function Contact({ theme, setTheme }) {
  return (
    <main className={`info-page ${theme}`}>
      <Navbar theme={theme} />

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

          <form className="contact-form">
            <input type="text" placeholder="Full Name" />
            <input type="email" placeholder="Email Address" />
            <textarea placeholder="Your Message" rows="6"></textarea>

            <button type="submit" className="primary-btn">
              Send Message
            </button>
          </form>
        </section>
      </div>

      <Footer theme={theme} />
    </main>
  );
}

export default Contact;