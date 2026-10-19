import { useEffect, useState, useMemo } from "react";
import { apiFetch, API_URL, getToken } from "../api";

const eventShotUrl = (id) =>
  `${API_URL}/api/events/${id}/screenshot?token=${encodeURIComponent(getToken() || "")}`;

function timeAgo(date) {
  if (!date) return "—";
  const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (sec < 0) return "Just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

function formatExactIST(date) {
  if (!date) return "—";
  const d = new Date(date);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
}

const CATEGORY_DEFINITIONS = [
  { id: "all", label: "🌐 All Visa Classes", subtitle: "All captured classes" },
  { id: "B1/B2", label: "🇺🇸 B1/B2 Visa", subtitle: "Business & Tourism" },
  { id: "H1B/H4", label: "💼 H1B / H4 Visa", subtitle: "Specialty Occupation & Dependent" },
  { id: "F1/F2", label: "🎓 F1 / F2 Visa", subtitle: "Academic Students & Dependent" },
  { id: "L1/L2", label: "🏢 L1 / L2 Visa", subtitle: "Intra-Company Transferees" },
  { id: "J1/J2/O1/O2", label: "🔬 J1/J2 / O1/O2 Visa", subtitle: "Exchange Visitors & Extraordinary" },
  { id: "R1/R2", label: "⛪ R1 / R2 Visa", subtitle: "Religious Workers" },
];

const CATEGORY_COLORS = {
  "B1/B2": { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  "H1B/H4": { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
  "F1/F2": { bg: "#ecfdf5", color: "#047857", border: "#a7f3d0" },
  "L1/L2": { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  "J1/J2/O1/O2": { bg: "#fdf2f8", color: "#be185d", border: "#fbcfe8" },
  "R1/R2": { bg: "#f0fdfa", color: "#0f766e", border: "#99f6e4" },
};

export default function MonitoringPanel() {
  // Data states
  const [events, setEvents] = useState([]);
  const [partnerStats, setPartnerStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all"); // Left Sidebar active class
  const [selectedPartner, setSelectedPartner] = useState("all"); // Top "Captured By" filter
  const [selectedRole, setSelectedRole] = useState("all"); // "all" | "partner" | "admin"
  const [selectedAvailability, setSelectedAvailability] = useState("all"); // "all" | "available" | "unavailable"
  const [locationSearch, setLocationSearch] = useState("");
  const [lightbox, setLightbox] = useState(null);

  // Fetch all monitoring data
  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setError("");
    try {
      const [evList, stats] = await Promise.all([
        apiFetch("/api/events?days=30", { auth: true }),
        apiFetch("/api/events/partners-summary", { auth: true }),
      ]);
      setEvents(Array.isArray(evList) ? evList : []);
      setPartnerStats(Array.isArray(stats) ? stats : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(false), 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper to determine partner status
  const isPartner = (e) => {
    if (e.capturedByRole === "partner" || e.capturedByRole === "user") return true;
    const by = (e.capturedBy || "").toLowerCase().trim();
    return by && by !== "admin" && by !== "administrator" && by !== "system";
  };

  // Counts per category for the Left Sidebar
  const categoryCounts = useMemo(() => {
    const map = {};
    CATEGORY_DEFINITIONS.forEach((c) => {
      map[c.id] = { total: 0, open: 0, hasScreenshot: 0 };
    });

    events.forEach((e) => {
      const hasImg = e.hasScreenshot || Boolean(e.screenshotUrl);
      const isAvail = e.available === true;

      // Overall count
      map["all"].total++;
      if (isAvail) map["all"].open++;
      if (hasImg) map["all"].hasScreenshot++;

      // Specific Category
      if (map[e.category]) {
        map[e.category].total++;
        if (isAvail) map[e.category].open++;
        if (hasImg) map[e.category].hasScreenshot++;
      }
    });

    return map;
  }, [events]);

  // Filtered Events displayed on the right side
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // 1. Left Sidebar Visa Category filter
      if (selectedCategory !== "all" && e.category !== selectedCategory) return false;

      // 2. Top "Captured By" Partner Filter
      if (selectedPartner !== "all") {
        if (selectedPartner === "__admin__") {
          if (isPartner(e)) return false;
        } else if (selectedPartner === "__all_partners__") {
          if (!isPartner(e)) return false;
        } else {
          const emailMatch = (e.capturedByEmail || "").toLowerCase() === selectedPartner.toLowerCase();
          const nameMatch = (e.capturedBy || "").toLowerCase() === selectedPartner.toLowerCase();
          if (!emailMatch && !nameMatch) return false;
        }
      }

      // 3. Role filter (if set separately)
      if (selectedRole === "partner" && !isPartner(e)) return false;
      if (selectedRole === "admin" && isPartner(e)) return false;

      // 4. Availability filter
      if (selectedAvailability === "available" && e.available !== true) return false;
      if (selectedAvailability === "unavailable" && e.available === true) return false;

      // 5. Location / VAC Search
      if (locationSearch.trim()) {
        const q = locationSearch.toLowerCase().trim();
        const loc = (e.location || "").toLowerCase();
        const prevLoc = (e.previousLocation || "").toLowerCase();
        const by = (e.capturedBy || "").toLowerCase();
        const email = (e.capturedByEmail || "").toLowerCase();
        if (!loc.includes(q) && !prevLoc.includes(q) && !by.includes(q) && !email.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedCategory, selectedPartner, selectedRole, selectedAvailability, locationSearch]);

  const activeCategoryObj = useMemo(() => {
    return CATEGORY_DEFINITIONS.find((c) => c.id === selectedCategory) || CATEGORY_DEFINITIONS[0];
  }, [selectedCategory]);

  const removeEvent = async (id) => {
    if (!window.confirm("Delete this screenshot event record?")) return;
    setBusyId(id);
    try {
      await apiFetch(`/api/events/${id}`, { method: "DELETE", auth: true });
      setEvents((list) => list.filter((e) => e._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const clearAllEvents = async () => {
    if (!window.confirm("Delete ALL event and screenshot records? This cannot be undone.")) return;
    try {
      await apiFetch("/api/events", { method: "DELETE", auth: true });
      setEvents([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedPartner("all");
    setSelectedRole("all");
    setSelectedAvailability("all");
    setLocationSearch("");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedPartner !== "all" ||
    selectedAvailability !== "all" ||
    locationSearch.trim() !== "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      {/* 1. TOP HEADER SUMMARY STRIP */}
      <div className="admin-card" style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800 }}>
                📡 Live Monitoring &amp; Screenshots Explorer
              </h2>
              <span className="tag ok" style={{ fontSize: 11, fontWeight: 700 }}>
                ● Active Live Feeds
              </span>
            </div>
            <p style={{ margin: "4px 0 0", color: "var(--ink-soft)", fontSize: 13.5 }}>
              Select a <strong>Visa Class</strong> on the left sidebar, and filter <strong>who captured the screenshot</strong> using the top filter.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button
              className="ghost sm"
              onClick={() => loadData(true)}
              disabled={refreshing}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 600 }}
            >
              🔄 {refreshing ? "Refreshing…" : "Refresh"}
            </button>
            {events.length > 0 && (
              <button
                className="danger sm"
                onClick={clearAllEvents}
                style={{ fontWeight: 600 }}
              >
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {error && <p className="form-msg err" style={{ marginTop: 14 }}>{error}</p>}
      </div>

      {/* 2. MAIN SPLIT LAYOUT (LEFT SIDEBAR VISA CLASSES + RIGHT SIDE SCREENSHOTS) */}
      <div className="monitoring-split-layout">
        {/* =========================================================================
            LEFT SIDEBAR: VISA CATEGORY SELECTOR
            ========================================================================= */}
        <aside className="monitoring-sidebar">
          <div className="admin-card" style={{ padding: "18px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--line)" }}>
              <strong style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--ink-soft)" }}>
                Visa Categories
              </strong>
              <span style={{ fontSize: 11, color: "var(--ink-muted)", fontWeight: 700 }}>
                {events.length} Captures
              </span>
            </div>

            <nav className="category-nav-list" aria-label="Visa Category Navigation">
              {CATEGORY_DEFINITIONS.map((cat) => {
                const isCur = selectedCategory === cat.id;
                const stats = categoryCounts[cat.id] || { total: 0, open: 0 };

                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-nav-item ${isCur ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: isCur ? 800 : 600 }}>
                        {cat.label}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: isCur ? "rgba(255,255,255,0.8)" : "var(--ink-soft)",
                          marginTop: 2,
                        }}
                      >
                        {cat.subtitle}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                      <span className="cat-count-badge">
                        {stats.total}
                      </span>
                      {stats.open > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: isCur ? "#a7f3d0" : "#059669",
                            background: isCur ? "rgba(5, 150, 105, 0.4)" : "rgba(5, 150, 105, 0.12)",
                            padding: "1px 5px",
                            borderRadius: 4,
                          }}
                        >
                          🟢 {stats.open} Open
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Stats in Sidebar */}
          <div className="admin-card" style={{ padding: "16px", fontSize: 12.5 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>
              📊 Quick Summary
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--ink-soft)" }}>Registered Partners:</span>
              <strong>{partnerStats.length}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--ink-soft)" }}>Open Slot Captures:</span>
              <strong style={{ color: "#059669" }}>{categoryCounts["all"]?.open || 0}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--ink-soft)" }}>Last Capture:</span>
              <strong>{events[0] ? timeAgo(events[0].detectedAt) : "—"}</strong>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT MAIN AREA: TOP "WHO CAPTURED IT" FILTER + SCREENSHOTS DISPLAY
            ========================================================================= */}
        <main style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", minWidth: 0 }}>
          {/* TOP FILTER TOOLBAR */}
          <div className="admin-card" style={{ padding: "18px 22px", margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
              <div>
                <h3 style={{ margin: "0 0 2px", fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>
                  {activeCategoryObj.label}
                </h3>
                <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                  Showing {filteredEvents.length} screenshots matching your active filters
                </span>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
                marginTop: 16,
                paddingTop: 14,
                borderTop: "1px solid var(--line)",
                alignItems: "center",
              }}
            >
              {/* 1. "WHO CAPTURED IT" PARTNER FILTER */}
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 4 }}>
                  👤 Who Captured the Screenshot:
                </label>
                <select
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    fontSize: 13,
                    borderRadius: "var(--r-md)",
                    fontWeight: selectedPartner !== "all" ? 700 : 500,
                    borderColor: selectedPartner !== "all" ? "#059669" : "var(--line)",
                    background: selectedPartner !== "all" ? "rgba(5, 150, 105, 0.04)" : "var(--surface)",
                  }}
                >
                  <option value="all">👥 All Capturers ({events.length} shots)</option>
                  <option value="__all_partners__">👥 All Partners Only</option>
                  <option value="__admin__">👑 Admin Tests Only</option>
                  <optgroup label="── Specific Partner Accounts ──">
                    {partnerStats.map((p) => (
                      <option key={p._id} value={p.email}>
                        👤 {p.name || p.email} ({p.totalScreenshots || 0} shots)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* 2. LOCATION / VAC CENTER SEARCH */}
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 4 }}>
                  📍 Search Center / Post:
                </label>
                <input
                  type="text"
                  placeholder="Chennai, Hyderabad, Delhi…"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  style={{ width: "100%", padding: "7px 12px", fontSize: 13, borderRadius: "var(--r-md)" }}
                />
              </div>

              {/* 3. AVAILABILITY STATUS FILTER */}
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 4 }}>
                  🟢 Slot Availability:
                </label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", fontSize: 13, borderRadius: "var(--r-md)" }}
                >
                  <option value="all">All Availability Statuses</option>
                  <option value="available">🟢 Open Slots Only ({categoryCounts[selectedCategory]?.open || 0})</option>
                  <option value="unavailable">🔴 No Slots Available</option>
                </select>
              </div>
            </div>

            {/* Active Filters Pill Bar */}
            {hasActiveFilters && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--line)", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-soft)" }}>Active:</span>

                {selectedCategory !== "all" && (
                  <span className="tag" style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(30, 58, 138, 0.08)", borderColor: "#1e3a8a", color: "#1e3a8a" }}>
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory("all")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 800 }}>✕</button>
                  </span>
                )}

                {selectedPartner !== "all" && (
                  <span className="tag ok" style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Captured by: {selectedPartner === "__admin__" ? "Admin" : selectedPartner === "__all_partners__" ? "All Partners" : selectedPartner}
                    <button onClick={() => setSelectedPartner("all")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 800 }}>✕</button>
                  </span>
                )}

                {selectedAvailability !== "all" && (
                  <span className="tag" style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Status: {selectedAvailability === "available" ? "Open Slots" : "No Slots"}
                    <button onClick={() => setSelectedAvailability("all")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 800 }}>✕</button>
                  </span>
                )}

                {locationSearch.trim() && (
                  <span className="tag" style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Search: "{locationSearch.trim()}"
                    <button onClick={() => setLocationSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 800 }}>✕</button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#dc2626",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    marginLeft: 4,
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* SCREENSHOTS CONTAINER (GRID OR TABLE) */}
          {loading ? (
            <div className="admin-card" style={{ padding: "60px", textAlign: "center", color: "var(--ink-soft)" }}>
              Loading screenshots…
            </div>
          ) : filteredEvents.length === 0 ? (
            <div
              className="admin-card"
              style={{
                padding: "60px 24px",
                textAlign: "center",
                background: "var(--surface-2)",
                borderRadius: "var(--r-lg)",
                border: "1px dashed var(--line)",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>📸</div>
              <h3 style={{ margin: "0 0 6px", fontSize: 17 }}>No Screenshots Found for {activeCategoryObj.label}</h3>
              <p style={{ color: "var(--ink-soft)", fontSize: 13.5, margin: "0 0 16px" }}>
                {hasActiveFilters
                  ? "No captured screenshot matches your selected partner or filter options."
                  : "When partners or admin monitor appointment pages in this category, authentic screenshots will appear here."}
              </p>
              {hasActiveFilters && (
                <button type="button" className="btn sm" onClick={resetFilters}>
                  Reset All Filters
                </button>
              )}
            </div>
          ) : (
            /* PHOTO CARDS GALLERY (RIGHT SIDE) */
            <div className="screenshots-gallery-grid">
              {filteredEvents.map((e) => {
                const byPartner = isPartner(e);
                const hasImg = e.hasScreenshot || Boolean(e.screenshotUrl);
                const imgUrl = e.screenshotUrl || eventShotUrl(e._id);
                const isAvail = e.available === true;
                const catStyle = CATEGORY_COLORS[e.category] || { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };

                return (
                  <div key={e._id} className="shot-card">
                    {/* Header bar of Card */}
                    <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
                      <span
                        style={{
                          display: "inline-block",
                          background: catStyle.bg,
                          color: catStyle.color,
                          border: `1px solid ${catStyle.border}`,
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          fontWeight: 800,
                          fontSize: 11.5,
                        }}
                      >
                        {e.category}
                      </span>
                      <span className={isAvail ? "tag ok" : "tag"} style={{ fontSize: 11, fontWeight: 700 }}>
                        {isAvail ? "🟢 Open Slots" : "🔴 No Slots"}
                      </span>
                    </div>

                    {/* Screenshot Preview with Click to Enlarge */}
                    <div
                      className="shot-preview-wrap"
                      onClick={() => hasImg && setLightbox(imgUrl)}
                      title="Click to view full authentic screenshot"
                    >
                      {hasImg ? (
                        <img
                          src={imgUrl}
                          alt={`${e.category} appointment screenshot`}
                          loading="lazy"
                          className="shot-img"
                        />
                      ) : (
                        <div className="no-shot-placeholder">
                          <span>No screenshot image</span>
                        </div>
                      )}
                      <div className="shot-hover-overlay">🔍 Click to Enlarge Full Screenshot</div>
                    </div>

                    {/* Details Info */}
                    <div className="shot-info">
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 14 }}>📍</span>
                        <strong style={{ fontSize: 13.5, color: "var(--ink)" }}>
                          {e.location || "OFC Appointment"}
                        </strong>
                      </div>

                      {(() => {
                        const cleanD = (e.earliestDate || "").replace(/JanFeb[a-zA-Z]*|\b2016\d+\b/g, "").trim();
                        const finalD = cleanD ? (/^\d{1,2}$/.test(cleanD) ? `${cleanD.padStart(2, "0")} Sep, 2026` : cleanD) : e.earliestDate;
                        return finalD && finalD !== "No Dates Available" ? (
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                            📅 Earliest: {finalD} {e.slots && e.slots !== "0" ? `(${e.slots} slots)` : ""}
                          </div>
                        ) : (
                          <div style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 4 }}>
                            {e.currentAvailability || "Availability checked"}
                          </div>
                        );
                      })()}

                      <div style={{ fontSize: 11, color: "var(--ink-muted)", marginBottom: 10 }}>
                        🕒 {formatExactIST(e.detectedAt)} IST ({timeAgo(e.detectedAt)})
                      </div>

                      {/* Who captured it + actions */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid var(--line)",
                          paddingTop: 10,
                          marginTop: "auto",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: 10, textTransform: "uppercase", color: "var(--ink-muted)", fontWeight: 700 }}>
                            Captured By:
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: byPartner ? "#059669" : "#1e3a8a" }}>
                            {byPartner ? `👤 ${e.capturedBy || "Partner"}` : "👑 Admin Test"}
                          </span>
                        </div>

                        <div style={{ display: "flex", gap: 6 }}>
                          {hasImg && (
                            <button
                              type="button"
                              className="btn sm"
                              onClick={() => setLightbox(imgUrl)}
                              style={{ padding: "3px 10px", fontSize: 11, background: "#1e3a8a", color: "#fff", fontWeight: 700 }}
                            >
                              👁️ View
                            </button>
                          )}
                          <button
                            type="button"
                            className="danger sm"
                            disabled={busyId === e._id}
                            onClick={() => removeEvent(e._id)}
                            style={{ padding: "3px 8px", fontSize: 11 }}
                            title="Delete screenshot record"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* 3. LIGHTBOX MODAL FOR FULL-SIZE AUTHENTIC SCREENSHOT */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div
            className="lightbox-content image-lightbox"
            style={{ maxWidth: "94vw", maxHeight: "94vh", padding: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>📸 Authentic Appointment Portal Capture</h3>
                <span className="tag ok" style={{ fontSize: 11, fontWeight: 700 }}>Verified</span>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <a
                  href={lightbox}
                  download="visa-slot-screenshot.png"
                  className="btn sm"
                  style={{ background: "#059669", color: "#fff", textDecoration: "none", fontSize: 12 }}
                >
                  📥 Download Screenshot
                </a>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setLightbox(null)}
                  title="Close (Esc)"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ width: "100%", maxHeight: "80vh", overflow: "auto", textAlign: "center", background: "#0f172a", borderRadius: 8, padding: 8 }}>
              <img
                src={lightbox}
                alt="Full Screenshot"
                style={{ maxWidth: "100%", maxHeight: "78vh", objectFit: "contain", borderRadius: 4 }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
