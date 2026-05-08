import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import "../styles/Resources.css";

const API = import.meta.env.VITE_API_URL;

function Resources() {
  const [theme, setTheme] = useState("glass");

  // search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // data states
  const [resources, setResources] = useState([]);
  const [savedResources, setSavedResources] = useState([]);

  // loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // dropdown options
  const [moduleOptions, setModuleOptions] = useState(["All"]);
  const tags = ["All", "Notes", "Summary", "Slides", "Past Paper", "Case Study"];

  // fetch all resources on page load
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch(`${API}/resources`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("failed to fetch resources");

        const data = await res.json();
        setResources(data);

        // extract unique modules for filter dropdown
        const uniqueModules = [
          "All",
          ...new Set(data.map((r) => r.module).filter(Boolean)),
        ];
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

  // fetch saved resources for user
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await fetch(`${API}/resources/saved`, {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        // store only saved resource ids
        const savedIds = data.map((r) => r._id || r.id);
        setSavedResources(savedIds);
      } catch (err) {
        console.error("failed to fetch saved resources:", err);
      }
    };

    fetchSaved();
  }, []);

  // save or unsave a resource
  const handleSave = async (id) => {
    try {
      const res = await fetch(`${API}/resources/${id}/save`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("save failed");

      const data = await res.json();

      // update saved list based on response
      setSavedResources((prev) =>
        data.saved
          ? [...prev, id]
          : prev.filter((r) => r !== id)
      );
    } catch (err) {
      console.error("save error:", err);
    }
  };

  // filter resources based on search and filters
  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesModule =
      selectedModule === "All" || r.module === selectedModule;

    const resourceTags = Array.isArray(r.tags) ? r.tags : [r.tags];

    const matchesTag =
      selectedTag === "All" || resourceTags.includes(selectedTag);

    const matchesSaved =
      !showSavedOnly || savedResources.includes(r._id);

    return matchesSearch && matchesModule && matchesTag && matchesSaved;
  });

  return (
    <div className={`resources-page ${theme}`}>
      {/* top navbar */}
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="resources-layout">
        {/* sidebar navigation */}
        <Sidebar />

        <main className="resources-main">

          {/* page header */}
          <div className="resources-header">
            <p className="res-tagline">study materials</p>
            <h1>resource library</h1>
            <p className="res-subtitle">
              search and filter study materials shared by your peers.
            </p>
          </div>

          {/* search and filter controls */}
          <div className="resources-controls">

            {/* search input */}
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

            {/* module filter */}
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

            {/* tag filter */}
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

            {/* toggle saved only view */}
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

          {/* loading state */}
          {loading && (
            <p style={{ opacity: 0.6, padding: "1rem 0" }}>
              loading resources...
            </p>
          )}

          {/* error state */}
          {error && (
            <p style={{ color: "red", padding: "1rem 0" }}>{error}</p>
          )}

          {/* resource list */}
          {!loading && !error && (
            <>
              <p className="results-count">
                {showSavedOnly
                  ? `${filteredResources.length} saved resource${filteredResources.length !== 1 ? "s" : ""}`
                  : `${filteredResources.length} resource${filteredResources.length !== 1 ? "s" : ""} found`}
              </p>

              <div className="resources-list">

                {/* empty state */}
                {filteredResources.length === 0 ? (
                  <div className="no-results">
                    <p>
                      {showSavedOnly
                        ? "you haven't saved any resources yet."
                        : "no resources found. try a different search."}
                    </p>
                  </div>
                ) : (

                  // render each resource card
                  filteredResources.map((resource) => (
                    <div key={resource._id} className="resource-card">

                      <div className="resource-info">
                        <h3 className="resource-title">{resource.title}</h3>

                        <div className="resource-meta">
                          <span className="res-badge">{resource.module}</span>

                          <span className="res-badge tag">
                            {Array.isArray(resource.tags)
                              ? resource.tags[0]
                              : resource.tags}
                          </span>

                          <span className="uploaded-by">
                            uploaded by {resource.uploadedBy?.name ?? "unknown"}
                          </span>
                        </div>
                      </div>

                      <div className="resource-actions">

                        {/* view resource link */}
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

                        {/* save button */}
                        <button
                          className={`res-btn save-btn ${
                            savedResources.includes(resource._id) ? "saved" : ""
                          }`}
                          onClick={() => handleSave(resource._id)}
                        >
                          {savedResources.includes(resource._id) ? (
                            <>
                              <BookmarkRoundedIcon className="btn-icon" />
                              saved
                            </>
                          ) : (
                            <>
                              <BookmarkBorderRoundedIcon className="btn-icon" />
                              save
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  ))
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