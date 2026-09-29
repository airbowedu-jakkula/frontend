import { useEffect, useState, useMemo } from "react";
import { apiFetch, API_URL, getToken } from "../api";
import { formatDateTime } from "../constants";

const shotUrl = (id) => `${API_URL}/api/updates/${id}/screenshot?token=${encodeURIComponent(getToken() || "")}`;

const CATEGORY_DEFINITIONS = [
  { id: "all", label: "🌐 All Visa Classes", subtitle: "All published slot updates" },
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

export default function ManageUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [screenshotFilter, setScreenshotFilter] = useState("all"); // "all" | "with"
  const [locationSearch, setLocationSearch] = useState("");
  const [slotStatusFilter, setSlotStatusFilter] = useState("all"); // "all" | "available" | "unavailable"

  const load = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setError("");
    try {
      const data = await apiFetch("/api/updates?days=90");
      setUpdates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this published slot update & screenshot?")) return;
    setBusy(id);
    try {
      await apiFetch(`/api/updates/${id}`, { method: "DELETE", auth: true });
      setUpdates((list) => list.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  // Category statistics
  const categoryCounts = useMemo(() => {
    const stats = {
      all: { total: updates.length, withShots: 0, open: 0 },
    };

    CATEGORY_DEFINITIONS.forEach((cat) => {
      if (cat.id !== "all") {
        stats[cat.id] = { total: 0, withShots: 0, open: 0 };
      }
    });

    updates.forEach((u) => {
      const hasImg = u.hasScreenshot || Boolean(u.screenshotUrl);
      const isOpen = u.count && u.count !== "0" && u.date !== "No Dates Available";

      if (hasImg) stats.all.withShots++;
      if (isOpen) stats.all.open++;

      const catId = u.category;
      if (stats[catId]) {
        stats[catId].total++;
        if (hasImg) stats[catId].withShots++;
        if (isOpen) stats[catId].open++;
      }
    });

    return stats;
  }, [updates]);

  // Filtered list based on sidebar and top filter toolbar
  const filteredUpdates = useMemo(() => {
    return updates.filter((u) => {
      // 1. Category Sidebar Filter
      if (selectedCategory !== "all" && u.category !== selectedCategory) {
        return false;
      }

      // 2. Media Filter
      const hasImg = u.hasScreenshot || Boolean(u.screenshotUrl);
      if (screenshotFilter === "with" && !hasImg) return false;

      // 3. Slot Status Filter
      const isUnavailable = !u.count || u.count === "0" || u.date === "No Dates Available";
      if (slotStatusFilter === "available" && isUnavailable) return false;
      if (slotStatusFilter === "unavailable" && !isUnavailable) return false;

      // 4. Location Search
      if (locationSearch.trim()) {
        const q = locationSearch.toLowerCase().trim();
        const loc = (u.location || "").toLowerCase();
        const type = (u.type || "").toLowerCase();
        const note = (u.note || "").toLowerCase();
        const date = (u.date || "").toLowerCase();
        if (!loc.includes(q) && !type.includes(q) && !note.includes(q) && !date.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [updates, selectedCategory, screenshotFilter, slotStatusFilter, locationSearch]);

  const activeCategoryObj = useMemo(() => {
    return CATEGORY_DEFINITIONS.find((c) => c.id === selectedCategory) || CATEGORY_DEFINITIONS[0];
  }, [selectedCategory]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
      {/* 1. Header & Summary Banner */}
      <div className="admin-card" style={{ padding: "22px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ margin: "0 0 6px", fontSize: "1.35rem", fontWeight: 800 }}>
              🗂️ Manage Public Slot Updates &amp; Screenshots
            </h2>
            <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 13.5 }}>
              Browse published visa openings and authentic portal screenshots displayed on the live public website.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="ghost sm"
              onClick={() => load(true)}
              disabled={loading || refreshing}
              style={{ fontWeight: 600 }}
            >
              {refreshing ? "🔄 Refreshing…" : "🔄 Refresh Updates"}
            </button>
          </div>
        </div>

        {error && <p className="form-msg err" style={{ marginTop: 14 }}>{error}</p>}
      </div>

      {/* 2. SPLIT LAYOUT: LEFT SIDEBAR (VISA CLASSES) + RIGHT CONTENT (SCREENSHOT PHOTO CARDS & TABLE) */}
      <div className="monitoring-split-layout">
        {/* =========================================================================
            LEFT SIDEBAR: CATEGORY NAVIGATION & METRICS
            ========================================================================= */}
        <aside className="monitoring-sidebar">
          <div className="admin-card" style={{ padding: "16px 14px" }}>
            <div style={{ padding: "0 8px 12px", borderBottom: "1px solid var(--line)", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                Visa Categories
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-muted)", marginTop: 2 }}>
                Click to filter updates &amp; screenshots
              </div>
            </div>

            <nav className="category-nav-list">
              {CATEGORY_DEFINITIONS.map((cat) => {
                const isCur = selectedCategory === cat.id;
                const stats = categoryCounts[cat.id] || { total: 0, withShots: 0, open: 0 };

                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-nav-item ${isCur ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
                      <span style={{ fontWeight: isCur ? 800 : 600 }}>{cat.label}</span>
                      <span
                        style={{
                          fontSize: 11,
                          color: isCur ? "rgba(255,255,255,0.75)" : "var(--ink-muted)",
                        }}
                      >
                        {cat.subtitle}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                      <span className="cat-count-badge">
                        {stats.total}
                      </span>
                      {stats.withShots > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: isCur ? "#bfdbfe" : "#1d4ed8",
                            background: isCur ? "rgba(29, 78, 216, 0.4)" : "rgba(29, 78, 216, 0.1)",
                            padding: "1px 5px",
                            borderRadius: 4,
                          }}
                        >
                          📸 {stats.withShots}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Metrics in Sidebar */}
          <div className="admin-card" style={{ padding: "16px", fontSize: 12.5 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>
              📊 Quick Metrics
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--ink-soft)" }}>Total Published:</span>
              <strong>{updates.length}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--ink-soft)" }}>With Screenshots:</span>
              <strong style={{ color: "#1d4ed8" }}>{categoryCounts.all.withShots}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "var(--ink-soft)" }}>Slots Available:</span>
              <strong style={{ color: "#059669" }}>{categoryCounts.all.open}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--ink-soft)" }}>Latest Update:</span>
              <strong>{updates[0] ? timeAgo(updates[0].capturedAt) : "—"}</strong>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT MAIN AREA: TOP FILTER TOOLBAR + SCREENSHOT PHOTO GRID & TABLE
            ========================================================================= */}
        <main style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", minWidth: 0 }}>
          {/* Top Filter Bar */}
          <div className="admin-card" style={{ padding: "18px 22px", margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
              <div>
                <h3 style={{ margin: "0 0 2px", fontSize: 17, fontWeight: 800, color: "var(--ink)" }}>
                  {activeCategoryObj.label}
                </h3>
                <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                  Showing {filteredUpdates.length} of {updates.length} updates
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
              {/* Media Filter */}
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 4 }}>
                  📸 Screenshot Media:
                </label>
                <select
                  value={screenshotFilter}
                  onChange={(e) => setScreenshotFilter(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", fontSize: 13, borderRadius: "var(--r-md)" }}
                >
                  <option value="all">All Updates ({updates.length})</option>
                  <option value="with">📸 With Screenshots Only ({categoryCounts.all.withShots})</option>
                </select>
              </div>

              {/* Slot Availability Filter */}
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 4 }}>
                  🟢 Slot Status:
                </label>
                <select
                  value={slotStatusFilter}
                  onChange={(e) => setSlotStatusFilter(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", fontSize: 13, borderRadius: "var(--r-md)" }}
                >
                  <option value="all">All Statuses</option>
                  <option value="available">🟢 Available Slots Only</option>
                  <option value="unavailable">⚪ No Dates / Unavailable</option>
                </select>
              </div>

              {/* Location Search */}
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 4 }}>
                  📍 Search Location / Notes:
                </label>
                <input
                  type="text"
                  placeholder="Chennai, Hyderabad, OFC…"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  style={{ width: "100%", padding: "7px 12px", fontSize: 13, borderRadius: "var(--r-md)" }}
                />
              </div>
            </div>

            {/* Active Filters Reset */}
            {(selectedCategory !== "all" || screenshotFilter !== "all" || slotStatusFilter !== "all" || locationSearch.trim()) && (
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>
                  Active filter applied · Showing {filteredUpdates.length} updates
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setScreenshotFilter("all");
                    setSlotStatusFilter("all");
                    setLocationSearch("");
                  }}
                  style={{ background: "none", border: "none", color: "#dc2626", fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Content Views */}
          {loading ? (
            <div className="admin-card" style={{ padding: "40px", textAlign: "center", color: "var(--ink-soft)" }}>
              Loading updates &amp; screenshots…
            </div>
          ) : filteredUpdates.length === 0 ? (
            <div className="admin-card" style={{ padding: "48px", textAlign: "center", color: "var(--ink-soft)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <h4 style={{ margin: "0 0 6px", color: "var(--ink)" }}>No updates found</h4>
              <p style={{ margin: 0, fontSize: 13.5 }}>
                No published updates match your current filters. Try changing or resetting filters.
              </p>
            </div>
          ) : (
            /* PHOTO CARDS GRID VIEW: SCREENSHOTS DISPLAYED ON BOTH SIDES */
            <div className="screenshots-gallery-grid">
              {filteredUpdates.map((u) => {
                const hasImg = u.hasScreenshot || Boolean(u.screenshotUrl);
                const imgUrl = u.screenshotUrl || shotUrl(u._id);
                const catStyle = CATEGORY_COLORS[u.category] || { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" };
                const isOpen = u.count && u.count !== "0" && u.date !== "No Dates Available";

                return (
                  <div key={u._id} className="shot-card">
                    {/* High-Resolution Screenshot Header */}
                    <div
                      className="shot-preview-wrap"
                      onClick={() => hasImg && setLightbox(imgUrl)}
                      style={{ cursor: hasImg ? "pointer" : "default" }}
                    >
                      {hasImg ? (
                        <>
                          <img src={imgUrl} alt={`${u.category} screenshot`} loading="lazy" className="shot-img" />
                          <div className="shot-hover-overlay">🔍 Click to Enlarge Full Screenshot</div>
                        </>
                      ) : (
                        <div className="no-shot-placeholder">
                          <span>📷 No screenshot image attached</span>
                        </div>
                      )}
                    </div>

                    {/* Card Body Details */}
                    <div className="shot-info">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span
                          style={{
                            display: "inline-block",
                            background: catStyle.bg,
                            color: catStyle.color,
                            border: `1px solid ${catStyle.border}`,
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            fontWeight: 800,
                            fontSize: 12,
                          }}
                        >
                          {u.category}
                        </span>

                        <span
                          className={isOpen ? "tag ok" : "tag"}
                          style={{ fontSize: 11.5, fontWeight: 800 }}
                        >
                          {isOpen ? `🟢 ${u.count} Slots` : "Checked"}
                        </span>
                      </div>

                      {/* Location & Type */}
                      <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>
                        📍 {u.location || "General"}
                        {u.type && (
                          <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-soft)", marginLeft: 6 }}>
                            ({u.type})
                          </span>
                        )}
                      </div>

                      {/* Earliest Date */}
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isOpen ? "#059669" : "#dc2626",
                          marginBottom: 6,
                          background: isOpen ? "rgba(5, 150, 105, 0.08)" : "rgba(220, 38, 38, 0.06)",
                          padding: "4px 8px",
                          borderRadius: 6,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          alignSelf: "flex-start",
                        }}
                      >
                        📅 {u.date || "Available"}
                      </div>

                      {/* IST Timestamp */}
                      <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginBottom: 8 }}>
                        🕒 Posted: {formatDateTime(u.capturedAt)}
                      </div>

                      {/* Note snippet if available */}
                      {u.note && (
                        <div style={{ fontSize: 12, color: "var(--ink)", marginBottom: 10, background: "var(--surface-2)", padding: "6px 10px", borderRadius: 6, border: "1px solid var(--line)" }}>
                          {u.note}
                        </div>
                      )}

                      {/* Card Bottom Actions */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: "auto" }}>
                        <span style={{ fontSize: 11, color: "var(--ink-muted)", textTransform: "capitalize" }}>
                          {u.source === "extension" ? "⚡ Live Extension" : "Admin Dashboard"}
                        </span>

                        <div style={{ display: "flex", gap: 6 }}>
                          {hasImg && (
                            <button
                              type="button"
                              className="btn sm"
                              onClick={() => setLightbox(imgUrl)}
                              style={{ padding: "4px 10px", fontSize: 11.5, fontWeight: 700, background: "#1e3a8a", color: "#fff" }}
                            >
                              👁️ View
                            </button>
                          )}
                          <button
                            type="button"
                            className="danger sm"
                            disabled={busy === u._id}
                            onClick={() => remove(u._id)}
                            style={{ padding: "4px 8px", fontSize: 11.5 }}
                            title="Delete this update"
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

      {/* 3. FULL-SIZE SCREENSHOT LIGHTBOX MODAL */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div
            className="lightbox-content image-lightbox"
            style={{ maxWidth: "94vw", maxHeight: "94vh", padding: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>📸 Authentic Visa Slot Update Screenshot</h3>
                <span className="tag ok" style={{ fontSize: 11, fontWeight: 700 }}>Published</span>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <a
                  href={lightbox}
                  download="visa-slot-update.png"
                  className="btn sm"
                  style={{ background: "#059669", color: "#fff", textDecoration: "none", fontSize: 12 }}
                >
                  📥 Download Image
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
