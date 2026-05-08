// FAQ.jsx - Frequently Asked Questions page with accordion functionality


import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import "../styles/InfoPages.css";

const faqs = [
  {
    question: "How do I upload study resources?",
    answer:
      "Go to the Upload Resource page from the sidebar, fill in the resource details, and upload your file or link.",
  },
  {
    question: "Can I join multiple study groups?",
    answer:
      "Yes. You can join as many study groups as you like depending on your modules and interests.",
  },
  {
    question: "Can I delete my uploaded resources?",
    answer:
      "Yes. Uploaded resources can be managed and removed from your dashboard.",
  },
  {
    question: "Does StudySphere support reminders?",
    answer:
      "Yes. You can create reminders for assignments, exams, and study sessions from the Reminders page.",
  },
  {
    question: "Is StudySphere free to use?",
    answer:
      "Yes. StudySphere is currently completely free for students.",
  },
  {
    question: "Can I save resources uploaded by other students?",
    answer:
      "Yes. On the Resources page you can save any resource to your saved list so you can find it easily later.",
  },
  {
    question: "How do I create a study group?",
    answer:
      "Go to the Study Groups page and click Create Group. Fill in the group name, module, and next session time and your group will be created instantly.",
  },
  {
    question: "What happens when I complete a reminder?",
    answer:
      "When you mark a reminder as complete it moves to the Completed section with a strikethrough, and a motivational message appears to keep you going!",
  },
];

function FAQ({ theme, setTheme }) {
  // Tracks which accordion item is currently open
  // null means all are closed, a number means that index is open
  const [openIndex, setOpenIndex] = useState(null);

  // Toggles an accordion open or closed
  // If the clicked item is already open, close it (set to null)
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className={`info-page ${theme}`}>
      <Navbar theme={theme} />
      <ThemeToggle theme={theme} setTheme={setTheme} />


      <div className="info-wrapper">
        <section className="info-hero">
          <p className="info-tagline">SUPPORT</p>
          <h1>Frequently Asked Questions</h1>
          <p className="info-subtitle">
            Everything you need to know about using StudySphere.
          </p>
        </section>

        {/* Accordion list - replaces the old faq-grid */}
        <section className="faq-accordion">
          {faqs.map((faq, index) => {
            // Check if this specific item is the one currently open
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
              >
                {/* Clickable question row */}
                <button
                  className="faq-question"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>

                  {/* Arrow icon rotates 180deg when open */}
                  <ExpandMoreRoundedIcon
                    className={`faq-arrow ${isOpen ? "faq-arrow--open" : ""}`}
                  />
                </button>

                {/* Answer panel - only rendered when open */}
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>

      <Footer theme={theme} />
    </main>
  );
}

export default FAQ;