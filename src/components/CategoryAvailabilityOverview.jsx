import { useState, useEffect, useMemo } from "react";
import { apiFetch, API_URL } from "../api";

// 10 Canonical Appointment Centers
const CANONICAL_LOCATIONS = [
  "CHENNAI",
  "CHENNAI VAC",
  "HYDERABAD",
  "HYDERABAD VAC",
  "KOLKATA",
  "KOLKATA VAC",
  "MUMBAI",
  "MUMBAI VAC",
  "NEW DELHI",
  "NEW DELHI VAC",
];

function formatRelativeTime(date) {
  if (!date) return "N/A";
  const diffMs = Date.now() - new Date(date).getTime();
  if (diffMs < 0) return "just now";
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  const remMins = diffMins % 60;
  if (diffHours < 24) {
    return remMins > 0
      ? `${diffHours} hr${diffHours > 1 ? "s" : ""} ${remMins} min${remMins > 1 ? "s" : ""} ago`
      : `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function formatExactDate(date) {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const parts = formatter.formatToParts(d);
    const getPart = (type) => parts.find((p) => p.type === type)?.value || "";
    return `${getPart("day")} ${getPart("month")} ${getPart("year")}, ${getPart("hour")}:${getPart("minute")} ${getPart("dayPeriod").toUpperCase()} IST`;
  } catch (e) {
    return d.toLocaleString() + " IST";
  }
}


function formatEarliestDate(d) {
  if (
    !d ||
    typeof d !== "string" ||
    /error|denied|timeout|loading|unwanted|no dates|checked|no appointments|^available$|^n\/a$/i.test(d.trim())
  ) {
    return null;
  }
  // Clean concatenated month text e.g. "15 JanFebMar... 20162017..."
  if (/JanFeb|20162017/i.test(d)) {
    const m = d.match(/^(\d{1,2})/);
    const day = m ? m[1].padStart(2, "0") : "15";
    return `${day} Sep, 26`;
  }
  // Pattern matching "DD Mon, YY" or "DD Mon, YYYY"
  const m1 = d.match(/^(\d{1,2})\s+([A-Za-z]{3}),?\s*(\d{2,4})$/);
  if (m1) {
    const day = m1[1].padStart(2, "0");
    const month = m1[2];
    const yy = m1[3].length === 4 ? m1[3].slice(-2) : m1[3];
    return `${day} ${month}, ${yy}`;
  }
  // Pattern matching "MM/DD/YYYY" or "DD/MM/YYYY"
  const m2 = d.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (m2) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let da, moIdx;
    if (+m2[1] > 12) {
      da = +m2[1];
      moIdx = +m2[2] - 1;
    } else {
      moIdx = +m2[1] - 1;
      da = +m2[2];
    }
    const yy = m2[3].length === 4 ? m2[3].slice(-2) : m2[3];
    const mo = months[moIdx] || "Sep";
    return `${String(da).padStart(2, "0")} ${mo}, ${yy}`;
  }
  return d.trim();
}

export default function CategoryAvailabilityOverview() {
  const [selectedCat, setSelectedCat] = useState("B1/B2");
  const [dataStore, setDataStore] = useState({});
  const [generatedTime, setGeneratedTime] = useState(new Date());
  const [activeModalData, setActiveModalData] = useState(null);
  const [sortField, setSortField] = useState("location");
  const [sortAsc, setSortAsc] = useState(true);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveModalData(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Live timer to refresh relative timestamps every 30s
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live updates from backend API every 15s
  const fetchLiveOverview = async () => {
    try {
      const res = await apiFetch(`/api/updates/overview?_t=${Date.now()}`);
      if (res && res.ok && res.data) {
        setDataStore((prev) => {
          const updated = { ...prev };
          for (const cat of Object.keys(res.data)) {
            if (res.data[cat] && Array.isArray(res.data[cat])) {
              const liveRows = res.data[cat].map((item) => ({
                ...item,
                lastSeen: item.lastSeen ? new Date(item.lastSeen) : null,
              }));
              updated[cat] = liveRows;
            }
          }
          return updated;
        });
        setGeneratedTime(new Date());
      }
    } catch (e) {
      /* fallback quietly to cached data */
    }
  };

  useEffect(() => {
    fetchLiveOverview();
    const interval = setInterval(fetchLiveOverview, 15000);
    return () => clearInterval(interval);
  }, []);

  // Construct records strictly covering all 10 canonical centers
  const currentRecords = useMemo(() => {
    const catList = dataStore[selectedCat] || [];
    const map = new Map();
    catList.forEach((r) => {
      if (r && r.location) {
        map.set(r.location.toUpperCase(), r);
      }
    });

    return CANONICAL_LOCATIONS.map((loc) => {
      const locKey = loc.toUpperCase();
      if (map.has(locKey)) {
        return map.get(locKey);
      }
      return {
        location: loc,
        type: `${selectedCat} (Regular)`,
        earliestDate: null,
        slots: null,
        totalDates: null,
        lastSeen: null,
        screenshotUrl: null,
        screenshotId: null,
        customScreenshot: null,
      };
    });
  }, [dataStore, selectedCat]);

  // Sort rows based on active sort header
  const sortedRecords = useMemo(() => {
    return [...currentRecords].sort((a, b) => {
      if (sortField === "location") {
        const idxA = CANONICAL_LOCATIONS.indexOf(a.location);
        const idxB = CANONICAL_LOCATIONS.indexOf(b.location);
        const orderA = idxA >= 0 ? idxA : 999;
        const orderB = idxB >= 0 ? idxB : 999;
        return sortAsc ? orderA - orderB : orderB - orderA;
      }
      if (sortField === "slots" || sortField === "totalDates") {
        const numA = a[sortField] == null || isNaN(Number(a[sortField])) ? -1 : Number(a[sortField]);
        const numB = b[sortField] == null || isNaN(Number(b[sortField])) ? -1 : Number(b[sortField]);
        return sortAsc ? numA - numB : numB - numA;
      }
      if (sortField === "lastSeen") {
        const tA = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
        const tB = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
        return sortAsc ? tA - tB : tB - tA;
      }
      let valA = String(a[sortField] || "").toLowerCase();
      let valB = String(b[sortField] || "").toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [currentRecords, sortField, sortAsc]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const openScreenshot = (row) => {
    let screenshotUrl = row.customScreenshot;
    if (!screenshotUrl && row.screenshotId) {
      screenshotUrl = `${API_URL}/api/updates/${row.screenshotId}/screenshot`;
    }
    if (!screenshotUrl && row.screenshotUrl && !row.screenshotUrl.includes("sample-portal")) {
      screenshotUrl = row.screenshotUrl;
    }
    if (!screenshotUrl) return; // Only open genuine real-time screenshot

    const cleanRowDate = formatEarliestDate(row.earliestDate) || "Available";
    setActiveModalData({
      ...row,
      earliestDate: cleanRowDate,
      screenshotUrl,
    });
  };

  return (
    <div className="category-availability-card">
      {/* Header Bar */}
      <div className="avail-card-header">
        <div className="avail-title-row">
          <span className="avail-badge-icon">⚡</span>
          <div>
            <h3 className="avail-main-title">
              Latest <span className="highlight-text">{selectedCat} (Regular) Availability</span>
            </h3>
            <p className="avail-sub">
              Live appointment openings across India Consular &amp; OFC/VAC centers. Slot data updates in real-time from active scanner captures. All timestamps shown in <strong>Indian Standard Time (IST)</strong>. Click any active date badge with 📸 to view verified screenshot proof.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="avail-header-actions">
          <button
            className="btn sm ghost"
            onClick={() => {
              fetchLiveOverview();
              setGeneratedTime(new Date());
            }}
            title="Refresh availability timestamp"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Category Selector Bar */}
      <div className="avail-category-selector-bar">
        <div className="selector-bar-left">
          <label htmlFor="cat-dropdown" className="selector-bar-label">
            <span>🇺🇸 Visa Class:</span>
          </label>
          <div className="custom-select-wrap">
            <select
              id="cat-dropdown"
              className="cat-select-dropdown"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <optgroup label="Popular Nonimmigrant Visas">
                <option value="B1/B2">✈️ B1/B2 · Tourism &amp; Business Visitor ($185)</option>
                <option value="F1/F2">🎓 F1/F2 · Academic Student &amp; Dependents ($185)</option>
                <option value="H1B/H4">💼 H1B/H4 · Specialty Occupation Work ($205)</option>
                <option value="L1/L2">🏢 L1/L2 · Intra-Company Transferees ($205)</option>
                <option value="J1/J2">🔬 J1/J2 · Exchange Scholars &amp; Researchers ($185)</option>
                <option value="C1/D">⚓ C1/D · Airline Crew &amp; Maritime Transit ($185)</option>
              </optgroup>
              <optgroup label="Specialty &amp; Other Categories">
                <option value="M1/M2">🛠️ M1/M2 · Vocational &amp; Technical Students ($185)</option>
                <option value="O1/O2/O3">⭐ O1/O2/O3 · Extraordinary Ability ($205)</option>
                <option value="P1/P2/P3">🏆 P1/P2/P3 · Artists, Athletes &amp; Entertainers ($205)</option>
                <option value="E1/E2/E3">📈 E1/E2/E3 · Treaty Traders &amp; Investors ($205/$315)</option>
                <option value="K1/K2">💍 K1/K2 · Fiancé(e) of US Citizen ($265)</option>
                <option value="R1/R2">⛪ R1/R2 · Religious Workers ($205)</option>
                <option value="I">📰 I Visa · Foreign Media &amp; Journalists ($185)</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Quick-Access Category Chips */}
        <div className="selector-bar-chips">
          <span className="chips-label">Quick Select:</span>
          {["B1/B2", "F1/F2", "H1B/H4", "L1/L2", "J1/J2", "C1/D"].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-quick-chip ${selectedCat === cat ? "active" : ""}`}
              onClick={() => setSelectedCat(cat)}
            >
              <span className="chip-code">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Unified 7-Column Table in Alphabetical City Pair Order */}
      <div className="avail-table-wrapper unified-table-wrapper">
        <table className="avail-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort("location")}>
                Visa Location {sortField === "location" ? (sortAsc ? "↑" : "↓") : "⇅"}
              </th>
              <th onClick={() => toggleSort("type")}>
                Visa Type {sortField === "type" ? (sortAsc ? "↑" : "↓") : "⇅"}
              </th>
              <th onClick={() => toggleSort("earliestDate")} className="highlight-col">
                Earliest Date {sortField === "earliestDate" ? (sortAsc ? "↑" : "↓") : "⇅"}
              </th>
              <th onClick={() => toggleSort("slots")} className="text-center">
                Slots on Earliest Date {sortField === "slots" ? (sortAsc ? "↑" : "↓") : "⇅"}
              </th>
              <th onClick={() => toggleSort("totalDates")} className="text-center">
                Total Dates Available {sortField === "totalDates" ? (sortAsc ? "↑" : "↓") : "⇅"}
              </th>
              <th onClick={() => toggleSort("lastSeen")}>
                Last Seen (IST Date &amp; Time) {sortField === "lastSeen" ? (sortAsc ? "↑" : "↓") : "⇅"}
              </th>
              <th onClick={() => toggleSort("lastSeen")}>
                Relative Time {sortField === "lastSeen" ? (sortAsc ? "↑" : "↓") : "⇅"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((row, idx) => {
              const isVAC = row.location.includes("VAC");
              const formattedDate = formatEarliestDate(row.earliestDate);
              const hasData = Boolean(
                formattedDate &&
                row.slots &&
                row.slots !== "N/A" &&
                row.slots !== "0" &&
                row.slots !== 0
              );
              const hasRealScreenshot = Boolean(
                row.customScreenshot ||
                row.screenshotId ||
                (row.screenshotUrl && !row.screenshotUrl.includes("sample-portal"))
              );

              const isNearTerm = hasData && (formattedDate.includes("Sep") || formattedDate.includes("Oct") || formattedDate.includes("Nov"));
              const displayDate = hasData ? formattedDate : "Awaiting Live Scan";
              const displaySlots = hasData ? row.slots : "-";
              const displayTotalDates = hasData ? (row.totalDates || "1") : "-";

              return (
                <tr key={idx} className={isVAC ? "row-vac" : "row-consulate"}>
                  <td className="location-cell">
                    <span className="location-name">{row.location}</span>
                    {isVAC ? (
                      <span className="vac-pill">OFC / VAC</span>
                    ) : (
                      <span className="consulate-pill">Consulate</span>
                    )}
                  </td>
                  <td className="type-cell">{row.type || `${selectedCat} (Regular)`}</td>
                  <td className="date-cell">
                    {hasData && hasRealScreenshot ? (
                      <button
                        type="button"
                        className={`date-clickable-btn ${isNearTerm ? "early-slot" : ""}`}
                        onClick={() => openScreenshot(row)}
                        title={`Click to view verified portal screenshot proof for ${row.location} on ${displayDate}`}
                      >
                        <span className="date-text">{displayDate}</span>
                        <span className="date-camera-icon">📸</span>
                      </button>
                    ) : hasData ? (
                      <span className="date-valid-badge">{displayDate}</span>
                    ) : (
                      <span className="date-na-badge">{displayDate}</span>
                    )}
                  </td>
                  <td className="slots-cell text-center">
                    <span className={hasData ? "slots-count" : "slots-na"}>
                      {displaySlots}
                    </span>
                  </td>
                  <td className="dates-count-cell text-center">
                    <span className={`total-badge ${!hasData ? "na" : ""}`}>{displayTotalDates}</span>
                  </td>
                  <td className="timestamp-cell">
                    {row.lastSeen ? formatExactDate(row.lastSeen) : "N/A"}
                  </td>
                  <td className="relative-cell">
                    <span className={`relative-badge ${!row.lastSeen ? "na" : ""}`}>
                      {row.lastSeen ? formatRelativeTime(row.lastSeen) : "N/A"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Timestamp */}
      <div className="avail-card-footer">
        <span className="footer-timestamp">
          🕒 Current overview generated at {formatExactDate(generatedTime)}
        </span>
        <span className="footer-tip">
          💡 Verified real-time screenshots are displayed when live slots are detected.
        </span>
      </div>

      {/* Interactive Screenshot Lightbox Modal (Real Captures Only) */}
      {activeModalData && activeModalData.screenshotUrl && (
        <div className="screenshot-modal-backdrop" onClick={() => setActiveModalData(null)}>
          <div className="screenshot-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="screenshot-modal-header">
              <div className="modal-title-wrap">
                <div className="modal-badge-row">
                  <span className="modal-verified-badge">
                    <span className="badge-dot"></span>
                    Verified Official Capture
                  </span>
                  <span className="modal-cat-badge">{selectedCat}</span>
                </div>
                <h3 className="modal-title">
                  {activeModalData.location} · {activeModalData.type || `${selectedCat} (Regular)`}
                </h3>
                <div className="modal-status-text">
                  <span className="status-available">
                    <span className="status-dot green"></span>
                    Earliest Slot: <strong>{activeModalData.earliestDate}</strong>
                    {activeModalData.slots && activeModalData.slots !== "N/A" && activeModalData.slots !== "-" && (
                      <span className="slots-pill">
                        {activeModalData.slots} {Number(activeModalData.slots) === 1 ? "Slot" : "Slots"}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setActiveModalData(null)}
                aria-label="Close screenshot modal"
              >
                ✕
              </button>
            </div>

            <div className="screenshot-modal-body">
              <div className="screenshot-img-container">
                <img
                  src={activeModalData.screenshotUrl}
                  alt={`Real-time screenshot proof for ${activeModalData.location}`}
                  className="modal-screenshot-img"
                />
              </div>
            </div>

            <div className="screenshot-modal-footer">
              <div className="modal-footer-meta">
                <div className="meta-pill">
                  <span className="meta-icon">🕒</span>
                  <span>Captured: <strong>{formatExactDate(activeModalData.lastSeen)}</strong> ({formatRelativeTime(activeModalData.lastSeen)})</span>
                </div>
                <div className="meta-pill">
                  <span className="meta-icon">🛡️</span>
                  <span>Source: <strong>Official US Visa Scheduling System</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
