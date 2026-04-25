// Resources.jsx - Browse and search study materials uploaded by students
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Resources.css";

function Resources() {
  // Controls dark/light mode
  const [theme, setTheme] = useState("glass");

  // Search input value
  const [searchQuery, setSearchQuery] = useState("");

  // Selected filter values
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");

  // Tracks which resources the user has saved
  const [savedResources, setSavedResources] = useState([]);

  // Mock resource data - will be fetched from backend later
  const [resources] = useState([
    { id: 1, title: "Data Structures Notes", module: "CS201", tag: "Notes", uploadedBy: "John D." },
    { id: 2, title: "Contract Law Summary", module: "LAW101", tag: "Summary", uploadedBy: "Sarah K." },
    { id: 3, title: "Marketing Strategy Slides", module: "BUS301", tag: "Slides", uploadedBy: "Emma R." },
    { id: 4, title: "Algorithms Past Paper 2024", module: "CS201", tag: "Past Paper", uploadedBy: "Liam T." },
    { id: 5, title: "Business Ethics Notes", module: "BUS301", tag: "Notes", uploadedBy: "Aisha M." },
    { id: 6, title: "Criminal Law Case Studies", module: "LAW101", tag: "Case Study", uploadedBy: "Daniel O." },
  ]);

  // Available module filter options
  const modules = ["All", "CS201", "LAW101", "BUS301"];

  // Available tag filter options
  const tags = ["All", "Notes", "Summary", "Slides", "Past Paper", "Case Study"];

  // Toggles save/unsave on a resource
  const handleSave = (id) => {
    setSavedResources((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // Filters resources based on search query, module, and tag
  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = selectedModule === "All" || r.module === selectedModule;
    const matchesTag = selectedTag === "All" || r.tag === selectedTag;
    return matchesSearch && matchesModule && matchesTag;
  });

  return (
    <div className={`resources-page ${theme}`}>
      <Sidebar />

      <main className="resources-main">
        {/* Theme toggle */}
        <div className="resources-topbar">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        {/* Page header */}
        <div className="resources-header">
          <p className="res-tagline">Study Materials</p>
          <h1>Resource Library</h1>
          <p className="res-subtitle">Search and filter study materials shared by your peers.</p>
        </div>

        {/* Search and filter controls */}
        <div className="resources-controls">

          {/* Search bar - filters by title as user types */}
          <input
            type="text"
            placeholder="🔍 Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          {/* Module filter dropdown */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="filter-select"
          >
            {modules.map((mod) => (
              <option key={mod} value={mod}>{mod === "All" ? "All Modules" : mod}</option>
            ))}
          </select>

          {/* Tag filter dropdown */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="filter-select"
          >
            {tags.map((tag) => (
              <option key={tag} value={tag}>{tag === "All" ? "All Tags" : tag}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="results-count">{filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""} found</p>

        {/* Resource list */}
        <div className="resources-list">
          {filteredResources.length === 0 ? (
            // Empty state when no results match
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

                {/* Action buttons */}
                <div className="resource-actions">
                  {/* View button - would open resource in backend */}
                  <button className="res-btn view-btn">👁 View</button>

                  {/* Save button - toggles saved state */}
                  <button
                    className={`res-btn save-btn ${savedResources.includes(resource.id) ? "saved" : ""}`}
                    onClick={() => handleSave(resource.id)}
                  >
                    {savedResources.includes(resource.id) ? "✅ Saved" : "🔖 Save"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Resources;