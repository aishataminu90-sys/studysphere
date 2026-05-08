import { Link } from "react-router-dom";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import "../styles/Footer.css";

function Footer({ theme }) {
  return (
    <footer className={`footer ${theme}`}>
      <div className="footer-inner">

        {/* Left side - brand name and tagline */}
        <div className="footer-brand">
          <div className="footer-logo">
            <MenuBookRoundedIcon className="footer-logo-icon" />
            <span>StudySphere</span>
          </div>
          <p className="footer-tagline">
            Your academic life, organised.
          </p>
        </div>

        {/* Middle - navigation links */}
        <div className="footer-links">
          <h4>Platform</h4>
          <Link to="/FAQ">FAQ</Link>
          <Link to="/Contact">Contact</Link>
          {/* <Link to="/resources">Resources</Link> */}
        </div>

        {/* Right side - company links */}
        <div className="footer-links">
          <h4>Company</h4>
          <Link to="/#about">About Us</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>

      </div>

      {/* Bottom bar with copyright */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} StudySphere. Built by Aishat, Aisha &amp; Michelle · Griffith College Dublin
        </p>
      </div>
    </footer>
  );
}

export default Footer;