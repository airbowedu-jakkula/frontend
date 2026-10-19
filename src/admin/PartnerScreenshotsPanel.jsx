import { useEffect, useState } from "react";
import { apiFetch, API_URL, getToken } from "../api";
import { formatDateTime } from "../constants";

const eventShotUrl = (id) =>
  `${API_URL}/api/events/${id}/screenshot?token=${encodeURIComponent(getToken() || "")}`;

function timeAgo(date) {
  if (!date) return "Never";
  const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

export default function PartnerScreenshotsPanel() {
  const [activeTab, setActiveTab] = useState("partner"); // "partner" | "admin"
  const [events, setEvents] = useState([]);
  const [partnerStats, setPartnerStats] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);
  const [busy, setBusy] = useState(null);

  const loadData = async () => {
    setError("");
    try {
      const [evList, stats] = await Promise.all([
        apiFetch(`/api/events?days=30&role=${activeTab}${selectedPartner !== "all" ? `&email=${encodeURIComponent(selectedPartner)}` : ""}`, { auth: true }),
        apiFetch("/api/events/partners-summary", { auth: true }),
      ]);
      setEvents(Array.isArray(evList) ? evList : []);
      setPartnerStats(Array.isArray(stats) ? stats : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData();
    const timer = setInterval(loadData, 60000);
    return () => clearInterval(timer);
  }, [activeTab, selectedPartner]);

  const removeEvent = async (id) => {
    if (!window.confirm("Delete this screenshot record?")) return;
    setBusy(id);
    try {
      await apiFetch(`/api/events/${id}`, { method: "DELETE", auth: true });
      setEvents((list) => list.filter((e) => e._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (selectedCategory !== "all" && e.category !== selectedCategory) return false;
    return true;
  });

  const categories = ["B1/B2", "H1B/H4", "F1/F2", "L1/L2", "J1/J2/O1/O2", "R1/R2"];

  return (
    <div className="partner-screenshots-panel">
      {/* Top Role Selector Tabs */}
      <div className="admin-card" style={{ padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={activeTab === "partner" ? "btn sm" : "btn ghost sm"}
              onClick={() => { setActiveTab("partner"); setSelectedPartner("all"); }}
            >
              👥 Partner Screenshots &amp; Activity
            </button>
            <button
              className={activeTab === "admin" ? "btn sm" : "btn ghost sm"}
              onClick={() => { setActiveTab("admin"); setSelectedPartner("all"); }}
            >
              👑 Admin Screenshots
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className={viewMode === "grid" ? "btn ghost sm active" : "btn ghost sm"}
              onClick={() => setViewMode("grid")}
              title="Grid Gallery View"
            >
              🖼️ Grid
            </button>
            <button
              className={viewMode === "table" ? "btn ghost sm active" : "btn ghost sm"}
              onClick={() => setViewMode("table")}
              title="Table List View"
            >
              📋 Table
            </button>
            <button className="ghost sm" onClick={loadData} disabled={loading}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Partner Live Activity Summary Cards (Shown only when viewing Partner tab) */}
      {activeTab === "partner" && (
        <div className="admin-card" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚡ Live Partner Activity Monitor ({partnerStats.length} Partners)</span>
          </h2>
          {partnerStats.length === 0 ? (
            <p style={{ color: "var(--ink-soft)", margin: 0, fontSize: 13 }}>
              No partner accounts registered yet. Partners can register from the extension, or you can add them in the <strong>Extension Users</strong> tab.
            </p>
          ) : (
            <div className="partner-grid">
              {partnerStats.map((p) => {
                const isSelected = selectedPartner === p.email;
                return (
                  <div
                    key={p._id}
                    className={`partner-card ${isSelected ? "selected" : ""} ${p.status !== "approved" ? "pending-card" : ""}`}
                    onClick={() => setSelectedPartner(isSelected ? "all" : p.email)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <strong style={{ fontSize: 14 }}>{p.name || p.email}</strong>
                      <span className={p.status === "approved" ? "tag ok" : "tag warn"} style={{ fontSize: 10 }}>
                        {p.status === "approved" ? "Verified" : "Pending"}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 8 }}>{p.email}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, background: "rgba(0,0,0,0.03)", padding: "6px 8px", borderRadius: 4 }}>
                      <span>Shots: <strong>{p.totalScreenshots || 0}</strong></span>
                      <span>Today: <strong>{p.todayScreenshots || 0}</strong></span>
                      <span>Active: <strong>{timeAgo(p.lastActiveAt)}</strong></span>
                    </div>
                    {p.latestEvent && (
                      <div style={{ marginTop: 6, fontSize: 11, color: "var(--blue-deep)" }}>
                        Latest: {p.latestEvent.location} ({p.latestEvent.category})
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Filters Bar */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {activeTab === "partner" && (
              <div>
                <label style={{ fontSize: 12, marginRight: 6, color: "var(--ink-soft)" }}>Filter Partner:</label>
                <select
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  style={{ padding: "4px 8px", fontSize: 13 }}
                >
                  <option value="all">All Partners ({partnerStats.length})</option>
                  {partnerStats.map((p) => (
                    <option key={p._id} value={p.email}>
                      {p.name || p.email} ({p.totalScreenshots || 0} shots)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label style={{ fontSize: 12, marginRight: 6, color: "var(--ink-soft)" }}>Visa Class:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ padding: "4px 8px", fontSize: 13 }}
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            Showing <strong>{filteredEvents.length}</strong> {activeTab === "partner" ? "partner" : "admin"} captures
          </div>
        </div>
      </div>

      {/* Content Gallery / Table */}
      {error && <p className="form-msg err">{error}</p>}
      {loading ? (
        <div className="admin-card" style={{ textAlign: "center", padding: 40 }}>Loading captures…</div>
      ) : filteredEvents.length === 0 ? (
        <div className="admin-card" style={{ textAlign: "center", padding: 40, color: "var(--ink-soft)" }}>
          No {activeTab === "partner" ? "partner" : "admin"} screenshots recorded for the selected filter.
        </div>
      ) : viewMode === "grid" ? (
        /* Grid Gallery View */
        <div className="screenshots-gallery-grid">
          {filteredEvents.map((e) => (
            <div key={e._id} className="shot-card">
              <div
                className="shot-preview-wrap"
                onClick={() => setLightbox(e.screenshotUrl || eventShotUrl(e._id))}
              >
                {e.hasScreenshot || e.screenshotUrl ? (
                  <img
                    src={e.screenshotUrl || eventShotUrl(e._id)}
                    alt="capture"
                    loading="lazy"
                    className="shot-img"
                  />
                ) : (
                  <div className="no-shot-placeholder">
                    <span>No screenshot image</span>
                  </div>
                )}
                <div className="shot-hover-overlay">🔍 Click to Enlarge</div>
              </div>

              <div className="shot-info">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span className="tag" style={{ fontWeight: 700 }}>{e.category}</span>
                  <span className={e.available === true ? "tag ok" : "tag"} style={{ fontSize: 11 }}>
                    {e.available === true ? "🟢 Slots Open" : "🔴 No Slots"}
                  </span>
                </div>

                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>
                  📍 {e.location || "OFC Appointment"}
                </div>

                <div style={{ fontSize: 11, color: "var(--ink-soft)", marginBottom: 6 }}>
                  🕒 {formatDateTime(e.detectedAt)}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--blue-deep)", fontWeight: 600 }}>
                    👤 {e.capturedBy || e.capturedByEmail || (e.capturedByRole === "admin" ? "Admin" : "Partner")}
                  </span>
                  <button
                    className="danger sm"
                    style={{ padding: "2px 6px", fontSize: 11 }}
                    disabled={busy === e._id}
                    onClick={() => removeEvent(e._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="admin-card">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Detected (IST)</th>
                  <th>Captured By</th>
                  <th>Visa</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Summary</th>
                  <th>Screenshot</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((e) => (
                  <tr key={e._id}>
                    <td>{formatDateTime(e.detectedAt)}</td>
                    <td>
                      <strong>{e.capturedBy || "Partner"}</strong>
                      {e.capturedByEmail && (
                        <div style={{ fontSize: 11, color: "var(--ink-soft)" }}>{e.capturedByEmail}</div>
                      )}
                    </td>
                    <td><strong>{e.category}</strong></td>
                    <td>{e.location || "OFC Appointment"}</td>
                    <td>
                      <span className={e.available === true ? "tag ok" : "tag"}>
                        {e.available === true ? "Available" : "No slot"}
                      </span>
                    </td>
                    <td style={{ maxWidth: 220, fontSize: 12 }}>{e.currentAvailability || "—"}</td>
                    <td>
                      {e.hasScreenshot || e.screenshotUrl ? (
                        <button
                          className="ghost sm"
                          onClick={() => setLightbox(e.screenshotUrl || eventShotUrl(e._id))}
                        >
                          👁️ View Full
                        </button>
                      ) : (
                        <span style={{ color: "var(--ink-soft)", fontSize: 11 }}>No Image</span>
                      )}
                    </td>
                    <td>
                      <button className="danger sm" disabled={busy === e._id} onClick={() => removeEvent(e._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full-Screen Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-content image-lightbox" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close-btn"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              title="Close (Esc)"
            >
              ✕
            </button>
            <img src={lightbox} alt="full screenshot" />
          </div>
        </div>
      )}
    </div>
  );
}

