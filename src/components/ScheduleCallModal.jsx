import { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function ScheduleCallModal({ isOpen, onClose, initialCategory = "B1/B2" }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    category: initialCategory,
    preferredTime: "Morning (9 AM - 12 PM)",
    targetCity: "Any Location",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  // Sync initialCategory when modal opens
  useEffect(() => {
    if (isOpen && initialCategory) {
      setForm((prev) => ({
        ...prev,
        category:
          initialCategory === "ALL" || initialCategory === "Not Sure / Other" || initialCategory === "Other"
            ? "Not Sure / Other"
            : initialCategory,
      }));
    }
    if (isOpen) {
      setStatus("idle");
      setErrorMessage("");
      setRedirectUrl("");
    }
  }, [isOpen, initialCategory]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) {
      setErrorMessage("Please enter both your name and phone number.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    // Prepare WhatsApp message text
    const textLines = [
      "Hi, I would like to schedule a Visa Slot Booking Assistance Call.",
      "",
      "*Applicant Details:*",
      `• Name: ${form.name.trim()}`,
      `• Phone: ${form.mobile.trim()}`,
      `• Visa Category: ${form.category}`,
      `• Preferred Time to Call: ${form.preferredTime}`,
      `• Target Location: ${form.targetCity}`,
    ];

    if (form.message.trim()) {
      textLines.push(`• Comments: ${form.message.trim()}`);
    }

    textLines.push("", "_Sent from usvisaslotsupdate.com_");
    const waUrl = `https://wa.me/918143852523?text=${encodeURIComponent(textLines.join("\n"))}`;
    setRedirectUrl(waUrl);

    try {
      // 1. Notify admin via backend (email + DB record + queue alert)
      await apiFetch("/api/contacts/schedule-call", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: form.mobile.trim(),
          category: form.category,
          preferredTime: form.preferredTime,
          targetCity: form.targetCity,
          message: form.message.trim(),
        }),
      });

      setStatus("success");

      // 2. Automatically redirect user to WhatsApp with pre-filled details
      setTimeout(() => {
        window.open(waUrl, "_blank") || (window.location.href = waUrl);
      }, 300);
    } catch (err) {
      // Even if backend had a network hitch, allow WhatsApp redirect to succeed!
      setStatus("success");
      setTimeout(() => {
        window.open(waUrl, "_blank") || (window.location.href = waUrl);
      }, 300);
    }
  };

  return (
    <div className="schedule-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="schedule-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="schedule-modal-close"
          onClick={onClose}
          aria-label="Close Schedule Call Dialog"
        >
          ✕
        </button>

        {status === "success" ? (
          <div className="schedule-modal-success">
            <div className="success-icon-badge">✓</div>
            <h3>Details Sent to Admin!</h3>
            <p className="success-desc">
              Thank you, <strong>{form.name}</strong>. Your callback request has been logged and sent to our admin team. Opening WhatsApp directly to start your booking consultation...
            </p>
            <div className="success-meta-box">
              <div><strong>Category:</strong> {form.category}</div>
              <div><strong>Preferred Time:</strong> {form.preferredTime}</div>
              <div><strong>Location:</strong> {form.targetCity}</div>
            </div>
            {redirectUrl && (
              <a
                href={redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-open-wa"
              >
                💬 Open WhatsApp Chat Directly
              </a>
            )}
            <button type="button" className="btn-modal-done" onClick={onClose} style={{ marginTop: 12 }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="schedule-modal-header">
              <div className="schedule-modal-tag">
                <span className="live-dot"></span> Priority Booking Assistance
              </div>
              <h2 className="schedule-modal-title">Schedule Call Directly</h2>
              <p className="schedule-modal-subtitle">
                Enter your details below. Your request will be sent to the admin and you will be connected directly on WhatsApp for immediate slot booking assistance.
              </p>
            </div>

            {errorMessage && <div className="schedule-modal-error">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="schedule-modal-form">
              <div className="form-row-two">
                <div className="form-group">
                  <label htmlFor="client-name">
                    Name <span className="req">*</span>
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange("name")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="client-mobile">
                    Phone Number <span className="req">*</span>
                  </label>
                  <input
                    id="client-mobile"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.mobile}
                    onChange={handleChange("mobile")}
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label htmlFor="client-category">
                    Visa Category <span className="req">*</span>
                  </label>
                  <select
                    id="client-category"
                    value={form.category}
                    onChange={handleChange("category")}
                  >
                    <option value="B1/B2">B1 / B2 (Tourist &amp; Business)</option>
                    <option value="F1/F2">F1 / F2 (Student Visa)</option>
                    <option value="H1B/H4">H1B / H4 (Specialty Work)</option>
                    <option value="Not Sure / Other">Not Sure / Directly Contact Us</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="client-time">Preferred Time to Call</label>
                  <select
                    id="client-time"
                    value={form.preferredTime}
                    onChange={handleChange("preferredTime")}
                  >
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                    <option value="Urgent / Call ASAP">⚡ Urgent — Call as soon as possible</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="client-city">Target Location</label>
                <select
                  id="client-city"
                  value={form.targetCity}
                  onChange={handleChange("targetCity")}
                >
                  <option value="Any Location">Any Location</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Kolkata">Kolkata</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="client-message">Comments / Requirements</label>
                <textarea
                  id="client-message"
                  rows="2"
                  placeholder="e.g. Need appointment before December for urgent travel or intake..."
                  value={form.message}
                  onChange={handleChange("message")}
                />
              </div>

              <div className="schedule-modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={onClose}
                  disabled={status === "sending"}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-submit"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Connecting to WhatsApp…" : "💬 Send & Connect on WhatsApp"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
