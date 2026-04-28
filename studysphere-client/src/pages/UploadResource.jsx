import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import "../styles/UploadResource.css";

// Upload Resource page - lets students share their study materials
function UploadResource() {
  const navigate = useNavigate();

  // Theme state
  const [theme, setTheme] = useState("glass");

  // All form field values stored together
  const [form, setForm] = useState({
    title: "",
    module: "",
    tag: "",
    description: "",
    file: null,
  });

  // Validation error messages shown under each field
  const [errors, setErrors] = useState({});

  // Shows the success banner when form is submitted correctly
  const [submitted, setSubmitted] = useState(false);

  // Module and tag options for the dropdowns
  const modules = ["CS201", "LAW101", "BUS301"];
  const tags = ["Notes", "Summary", "Slides", "Past Paper", "Case Study"];

  // Updates form state when user types or selects an option
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear the error for the field being edited
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Handles the file input separately since it uses e.target.files
  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] });
    setErrors({ ...errors, file: "" });
  };

  // Checks all fields are valid before submitting
  const validate = () => {
    const newErrors = {};

    if (!form.title.trim())
      newErrors.title = "Title is required";

    if (!form.module)
      newErrors.module = "Please select a module";

    if (!form.tag)
      newErrors.tag = "Please select a resource type";

    if (!form.description.trim())
      newErrors.description = "Description is required";
    else if (form.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";

    if (!form.file)
      newErrors.file = "Please select a file to upload";

    return newErrors;
  };

  // Runs when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    // Only proceed if there are no validation errors
    if (Object.keys(newErrors).length === 0) {
      console.log("Resource uploaded:", form);
      setSubmitted(true);

      // After 3 seconds redirect to the resources page
      setTimeout(() => {
        setSubmitted(false);
        navigate("/resources");
      }, 3000);
    }
  };

  return (
    <div className={`upload-page ${theme}`}>

      {/* Top navbar - logo, theme toggle, home, logout */}
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="upload-layout">
        <Sidebar />

        <div className="upload-wrapper">

          {/* Page title bar */}
          <header className="upload-topbar">
            <div className="upload-topbar-left">
              <UploadFileRoundedIcon className="topbar-icon" />
              <h2>Upload Resource</h2>
            </div>
          </header>

          <main className="upload-main">

            {/* Page heading */}
            <div className="upload-header">
              <p className="upload-tagline">SHARE YOUR KNOWLEDGE</p>
              <h1>Upload a Study Resource</h1>
              <p className="upload-subtitle">
                Share notes, past papers, slides and more with your peers.
              </p>
            </div>

            {/* Success message shown after a valid submission */}
            {submitted && (
              <div className="success-banner">
                <CheckCircleRoundedIcon className="success-icon" />
                Resource uploaded successfully! Redirecting to resources...
              </div>
            )}

            {/* Two column layout - form on left, tips on right */}
            <div className="upload-form-layout">

              {/* Main upload form */}
              <form className="upload-form" onSubmit={handleSubmit} noValidate>

                {/* Title */}
                <div className="form-group">
                  <label htmlFor="title">Resource Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g. Data Structures Lecture Notes"
                    value={form.title}
                    onChange={handleChange}
                    className={errors.title ? "input-error" : ""}
                  />
                  {errors.title && <p className="error-msg">{errors.title}</p>}
                </div>

                {/* Module dropdown */}
                <div className="form-group">
                  <label htmlFor="module">Module *</label>
                  <select
                    id="module"
                    name="module"
                    value={form.module}
                    onChange={handleChange}
                    className={errors.module ? "input-error" : ""}
                  >
                    <option value="">Select a module</option>
                    {modules.map((mod) => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                  </select>
                  {errors.module && <p className="error-msg">{errors.module}</p>}
                </div>

                {/* Resource type dropdown */}
                <div className="form-group">
                  <label htmlFor="tag">Resource Type *</label>
                  <select
                    id="tag"
                    name="tag"
                    value={form.tag}
                    onChange={handleChange}
                    className={errors.tag ? "input-error" : ""}
                  >
                    <option value="">Select a type</option>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  {errors.tag && <p className="error-msg">{errors.tag}</p>}
                </div>

                {/* Description textarea */}
                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Briefly describe what this resource covers (min. 10 characters)"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className={errors.description ? "input-error" : ""}
                  />
                  {errors.description && <p className="error-msg">{errors.description}</p>}
                </div>

                {/* File upload area */}
                <div className="form-group">
                  <label htmlFor="file">Upload File *</label>
                  <div className={`file-drop-zone ${errors.file ? "input-error" : ""}`}>
                    {/* Hidden file input sits over the visible area */}
                    <input
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4"
                    />
                    <UploadFileRoundedIcon className="file-upload-icon" />
                    <p className="file-hint">
                      {form.file
                        ? `${form.file.name}`
                        : "Click to browse or drag and drop your file here"}
                    </p>
                    <p className="file-types">PDF, DOC, DOCX, PPT, PPTX, MP4</p>
                  </div>
                  {errors.file && <p className="error-msg">{errors.file}</p>}
                </div>

                {/* Submit and cancel buttons */}
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    <UploadFileRoundedIcon className="btn-icon" />
                    Upload Resource
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => navigate("/resources")}
                  >
                    Cancel
                  </button>
                </div>

              </form>

              {/* Tips card on the right */}
              <aside className="upload-tips">
                <div className="tips-header">
                  <TipsAndUpdatesRoundedIcon className="tips-icon" />
                  <h3>Upload Tips</h3>
                </div>
                <ul>
                  <li>Make sure your title clearly describes the content</li>
                  <li>Select the correct module so others can find it easily</li>
                  <li>Add a helpful description so peers know what's inside</li>
                  <li>Only upload files you have the right to share</li>
                  <li>Max file size: 50MB</li>
                </ul>
                <div className="tips-note">
                  <strong>Accepted formats:</strong><br />
                  PDF, Word, PowerPoint, MP4
                </div>
              </aside>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default UploadResource;