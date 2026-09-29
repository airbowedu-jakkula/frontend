import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";
import { NEWS_CATEGORIES, formatDate } from "../constants";

const catClass = (c) => "news-" + String(c || "general").toLowerCase().replace(/[^a-z0-9]/g, "");

export default function NewsFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("General");

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/news?limit=30")
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    if (filter === "General") return items;
    return items.filter((n) => n.category === filter || n.category === "General");
  }, [items, filter]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="section" id="news">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Latest news</div>
          <h2>US non-immigrant visa updates</h2>
          <p>
            News and guidance on US non-immigrant visas (NIV) — appointment policy, interview
            waivers, wait times and fees — plus category-specific updates for B1/B2, F1/F2 and
            H1B/H4 applicants.
          </p>
        </div>

        <div className="board-tabs">
          {NEWS_CATEGORIES.map((c) => (
            <button
              key={c}
              className={filter === c ? "board-tab on" : "board-tab"}
              onClick={() => setFilter(c)}
            >
              {c === "General" ? "All news" : c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="muted" style={{ color: "var(--ink-soft)" }}>Loading…</p>
        ) : visible.length === 0 ? (
          <div className="empty-state">No news in this category yet.</div>
        ) : (
          <div className="news-grid">
            {visible.map((n) => (
              <article className={`news-card ${catClass(n.category)}`} key={n._id}>
                <div className="news-meta">
                  <span className="news-cat">{n.category}</span>
                  <span className="news-date">{formatDate(n.publishedAt)}</span>
                </div>
                <h3 className="news-title">{n.title}</h3>
                <p className="news-summary">{n.summary}</p>
                {n.body && <p className="news-body">{n.body}</p>}
                {n.url && (
                  <a className="news-link" href={n.url} target="_blank" rel="noopener noreferrer">
                    Read more{n.source ? ` · ${n.source}` : ""} →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
