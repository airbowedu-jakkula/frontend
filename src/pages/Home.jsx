import { useState } from "react";
import PageShell from "../components/PageShell.jsx";
import GlobalWaitTimes from "../components/GlobalWaitTimes.jsx";
import NewsFeed from "../components/NewsFeed.jsx";
import { SuccessStories } from "../components/Testimonials.jsx";

const HERO_SLIDING_ITEMS = [
  {
    id: "h1",
    post: "🇮🇳 New Delhi",
    category: "B1/B2",
    type: "live",
    msg: "Next available slot window Oct 2026 (7.5 Mo avg). Bulk appointments expected this Friday.",
    time: "3m ago",
    url: "#wait-times",
  },
  {
    id: "h2",
    post: "🇮🇳 Mumbai",
    category: "F1/F2",
    type: "update",
    msg: "24 new Student Visa slots opened for Spring intake. Keep SEVIS fee & I-20 ready.",
    time: "11m ago",
    url: "#/updates",
  },
  {
    id: "h3",
    post: "🇮🇳 Hyderabad",
    category: "Dropbox",
    type: "live",
    msg: "Interview Waiver (Dropbox) appointments available within next 18 days.",
    time: "19m ago",
    url: "#/updates",
  },
  {
    id: "h4",
    post: "🇮🇳 Chennai",
    category: "B1/B2",
    type: "update",
    msg: "Consular interview slots released for Nov-Dec window with verified screenshots.",
    time: "28m ago",
    url: "#wait-times",
  },
  {
    id: "h5",
    post: "🇮🇳 Kolkata",
    category: "Emergency",
    type: "live",
    msg: "Fastest wait time among India VACs (1.5 Months avg) for expedited cases.",
    time: "35m ago",
    url: "#wait-times",
  },
  {
    id: "h6",
    post: "🛡️ Advisory",
    category: "DS-160",
    type: "alert",
    msg: "5-year social media handle disclosure strictly verified during consular vetting.",
    time: "1h ago",
    url: "#/social-media-vetting",
  },
  {
    id: "h7",
    post: "📊 State Dept",
    category: "Official",
    type: "update",
    msg: "Global Visa Wait Times synchronized directly with travel.state.gov database.",
    time: "2h ago",
    url: "#wait-times",
  },
];

export default function Home() {
  const [isTickerPaused, setIsTickerPaused] = useState(false);

  const scrollToWaitTimes = (e) => {
    e.preventDefault();
    const el = document.getElementById("wait-times");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <PageShell>
      {/* Hero Section with Statue of Liberty on Left, American Flag on Right, & Integrated Live Sliding Information */}
      <section className="hero" aria-label="US Visa Slot Alerts & Wait Times">
        {/* Statue of Liberty Graphic Art on Left */}
        <div className="hero-liberty-backdrop" aria-hidden="true">
          <img
            src="/statue-of-liberty.jpg"
            alt="Statue of Liberty"
            className="liberty-figure-img"
            loading="eager"
          />
        </div>

        {/* American Flag Visual on Right Hand Side (Exact Sky Match with Liberty) */}
        <div className="hero-flag-backdrop" aria-hidden="true">
          <img
            src="/usa-flag-hero.jpg"
            alt="American Flag Flying"
            className="flag-figure-img"
            loading="eager"
          />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-integrated-content">
            {/* Main Headline */}
            <h1>
              US Visa <span className="gradient-text">Appointment Openings</span>
              <span className="hero-subhead-line">Tracked in Real-Time for You</span>
            </h1>

            {/* Subtitle Description */}
            <p className="sub">
              We scan B1/B2, F1/F2, and H1B/H4 appointment slots continuously and post every opening
              immediately — with verified screenshots, exact dates, and locations so you can act fast.
            </p>

            {/* Integrated Sliding Information Stream (No separate widget) */}
            <div
              className="hero-integrated-slider"
              onMouseEnter={() => setIsTickerPaused(true)}
              onMouseLeave={() => setIsTickerPaused(false)}
              role="region"
              aria-label="Real-time Visa Updates Ticker"
            >
              <div className="slider-lead-pill">
                <span className="pulse-dot"></span>
                <span>LIVE SLIDING INTEL</span>
              </div>
              <div className="slider-track-viewport">
                <div className={`slider-track ${isTickerPaused ? "paused" : ""}`}>
                  {[...HERO_SLIDING_ITEMS, ...HERO_SLIDING_ITEMS].map((item, idx) => (
                    <a
                      key={`${item.id}-${idx}`}
                      href={item.url}
                      className="slider-item-card"
                    >
                      <span className={`slider-tag tag-${item.type}`}>{item.post}</span>
                      <span className="slider-cat">{item.category}</span>
                      <span className="slider-msg">{item.msg}</span>
                      <span className="slider-time">{item.time}</span>
                      <span className="slider-arrow">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="cta-row">
              <a href="#/updates" className="btn">
                ⚡ Browse Live Slots Board
              </a>
              <a href="#wait-times" className="btn ghost" onClick={scrollToWaitTimes}>
                ⏱️ Global Wait Times
              </a>
              <a href="#/contact" className="btn ghost">
                📩 Get Alert Notifications
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Global Wait Times Section (Official travel.state.gov Table) */}
      <GlobalWaitTimes />

      {/* Live Slot Tracker Banner Callout */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 48 }} aria-label="Live Slot Tracker Navigation">
        <div className="container">
          <div className="live-tracker-banner">
            <div className="banner-left">
              <div className="badge-live" style={{ marginBottom: 8 }}>
                <span className="pulse-dot"></span>
                Dedicated Real-Time Feed
              </div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 6px 0" }}>
                Ready to find an early appointment date?
              </h3>
              <p style={{ color: "var(--ink-soft)", margin: 0, fontSize: 14.5 }}>
                View our complete live stream of spotted visa appointment slots with official portal screenshots, city filters, and date filters.
              </p>
            </div>
            <a href="#/updates" className="btn" style={{ padding: "14px 28px", fontSize: 15, flexShrink: 0 }}>
              ⚡ Open Live Slot Updates Page →
            </a>
          </div>
        </div>
      </section>

      {/* Detailed News & Policy Alerts */}
      <NewsFeed />

      {/* Success Stories & Verified Community Testimonials */}
      <SuccessStories />
    </PageShell>
  );
}

