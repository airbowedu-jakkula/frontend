import { useState, useEffect } from "react";
import { apiFetch } from "../api";

const DEFAULT_DAILY_BULLETINS = [
  {
    _id: "b1",
    category: "B1/B2",
    title: "Fresh B1/B2 Bulk Slots Released for Delhi & Mumbai",
    summary: "U.S. Consulates in India opened new appointment batches today. Check the live board to hold early dates.",
    source: "US Embassy India",
    image: "/usa-capitol.svg",
    imageAlt: "U.S. Capitol Washington D.C.",
    url: "#/updates",
  },
  {
    _id: "b2",
    category: "Dropbox",
    title: "Interview Waiver (Dropbox) Guidelines Updated",
    summary: "Applicants renewing visas within 48 months of expiry remain eligible for interview exemptions across all 5 VAC posts.",
    source: "travel.state.gov",
    image: "/statue-of-liberty.jpg",
    imageAlt: "Statue of Liberty New York",
    url: "https://travel.state.gov",
  },
  {
    _id: "b3",
    category: "F1/F2",
    title: "Student Visa Peak Window: Early Slots Available in Hyderabad",
    summary: "Students heading for upcoming university terms can find expedited openings. Keep I-20 and SEVIS fee ready.",
    source: "Consular Affairs",
    image: "/usa-consulate.svg",
    imageAlt: "U.S. Consular Seal Post",
    url: "#/updates",
  },
  {
    _id: "b4",
    category: "H1B/H4",
    title: "H-1B Petition Holders: Chennai & Kolkata Stamping Openings",
    summary: "New specialty occupation appointment dates spotted for Chennai VAC and Kolkata consular posts.",
    source: "Visa Notification Desk",
    image: "/usa-golden-gate.svg",
    imageAlt: "Golden Gate California",
    url: "#/updates",
  },
  {
    _id: "b5",
    category: "Advisory",
    title: "DS-160 Social Media Vetting & 5-Year History Check",
    summary: "Consular officers verify past 5 years of social handles, emails, and employment. Ensure complete DS-160 sync.",
    source: "Consular Policy",
    image: "/usa-statue-liberty.svg",
    imageAlt: "Statue of Liberty Torch",
    url: "#/social-media-vetting",
  },
  {
    _id: "b6",
    category: "Wait Times",
    title: "Global Wait Times Synchronized with travel.state.gov",
    summary: "Average consular wait for New Delhi stands at 7.5 months. See the full official wait table below.",
    source: "Dept of State",
    image: "/usa-capitol.svg",
    imageAlt: "U.S. Capitol",
    url: "#wait-times",
  },
];

const FALLBACK_IMAGES = [
  "/usa-capitol.svg",
  "/usa-statue-liberty.svg",
  "/usa-consulate.svg",
  "/usa-golden-gate.svg",
];

export default function HeroNewsWidget() {
  const [news, setNews] = useState(DEFAULT_DAILY_BULLETINS);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    apiFetch("/api/news?limit=10")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const merged = data.map((item, idx) => ({
            ...item,
            image: item.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
            imageAlt: item.imageAlt || "USA Landmark",
          }));
          setNews(merged);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isPaused || news.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, news.length]);

  const current = news[index] || news[0];

  const todayStr = new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="hero-news-floating-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Floating Header with USA Flag Branding */}
      <div className="hero-news-head">
        <div className="us-flag-badge">
          {/* Detailed SVG USA Flag */}
          <svg
            className="flag-svg"
            viewBox="0 0 64 40"
            width="26"
            height="17"
            aria-label="United States Flag"
          >
            <clipPath id="us-flag-clip-hero">
              <rect width="64" height="40" rx="3" />
            </clipPath>
            <g clipPath="url(#us-flag-clip-hero)">
              <rect width="64" height="40" fill="#b22234" />
              <rect y="3.08" width="64" height="3.08" fill="#fff" />
              <rect y="9.23" width="64" height="3.08" fill="#fff" />
              <rect y="15.38" width="64" height="3.08" fill="#fff" />
              <rect y="21.54" width="64" height="3.08" fill="#fff" />
              <rect y="27.69" width="64" height="3.08" fill="#fff" />
              <rect y="33.85" width="64" height="3.08" fill="#fff" />
              <rect width="25.6" height="21.54" fill="#0c2340" />
              <circle cx="4.5" cy="4" r="1.2" fill="#fff" />
              <circle cx="12.5" cy="4" r="1.2" fill="#fff" />
              <circle cx="20.5" cy="4" r="1.2" fill="#fff" />
              <circle cx="8.5" cy="8" r="1.2" fill="#fff" />
              <circle cx="16.5" cy="8" r="1.2" fill="#fff" />
              <circle cx="4.5" cy="12" r="1.2" fill="#fff" />
              <circle cx="12.5" cy="12" r="1.2" fill="#fff" />
              <circle cx="20.5" cy="12" r="1.2" fill="#fff" />
              <circle cx="8.5" cy="16" r="1.2" fill="#fff" />
              <circle cx="16.5" cy="16" r="1.2" fill="#fff" />
            </g>
          </svg>
          <span className="bulletin-title">U.S. Visa Bulletin</span>
        </div>

        <div className="daily-tag">
          <span className="pulse-dot"></span>
          <span>Updated {todayStr}</span>
        </div>
      </div>

      {/* Featured USA Landmark Image Banner */}
      <div className="floating-img-wrap">
        <img
          src={current.image || FALLBACK_IMAGES[0]}
          alt={current.imageAlt || "USA Visa Update"}
          className="floating-banner-img"
          loading="lazy"
        />
        <div className="floating-img-overlay">
          <span className="floating-source-badge">🏛️ {current.source || "Official Source"}</span>
        </div>
      </div>

      {/* Dynamic News Body with Smooth Transition */}
      <div className="hero-news-content" key={current._id || index}>
        <div className="hero-news-meta">
          <span className={`cat-pill ${String(current.category || "General").toLowerCase().replace(/[^a-z0-9]/g, "")}`}>
            {current.category || "Alert"}
          </span>
          <span className="news-time-badge">Daily Intelligence</span>
        </div>

        <h4 className="hero-news-title">{current.title}</h4>
        <p className="hero-news-desc">{current.summary}</p>

        <div className="hero-news-footer">
          {current.url && current.url.startsWith("http") ? (
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-action-link"
            >
              Official Advisory ↗
            </a>
          ) : (
            <a href="#/updates" className="news-action-link">
              ⚡ Open Live Slots →
            </a>
          )}

          {/* Navigation Controls */}
          <div className="hero-news-controls">
            <button
              className="ctrl-btn"
              onClick={() => setIndex((prev) => (prev - 1 + news.length) % news.length)}
              aria-label="Previous update"
            >
              ‹
            </button>
            <span className="page-indicator">
              {index + 1} / {news.length}
            </span>
            <button
              className="ctrl-btn"
              onClick={() => setIndex((prev) => (prev + 1) % news.length)}
              aria-label="Next update"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Progress ticker dots at bottom */}
      <div className="ticker-dots">
        {news.map((_, i) => (
          <button
            key={i}
            className={`dot-pill ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
