import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { formatDate } from "../constants";

function Stars({ n }) {
  if (!n) return null;
  return <div className="stars">{"★".repeat(n)}{"☆".repeat(5 - n)}</div>;
}

export function SuccessStories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    apiFetch("/api/feedback?successStory=1")
      .then((d) => setStories(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="section" id="stories">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">Success stories</div>
          <h2>Clients who got their appointment</h2>
          <p>Real notes from people we helped land an earlier slot.</p>
        </div>
        <div className="stories-grid">
          {stories.map((s) => (
            <div className="quote-card story" key={s._id}>
              <span className="badge-story">Success story</span>
              <Stars n={s.rating} />
              <blockquote>“{s.message}”</blockquote>
              <div className="who">
                {s.name} <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>· {formatDate(s.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeedbackWall() {
  const [items, setItems] = useState([]);

  const load = () =>
    apiFetch("/api/feedback")
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => {});

  useEffect(() => {
    load();
    const onPosted = () => load();
    window.addEventListener("feedback:posted", onPosted);
    return () => window.removeEventListener("feedback:posted", onPosted);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="feedback-grid" style={{ marginTop: 20 }}>
      {items.slice(0, 8).map((f) => (
        <div className="quote-card" key={f._id}>
          <Stars n={f.rating} />
          <blockquote>“{f.message}”</blockquote>
          <div className="who">
            {f.name} <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>· {formatDate(f.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
