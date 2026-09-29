import { useState } from "react";
import PageShell from "../components/PageShell.jsx";

const VETTING_PILLARS = [
  {
    icon: "📱",
    title: "5-Year Social Media Handles",
    desc: "Every applicant must list all usernames, handles, and profile links used in the last 5 years across Facebook, Instagram, LinkedIn, X (Twitter), YouTube, Reddit, and other networks.",
  },
  {
    icon: "📧",
    title: "5-Year Email & Phone History",
    desc: "All personal, academic, and business email addresses and mobile numbers used during the prior 5 years must be accurately disclosed on Form DS-160.",
  },
  {
    icon: "✈️",
    title: "International Travel History",
    desc: "Complete documentation of all foreign countries visited in the past 5 years, along with dates and purposes of travel.",
  },
  {
    icon: "🔍",
    title: "DS-5535 & 221(g) Security Checks",
    desc: "In cases requiring enhanced security clearance, consular posts issue Form DS-5535 requesting 15-year address history, 15-year job history, and all past passport numbers.",
  },
];

const PLATFORMS_CHECKED = [
  { name: "LinkedIn", badge: "Crucial for Employment & H1B/F1", tip: "Job titles, employer names, and employment dates must strictly match your DS-160 & I-129/I-20 records." },
  { name: "X (formerly Twitter)", badge: "Public Statements & Retweets", tip: "Public posts, retweets, and interactions are evaluated for security, compliance, and public sentiment." },
  { name: "Facebook & Instagram", badge: "Personal & Travel Ties", tip: "Photos, travel check-ins, and life events are checked to verify genuine nonimmigrant intent and home country ties." },
  { name: "Reddit & Public Forums", badge: "Immigration Discussions", tip: "Discussions regarding unauthorized work, visa loopholes, or illegal overstays can trigger red flags." },
  { name: "YouTube & Content Channels", badge: "Public Channels", tip: "Public video uploads, channels, and descriptions registered under your handles." },
];

const FAQS = [
  {
    q: "Do I need to provide passwords or login credentials?",
    a: "NO. The U.S. Department of State strictly forbids asking for passwords. Consular officers and systems only inspect publicly available profile data and declared usernames.",
  },
  {
    q: "What happens if I don't disclose a social media account?",
    a: "Willful failure to disclose an active or past account is considered material misrepresentation under INA § 212(a)(6)(C)(i). This can lead to visa refusal, revocation, or a permanent lifetime inadmissibility ban to the United States.",
  },
  {
    q: "What if my account was deleted or I no longer use it?",
    a: "If the account was active at any point within the past 5 years, you must still list the username/handle and mention in your notes that the account is currently inactive or deleted.",
  },
  {
    q: "What if I have never used social media?",
    a: "You can select 'None' on Form DS-160. However, if investigative systems find accounts registered with your email or phone number, it will be flagged as an omission.",
  },
  {
    q: "Will having a private account protect my profile?",
    a: "While privacy settings limit what the general public can see, officers can still review your bio, profile picture, handle, follower count, and linked platforms. Do not make accounts private immediately before an interview if it looks like concealment.",
  },
  {
    q: "What triggers Form DS-5535 Extreme Vetting?",
    a: "Travel to sensitive regions, high-tech or dual-use research fields (Technology Alert List / TAL), military background, or automated security watchlist hits can trigger administrative processing under Form DS-5535.",
  },
];

export default function SocialMediaVettingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <PageShell>
      <section className="section vetting-page" style={{ paddingTop: 36 }}>
        <div className="container">
          {/* Header */}
          <div className="section-head">
            <div className="eyebrow">
              <span>🛡️ Official DS-160 &amp; DS-5535 Guidelines</span>
            </div>
            <h2>U.S. Visa Social Media Vetting Process</h2>
            <p>
              A comprehensive guide to mandatory 5-year social media disclosure on Form DS-160, consular background checks, DS-5535 administrative reviews, and essential best practices for applicants.
            </p>
          </div>

          {/* Alert Banner */}
          <div className="vetting-alert-box">
            <div className="vetting-alert-icon">⚠️</div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", fontWeight: 800 }}>
                Mandatory DS-160 Requirement Since 2019
              </h4>
              <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
                Under U.S. Department of State regulations, almost all nonimmigrant (B1/B2, F1, H1B, L1) and immigrant visa applicants are required to disclose their social media identifiers from the past 5 years. Honesty and consistency are strictly evaluated.
              </p>
            </div>
          </div>

          {/* 4 Pillars of Vetting */}
          <div className="vetting-pillars-grid">
            {VETTING_PILLARS.map((p, i) => (
              <div className="vetting-pillar-card" key={i}>
                <div className="pillar-icon">{p.icon}</div>
                <h3 className="pillar-title">{p.title}</h3>
                <p className="pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* What Consular Officers Screen For */}
          <div className="vetting-deepdive-card">
            <div className="deepdive-head">
              <h3>🔍 What Consular Officers &amp; Automated Systems Evaluate</h3>
              <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
                Consular screening uses automated databases alongside human review to verify applicant background:
              </p>
            </div>

            <div className="checkpoints-list">
              <div className="checkpoint-item">
                <span className="cp-num">1</span>
                <div>
                  <strong>Employment &amp; Education Verification (LinkedIn &amp; Resumes)</strong>
                  <p>
                    Officers compare your declared job history, titles, responsibilities, and dates against your public LinkedIn profile and professional presence. Any major discrepancy can result in a 221(g) query.
                  </p>
                </div>
              </div>

              <div className="checkpoint-item">
                <span className="cp-num">2</span>
                <div>
                  <strong>Intent to Violate Visa Status (Unauthorized Work or Overstay)</strong>
                  <p>
                    Posts, comments, or job inquiries hinting at unauthorized employment in the U.S. (especially on B1/B2 tourist visas or F1 student off-campus work) are immediate grounds for 214(b) rejection.
                  </p>
                </div>
              </div>

              <div className="checkpoint-item">
                <span className="cp-num">3</span>
                <div>
                  <strong>National Security &amp; Technology Transfer (TAL List)</strong>
                  <p>
                    Applicants in advanced STEM, aerospace, AI, biotechnology, and nuclear engineering are checked for technology transfer risks under the Technology Alert List (TAL).
                  </p>
                </div>
              </div>

              <div className="checkpoint-item">
                <span className="cp-num">4</span>
                <div>
                  <strong>Consistency with DS-160 Form Data</strong>
                  <p>
                    Family details, marital status, travel history, and past residential addresses are cross-checked for absolute authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Specific Guidelines */}
          <div className="platforms-wrap">
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 16 }}>
              📱 Key Platforms &amp; Specific Screening Focus
            </h3>
            <div className="platforms-grid">
              {PLATFORMS_CHECKED.map((plat, idx) => (
                <div className="platform-card" key={idx}>
                  <div className="platform-top">
                    <h4>{plat.name}</h4>
                    <span className="plat-badge">{plat.badge}</span>
                  </div>
                  <p className="plat-tip">{plat.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dos and Don'ts */}
          <div className="dos-donts-grid">
            <div className="dos-card">
              <div className="dos-head">
                <span style={{ fontSize: 20 }}>✅</span>
                <h4>Essential Dos</h4>
              </div>
              <ul className="dos-list">
                <li><strong>List all handles truthfully:</strong> Include all accounts used in the past 5 years, even if currently inactive.</li>
                <li><strong>Sync your LinkedIn with DS-160:</strong> Ensure company names, designations, and dates are 100% aligned.</li>
                <li><strong>Review past public posts:</strong> Conduct a self-audit of public posts and group memberships.</li>
                <li><strong>Be honest during the interview:</strong> If asked about online presence, respond calmly and transparently.</li>
              </ul>
            </div>

            <div className="donts-card">
              <div className="donts-head">
                <span style={{ fontSize: 20 }}>❌</span>
                <h4>Critical Don'ts</h4>
              </div>
              <ul className="donts-list">
                <li><strong>Never share passwords:</strong> Passwords are private and never requested by U.S. authorities.</li>
                <li><strong>Do not hastily delete accounts:</strong> Abruptly deleting accounts right before an interview arouses suspicion of concealment.</li>
                <li><strong>Do not discuss unauthorized work:</strong> Avoid posting inquiries about illegal freelancing or overstaying.</li>
                <li><strong>Do not omit secondary email IDs:</strong> List all email addresses linked to your online presence.</li>
              </ul>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="vetting-faq-wrap">
            <div className="section-head" style={{ marginBottom: 20 }}>
              <div className="eyebrow">❓ Frequently Asked Questions</div>
              <h2>Common Questions About Social Media Vetting</h2>
            </div>

            <div className="faq-list">
              {FAQS.map((faq, i) => (
                <div
                  className={`faq-item ${openFaq === i ? "open" : ""}`}
                  key={i}
                  onClick={() => toggleFaq(i)}
                >
                  <div className="faq-question">
                    <span>{faq.q}</span>
                    <span className="faq-toggle-icon">{openFaq === i ? "−" : "+"}</span>
                  </div>
                  {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA to Live Tracker */}
          <div className="vetting-cta-box">
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "1.25rem", fontWeight: 800 }}>
                Need to book or reschedule your visa interview?
              </h3>
              <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 14 }}>
                Keep your DS-160 and social media records ready, and check our Live Slot Tracker to find early appointment slots across Indian consulates.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#/updates" className="btn sm">
                ⚡ View Live Slot Updates
              </a>
              <a href="#/guide" className="btn ghost sm">
                📋 Full Process Guide
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

