import React, { useState, useEffect } from "react";

const SLIDING_ITEMS = [
  {
    id: "s1",
    tag: "🇮🇳 New Delhi",
    category: "B1/B2",
    badgeType: "live",
    message: "New Delhi VAC: Next available slot window Oct 2026 (7.5 Mo avg). Bulk appointments expected this Friday.",
    time: "3m ago",
    link: "#wait-times",
  },
  {
    id: "s2",
    tag: "🇮🇳 Mumbai",
    category: "F1/F2",
    badgeType: "update",
    message: "Mumbai Consulate: 24 new Student Visa slots opened for Spring intake. Keep SEVIS fee ready.",
    time: "11m ago",
    link: "#/updates",
  },
  {
    id: "s3",
    tag: "🇮🇳 Hyderabad",
    category: "H1B/H4",
    badgeType: "live",
    message: "Hyderabad VAC: Interview Waiver (Dropbox) slots available within next 18 days.",
    time: "19m ago",
    link: "#/updates",
  },
  {
    id: "s4",
    tag: "🇮🇳 Chennai",
    category: "B1/B2",
    badgeType: "update",
    message: "Chennai VAC: Consular interview slots released for Nov-Dec window. Verified portal screenshots available.",
    time: "28m ago",
    link: "#wait-times",
  },
  {
    id: "s5",
    tag: "🇮🇳 Kolkata",
    category: "Emergency",
    badgeType: "live",
    message: "Kolkata Consulate: Fastest wait time among India posts (1.5 Months avg) for expedited cases.",
    time: "35m ago",
    link: "#wait-times",
  },
  {
    id: "s6",
    tag: "🛡️ Advisory",
    category: "DS-160",
    badgeType: "alert",
    message: "Mandatory: 5-year social media handle disclosure strictly verified during consular vetting.",
    time: "1h ago",
    link: "#/social-media-vetting",
  },
  {
    id: "s7",
    tag: "📊 State Dept",
    category: "Official",
    badgeType: "update",
    message: "Global Visa Wait Times synchronized with travel.state.gov official portal database.",
    time: "2h ago",
    link: "#wait-times",
  },
];

export default function SlidingInfoBar() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="sliding-info-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Live Visa Updates Ticker"
    >
      <div className="sliding-info-lead">
        <span className="live-pulse-badge">
          <span className="pulse-dot"></span>
          LIVE FEED
        </span>
      </div>

      <div className="sliding-track-container">
        <div className={`sliding-track ${isPaused ? "paused" : ""}`}>
          {/* Repeat twice for seamless infinite marquee loop */}
          {[...SLIDING_ITEMS, ...SLIDING_ITEMS].map((item, idx) => (
            <a
              key={`${item.id}-${idx}`}
              href={item.link}
              className="sliding-chip"
            >
              <span className={`chip-tag chip-${item.badgeType}`}>
                {item.tag}
              </span>
              <span className="chip-cat">{item.category}</span>
              <span className="chip-msg">{item.message}</span>
              <span className="chip-time">{item.time}</span>
              <span className="chip-arrow">→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

