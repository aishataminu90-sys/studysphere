import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarHalfRoundedIcon from "@mui/icons-material/StarHalfRounded";
import "../styles/Resources.css";

const API = import.meta.env.VITE_API_URL;

// helper — calculate average rating from ratings array
const getAverage = (ratings = []) => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.value, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

// renders 5 stars filled/half/empty based on a numeric value
function StarDisplay({ value }) {
  return (
    <span className="star-display">
      {[1, 2, 3, 4, 5].map((star) => {
        if (value >= star) {
          return <StarRoundedIcon key={star} className="star filled" />;
        } else if (value >= star - 0.5) {
          return <StarHalfRoundedIcon key={star} className="star filled" />;
        } else {
          return <StarBorderRoundedIcon key={star} className="star empty" />;
        }
      })}
      <span className="star-count">
        {value > 0 ? `${value}` : "no ratings yet"}
      </span>
    </span>
  );
}

// interactive 5-star picker
function StarPicker({ resourceId, currentRating, onRate }) {
  const [hovered, setHovered] = useState(0);

  return (
    <span className="star-picker">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="star-pick-btn"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(resourceId, star)}
        >
          {hovered >= star || currentRating >= star ? (
            <StarRoundedIcon className="star filled" />
          ) : (
            <StarBorderRoundedIcon className="star empty" />
          )}
        </span>
      ))}
    </span>
  );
}

function Resources() {
  const [theme, setTheme] = useState("glass");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [resources, setResources] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  // stores user's own rating per resource id
  const [myRatings, setMyRatings] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moduleOptions, setModuleOptions] = useState(["All"]);
  const tags = ["All", "Notes", "Summary", "Slides", "Past Paper", "Case Study"];

  // fetch all resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch(`${API}/resources`, { credentials: "include" });
        if (!res.ok) throw new Error("failed to fetch");
        const data = await res.json();
        setResources(data);
        const uniqueModules = ["All", ...new Set(data.map((r) => r.module).filter(Boolean))];
        setModuleOptions(uniqueModules);
      } catch (err) {
        console.error(err);
        setError("could not load resources. please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // fetch saved resources
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await fetch(`${API}/resources/saved`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setSavedResources(data.map((r) => r._id));
      } catch (err) {
        console.error("failed to fetch saved:", err);
      }
    };
    fetchSaved();
  }, []);

  // save or unsave
  const handleSave = async (id) => {
    try {
      const res = await fetch(`${API}/resources/${id}/save`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("save failed");
      const data = await res.json();
      setSavedResources((prev) =>
        data.saved ? [...prev, id] : prev.filter((r) => r !== id)
      );
    } catch (err) {
      console.error("save error:", err);
    }
  };

  // submit a star rating
  const handleRate = async (id, value) => {
    try {
      const res = await fetch(`${API}/resources/${id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ value }),
      });

      if (!res.ok) throw new Error("rating failed");
      const data = await res.json();

      // save user's rating locally
      setMyRatings((prev) => ({ ...prev, [id]: value }));

      // update the resource's ratings in state so average refreshes instantly
      setResources((prev) =>
        prev.map((r) => {
          if (r._id !== id) return r;
          // rebuild ratings array with updated value for this user
          const existingIndex = r.ratings?.findIndex((rt) => rt.userRated) ?? -1;
          const updatedRatings = r.ratings ? [...r.ratings] : [];
          if (existingIndex !== -1) {
            updatedRatings[existingIndex] = { ...updatedRatings[existingIndex], value };
          } else {
            updatedRatings.push({ value, userRated: true });
          }
          return { ...r, ratings: updatedRatings };
        })
      );
    } catch (err) {
      console.error("rating error:", err);
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === "All" || r.module === selectedModule;
    const resourceTags = Array.isArray(r.tags) ? r.tags : [r.tags];
    const matchesTag = selectedTag === "All" || resourceTags.includes(selectedTag);
    const matchesSaved = !showSavedOnly || savedResources.includes(r._id);
    return matchesSearch && matchesModule && matchesTag && matchesSaved;
  });

  return (
    <div className={`resources-page ${theme}`}>
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="resources-layout">
        <Sidebar />

        <main className="resources-main">
          <div className="resources-header">
            <p className="res-tagline">study materials</p>
            <h1>resource library</h1>
            <p className="res-subtitle">
              search and filter study materials shared by your peers.
            </p>
          </div>

          <div className="resources-controls">
            <div className="search-wrapper">
              <SearchRoundedIcon className="search-icon" />
              <input
                type="text"
                placeholder="search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="filter-select"
            >
              {moduleOptions.map((mod) => (
                <option key={mod} value={mod}>
                  {mod === "All" ? "all modules" : mod}
                </option>
              ))}
            </select>

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="filter-select"
            >
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag === "All" ? "all tags" : tag}
                </option>
              ))}
            </select>

            <button
              className={`saved-toggle-btn ${showSavedOnly ? "active" : ""}`}
              onClick={() => setShowSavedOnly((prev) => !prev)}
            >
              {showSavedOnly ? (
                <BookmarkRoundedIcon className="btn-icon" />
              ) : (
                <BookmarkBorderRoundedIcon className="btn-icon" />
              )}
              {showSavedOnly ? "showing saved" : "show saved"}
            </button>
          </div>

          {loading && <p style={{ opacity: 0.6, padding: "1rem 0" }}>loading resources...</p>}
          {error && <p style={{ color: "red", padding: "1rem 0" }}>{error}</p>}

          {!loading && !error && (
            <>
              <p className="results-count">
                {showSavedOnly
                  ? `${filteredResources.length} saved resource${filteredResources.length !== 1 ? "s" : ""}`
                  : `${filteredResources.length} resource${filteredResources.length !== 1 ? "s" : ""} found`}
              </p>

              <div className="resources-list">
                {filteredResources.length === 0 ? (
                  <div className="no-results">
                    <p>
                      {showSavedOnly
                        ? "you haven't saved any resources yet."
                        : "no resources found. try a different search."}
                    </p>
                  </div>
                ) : (
                  filteredResources.map((resource) => {
                    const avgRating = getAverage(resource.ratings);
                    const myRating = myRatings[resource._id] || 0;

                    return (
                      <div key={resource._id} className="resource-card">
                        <div className="resource-info">
                          <h3 className="resource-title">{resource.title}</h3>

                          <div className="resource-meta">
                            <span className="res-badge">{resource.module}</span>
                            <span className="res-badge tag">
                              {Array.isArray(resource.tags) ? resource.tags[0] : resource.tags}
                            </span>
                            <span className="uploaded-by">
                              uploaded by {resource.uploadedBy?.name ?? "unknown"}
                            </span>
                          </div>

                          {/* average star display */}
                          <div className="rating-row">
                            <StarDisplay value={avgRating} />
                            <span className="rating-count">
                              ({resource.ratings?.length ?? 0} {resource.ratings?.length === 1 ? "rating" : "ratings"})
                            </span>
                          </div>

                          {/* interactive rating picker */}
                          <div className="rate-row">
                            <span className="rate-label">your rating:</span>
                            <StarPicker
                              resourceId={resource._id}
                              currentRating={myRating}
                              onRate={handleRate}
                            />
                            {myRating > 0 && (
                              <span className="your-rating-badge">{myRating}/5</span>
                            )}
                          </div>
                        </div>

                        <div className="resource-actions">
                          <a
                            href={resource.link || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="res-btn view-btn"
                            style={{ textDecoration: "none" }}
                          >
                            <VisibilityRoundedIcon className="btn-icon" />
                            view
                          </a>

                          <button
                            className={`res-btn save-btn ${savedResources.includes(resource._id) ? "saved" : ""}`}
                            onClick={() => handleSave(resource._id)}
                          >
                            {savedResources.includes(resource._id) ? (
                              <><BookmarkRoundedIcon className="btn-icon" /> saved</>
                            ) : (
                              <><BookmarkBorderRoundedIcon className="btn-icon" /> save</>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Resources;