// UploadResource.jsx - Form for students to upload study materials
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/UploadResource.css";

function UploadResource() {
  const navigate = useNavigate();

  // Controls dark/light mode
  const [theme, setTheme] = useState("glass");

  // Stores form field values
  const [form, setForm] = useState({
    title: "",
    module: "",
    tag: "",
    description: "",
    file: null,
  });

  // Stores validation error messages
  const [errors, setErrors] = useState({});

  // Shows success message after valid submission
  const [submitted, setSubmitted] = useState(false);

  // Available module options
  const modules = ["CS201", "LAW101", "BUS301"];

  // Available tag options
  const tags = ["Notes", "Summary", "Slides", "Past Paper", "Case Study"];

  // Updates form state when user types or selects
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Handles file input separately
  const handleFileChange = (e) => {
    setForm({ ...form, file: e.target.files[0] });
    setErrors({ ...errors, file: "" });
  };

  // Validates all fields before submission
  const validate = () => {
    const newErrors = {};

    if (!form.title.trim())
      newErrors.title = "Title is required";

    if (!form.module)
      newErrors.module = "Please select a module";

    if (!form.tag)
      newErrors.tag = "Please select a tag";

    if (!form.description.trim())
      newErrors.description = "Description is required";
    else if (form.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";

    if (!form.file)
      newErrors.file = "Please select a file to upload";

    return newErrors;
  };

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    // If no errors, show success message
    if (Object.keys(newErrors).length === 0) {
      console.log("Resource uploaded:", form);
      setSubmitted(true);

      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        setSubmitted(false);
        navigate("/resources");
      }, 3000);
    }
  };

  return (
    <div className={`upload-page ${theme}`}>
      <Sidebar />

      <div className="upload-wrapper">

        {/* Top bar */}
        <header className="upload-topbar">
          <div className="upload-topbar-left">
            <h2>⬆️ Upload Resource</h2>
          </div>
          <div className="upload-topbar-right">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>

        <main className="upload-main">

          {/* Page header */}
          <div className="upload-header">
            <p className="upload-tagline">SHARE YOUR KNOWLEDGE</p>
            <h1>Upload a Study Resource</h1>
            <p className="upload-subtitle">
              Share notes, past papers, slides and more with your peers.
            </p>
          </div>

          {/* Success message shown after valid submission */}
          {submitted && (
            <div className="success-banner">
              ✅ Resource uploaded successfully! Redirecting to resources...
            </div>
          )}

          {/* Upload form */}
          <div className="upload-layout">

            {/* Main form card */}
            <form className="upload-form" onSubmit={handleSubmit} noValidate>

              {/* Title field */}
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

              {/* Tag dropdown */}
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

              {/* File upload */}
              <div className="form-group">
                <label htmlFor="file">Upload File *</label>
                <div className={`file-drop-zone ${errors.file ? "input-error" : ""}`}>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4"
                  />
                  <p className="file-hint">
                    {form.file ? `📄 ${form.file.name}` : "Click to browse or drag and drop your file here"}
                  </p>
                  <p className="file-types">PDF, DOC, DOCX, PPT, PPTX, MP4</p>
                </div>
                {errors.file && <p className="error-msg">{errors.file}</p>}
              </div>

              {/* Submit buttons */}
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  ⬆️ Upload Resource
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

            {/* Tips sidebar */}
            <aside className="upload-tips">
              <h3>💡 Upload Tips</h3>
              <ul>
                <li>Make sure your title clearly describes the content</li>
                <li>Select the correct module so others can find it easily</li>
                <li>Add a helpful description so peers know what's inside</li>
                <li>Only upload files you have the right to share</li>
                <li>Max file size: 50MB</li>
              </ul>

              <div className="tips-note">
                <strong>Accepted formats:</strong>
                <br />PDF, Word, PowerPoint, MP4
              </div>
            </aside>

          </div>
        </main>
      </div>
    </div>
  );
}

export default UploadResource;