import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import "../styles/UploadResource.css";

const API = import.meta.env.VITE_API_URL;

const PRESET_MODULES = ["CS201", "LAW101", "BUS301"];
const TAGS = ["Notes", "Summary", "Slides", "Past Paper", "Case Study"];

function UploadResource() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("glass");

  const [form, setForm] = useState({
    title: "",
    module: "",
    customModule: "",
    tag: "",
    description: "",
    link: "",
  });

  const [isCustomModule, setIsCustomModule] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleModuleChange = (e) => {
    const val = e.target.value;

    if (val === "__other__") {
      setIsCustomModule(true);
      setForm({ ...form, module: "", customModule: "" });
    } else {
      setIsCustomModule(false);
      setForm({ ...form, module: val, customModule: "" });
    }

    setErrors({ ...errors, module: "" });
  };

  const containsUnsafeContent = (text) => {
    const unsafePatterns = [
     /<script.*?>.*?<\/script>/gi,
     /<[^>]+>/g,
     /javascript:/gi,
     /onerror=/gi,
     /onload=/gi
   ];

   return unsafePatterns.some((pattern) => pattern.test(text));
 };

  const validate = () => {
    const newErrors = {};
    const finalModule = isCustomModule ? form.customModule.trim() : form.module;

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
      } else if (containsUnsafeContent(form.title)) {
    newErrors.title = "Invalid characters detected";
  }

    

    if (!finalModule) {
      newErrors.module = isCustomModule
        ? "Please enter your module name"
        : "Please select a module";
    } else if (containsUnsafeContent(finalModule)) {
    newErrors.module = "Invalid characters detected";
  }

    if (!form.tag) {
      newErrors.tag = "Please select a resource type";
    } 

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (containsUnsafeContent(form.description)) {
    newErrors.description = "Invalid characters detected";
  }

    if (!form.link.trim()) {
      newErrors.link = "Please add a file link";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    setServerError("");

    const finalModule = isCustomModule ? form.customModule.trim() : form.module;

    try {
      const res = await fetch(`${API}/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: form.title,
          module: finalModule,
          tags: form.tag,
          description: form.description,
          link: form.link,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Upload failed. Please try again.");
        return;
      }

      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        navigate("/resources");
      }, 3000);
    } catch (err) {
      setServerError("Could not connect to server. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`upload-page ${theme}`}>
      <DashboardNavbar theme={theme} setTheme={setTheme} />

      <div className="upload-layout">
        <Sidebar />

        <div className="upload-wrapper">
          <header className="upload-topbar">
            <div className="upload-topbar-left">
              <UploadFileRoundedIcon className="topbar-icon" />
              <h2>Upload Resource</h2>
            </div>
          </header>

          <main className="upload-main">
            <div className="upload-header">
              <p className="upload-tagline">SHARE YOUR KNOWLEDGE</p>
              <h1>Upload a Study Resource</h1>
              <p className="upload-subtitle">
                Share notes, past papers, slides and more with your peers.
              </p>
            </div>

            {submitted && (
              <div className="success-banner">
                <CheckCircleRoundedIcon className="success-icon" />
                Resource uploaded successfully! Redirecting to resources...
              </div>
            )}

            {serverError && (
              <div className="server-error-banner">
                {serverError}
              </div>
            )}

            <div className="upload-form-layout">
              <form className="upload-form" onSubmit={handleSubmit} noValidate>

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

                <div className="form-group">
                  <label htmlFor="module">Module *</label>
                  <select
                    id="module"
                    name="module"
                    value={isCustomModule ? "__other__" : form.module}
                    onChange={handleModuleChange}
                    className={`upload-select ${errors.module ? "input-error" : ""}`}
                  >
                    <option value="">Select a module</option>
                    {PRESET_MODULES.map((mod) => (
                      <option key={mod} value={mod}>
                        {mod}
                      </option>
                    ))}
                    <option value="__other__">+ Add my own module</option>
                  </select>

                  {isCustomModule && (
                    <input
                      type="text"
                      name="customModule"
                      placeholder="e.g. MATH301 or Introduction to Psychology"
                      value={form.customModule}
                      onChange={handleChange}
                      className={`custom-module-input ${errors.module ? "input-error" : ""}`}
                      style={{ marginTop: "0.5rem" }}
                    />
                  )}

                  {errors.module && <p className="error-msg">{errors.module}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="tag">Resource Type *</label>
                  <select
                    id="tag"
                    name="tag"
                    value={form.tag}
                    onChange={handleChange}
                    className={`upload-select ${errors.tag ? "input-error" : ""}`}
                  >
                    <option value="">Select a type</option>
                    {TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>

                  {errors.tag && <p className="error-msg">{errors.tag}</p>}
                </div>

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
                  {errors.description && (
                    <p className="error-msg">{errors.description}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="link">Resource Link *</label>
                  <input
                    type="url"
                    id="link"
                    name="link"
                    placeholder="e.g. https://drive.google.com/your-file"
                    value={form.link}
                    onChange={handleChange}
                    className={errors.link ? "input-error" : ""}
                  />

                  {errors.link && <p className="error-msg">{errors.link}</p>}

                  <p className="field-hint">
                    Paste a Google Drive, Dropbox or any public link to your file
                  </p>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting}
                  >
                    <UploadFileRoundedIcon className="btn-icon" />
                    {submitting ? "Uploading..." : "Upload Resource"}
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

              <aside className="upload-tips">
                <div className="tips-header">
                  <TipsAndUpdatesRoundedIcon className="tips-icon" />
                  <h3>Upload Tips</h3>
                </div>

                <ul>
                  <li>Make sure your title clearly describes the content</li>
                  <li>Select the correct module so others can find it easily</li>
                  <li>Can't find your module? Use "Add my own module"</li>
                  <li>Add a helpful description so peers know what's inside</li>
                  <li>Only upload files you have the right to share</li>
                  <li>Use Google Drive or Dropbox to host your file and paste the link</li>
                </ul>

                <div className="tips-note">
                  <strong>Accepted formats:</strong>
                  <br />
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