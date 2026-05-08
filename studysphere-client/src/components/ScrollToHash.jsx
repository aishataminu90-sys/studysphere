import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 *  Automatically scrolls to a section on the page
 * based on the URL hash ( /#about will scroll to id="about")
 *  this rendered component once in app.js 
 */
function ScrollToHash() {
  // useLocation gives  access to the current URL info,
  // including the hash ( "#about")
  const location = useLocation();

  useEffect(() => {
    // Only runs if the URL contains a hash ( /#about)
    if (location.hash) {
      // Find the DOM element whose id matches the hash
      const element = document.querySelector(location.hash);

      if (element) {
        // Small delay of 100ms to ensure the page has fully rendered
        // from another route
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" }); // smooth scroll to the element
        }, 100);
      }
    }
  }, [location]); // re-runs every time the URL  changes

  return null; 
}

export default ScrollToHash;