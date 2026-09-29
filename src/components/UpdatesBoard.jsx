import { useEffect, useMemo, useState } from "react";
import { apiFetch, API_URL } from "../api";
import { CATEGORY_GROUPS, formatDateTime } from "../constants";

const shotUrl = (id) => `${API_URL}/api/updates/${id}/screenshot`;

const RANGES = [
  { label: "Last 2 weeks", days: 14 },
  { label: "Last 30 days", days: 30 },
];

const catClass = (category) =>
  "cat-" + String(category || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export default function UpdatesBoard() {
  const [tab, setTab] = useState("all"); // "all" | one of CATEGORY_GROUPS
  const [days, setDays] = useState(14);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({ days: String(days) });
      if (tab !== "all") q.set("category", tab);
      const data = await apiFetch(`/api/updates?${q.toString()}`);
      setUpdates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 90000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, days]);

  const counts = useMemo(() => {
    const c = { all: updates.length };
    CATEGORY_GROUPS.forEach((g) => (c[g] = updates.filter((u) => u.category === g).length));
    return c;
  }, [updates]);

  const label = tab === "all" ? "all categories" : tab;

  return (
    <section className="section" id="updates">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Slot updates</div>
          <h2>Appointment openings by category</h2>
          <p>
            The latest appointment slots our team has spotted opening up, grouped by visa category.
            New to the process? See the <a href="#/guide">Process guide</a>.
          </p>
        </div>

        <div className="board-tabs">
          <button className={tab === "all" ? "board-tab on" : "board-tab"} onClick={() => setTab("all")}>
            All
          </button>
          {CATEGORY_GROUPS.map((g) => (
            <button
              key={g}
              className={tab === g ? "board-tab on" : "board-tab"}
              onClick={() => setTab(g)}
            >
              {g}
              {tab === "all" && counts[g] > 0 && <span className="n">{counts[g]}</span>}
            </button>
          ))}
        </div>

        <div className="board-toolbar">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
            {RANGES.map((r) => (
              <option key={r.days} value={r.days}>
                {r.label}
              </option>
            ))}
          </select>
          <span className="muted">
            {loading ? "Loading…" : `${updates.length} update${updates.length === 1 ? "" : "s"} · ${label}`}
          </span>
          <button className="ghost sm" onClick={load} disabled={loading} style={{ marginLeft: "auto" }}>
            Refresh
          </button>
        </div>

        {error && <p className="form-msg err">{error}</p>}

        {!loading && updates.length === 0 ? (
          <div className="empty-state">
            No {tab !== "all" ? tab + " " : ""}updates in this window yet. Check back soon or{" "}
            <a href="#/contact">get in touch</a> to be notified.
          </div>
        ) : (
          <div className="updates-grid">
            {updates.map((u) => (
              <article className={`update-card ${catClass(u.category)}`} key={u._id}>
                {(u.hasScreenshot || u.screenshotUrl) && (
                  <img
                    src={u.screenshotUrl || shotUrl(u._id)}
                    alt={`${u.category} slot screenshot`}
                    loading="lazy"
                    onClick={() => setLightbox(u.screenshotUrl || shotUrl(u._id))}
                  />
                )}
                <div className="body">
                  <span className="cat-badge">{u.category}</span>
                  {u.date && <div className="date-line">{u.date}</div>}
                  {u.location && (
                    <div className="row">
                      <span className="k">Location: </span>
                      {u.location}
                    </div>
                  )}
                  {u.count && (
                    <div className="row">
                      <span className="k">Slots: </span>
                      {u.count}
                    </div>
                  )}
                  {u.totalDates && u.totalDates !== "0" && (
                    <div className="row">
                      <span className="k">Dates Open: </span>
                      {u.totalDates}
                    </div>
                  )}
                  {u.note && (
                    <div className="row">
                      <span className="k">Note: </span>
                      {u.note}
                    </div>
                  )}
                  <div className="stamp">Spotted {formatDateTime(u.capturedAt)}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

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
            <img src={lightbox} alt="slot screenshot full size" />
          </div>
        </div>
      )}
    </section>
  );
}
