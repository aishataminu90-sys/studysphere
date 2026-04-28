import { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import "../styles/Resources.css";

// Resources page - students can browse, search and filter study materials
function Resources() {
  // Theme state - glass is dark, campus is light
  const [theme, setTheme] = useState("glass");

  // What the user has typed in the search box
  const [searchQuery, setSearchQuery] = useState("");

  // Currently selected dropdown filters
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  // Tracks which resource IDs the user has saved
  const [savedResources, setSavedResources] = useState([]);

  // Mock resource data - will be fetched from the backend later
  const [resources] = useState([
    { id: 1, title: "Data Structures Notes", module: "CS201", tag: "Notes", uploadedBy: "John D." },
    { id: 2, title: "Contract Law Summary", module: "LAW101", tag: "Summary", uploadedBy: "Sarah K." },
    { id: 3, title: "Marketing Strategy Slides", module: "BUS301", tag: "Slides", uploadedBy: "Emma R." },
    { id: 4, title: "Algorithms Past Paper 2024", module: "CS201", tag: "Past Paper", uploadedBy: "Liam T." },
    { id: 5, title: "Business Ethics Notes", module: "BUS301", tag: "Notes", uploadedBy: "Aisha M." },
    { id: 6, title: "Criminal Law Case Studies", module: "LAW101", tag: "Case Study", uploadedBy: "Daniel O." },
  ]);

  // Dropdown filter options
  const modules = ["All", "CS201", "LAW101", "BUS301"];
  const tags = ["All", "Notes", "Summary", "Slides", "Past Paper", "Case Study"];

  // Toggle save/unsave - adds or removes the resource id from the saved list
  const handleSave = (id) => {
    setSavedResources((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // Filter the resource list based on search text, module and tag
  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === "All" || r.module === selectedModule;
    const matchesTag = selectedTag === "All" || r.tag === selectedTag;
    return matchesSearch && matchesModule && matchesTag;
  });

  return (
    <div className={`resources-page ${theme}`}>

      {/* Top navbar - logo, theme toggle, home, logout */}
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="resources-layout">
        <Sidebar />

        <main className="resources-main">

          {/* Page heading */}
          <div className="resources-header">
            <p className="res-tagline">STUDY MATERIALS</p>
            <h1>Resource Library</h1>
            <p className="res-subtitle">
              Search and filter study materials shared by your peers.
            </p>
          </div>

          {/* Search bar and filter dropdowns */}
          <div className="resources-controls">

            {/* Search icon + input together */}
            <div className="search-wrapper">
              <SearchRoundedIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Filter by module */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="filter-select"
            >
              {modules.map((mod) => (
                <option key={mod} value={mod}>
                  {mod === "All" ? "All Modules" : mod}
                </option>
              ))}
            </select>

            {/* Filter by tag/type */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="filter-select"
            >
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag === "All" ? "All Tags" : tag}
                </option>
              ))}
            </select>
          </div>

          {/* Show how many results match the current filters */}
          <p className="results-count">
            {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""} found
          </p>

          {/* Resource list */}
          <div className="resources-list">
            {filteredResources.length === 0 ? (
              // Show this when no resources match the search/filter
              <div className="no-results">
                <p>No resources found. Try a different search or filter.</p>
              </div>
            ) : (
              filteredResources.map((resource) => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-info">
                    <h3 className="resource-title">{resource.title}</h3>
                    <div className="resource-meta">
                      <span className="res-badge">{resource.module}</span>
                      <span className="res-badge tag">{resource.tag}</span>
                      <span className="uploaded-by">Uploaded by {resource.uploadedBy}</span>
                    </div>
                  </div>

                  {/* View and Save action buttons */}
                  <div className="resource-actions">
                    <button className="res-btn view-btn">
                      <VisibilityRoundedIcon className="btn-icon" />
                      View
                    </button>

                    {/* Save button changes appearance when saved */}
                    <button
                      className={`res-btn save-btn ${savedResources.includes(resource.id) ? "saved" : ""}`}
                      onClick={() => handleSave(resource.id)}
                    >
                      {savedResources.includes(resource.id)
                        ? <><BookmarkRoundedIcon className="btn-icon" /> Saved</>
                        : <><BookmarkBorderRoundedIcon className="btn-icon" /> Save</>
                      }
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Resources;