import { useState, useMemo } from "react";
import PageShell from "../components/PageShell.jsx";
import { CATEGORY_GROUPS } from "../constants";
import { GENERAL_STEPS, CATEGORY_PROCEDURES } from "../data/procedures.js";

export const OFFICIAL_GOV_PORTALS = [
  {
    id: "ds160",
    name: "CEAC Form DS-160 Portal",
    badge: "Official Form",
    icon: "📝",
    url: "https://ceac.state.gov/genniv/",
    domain: "ceac.state.gov",
    desc: "Complete, retrieve, submit, and print your Online Nonimmigrant Visa Application Form DS-160 barcode confirmation.",
    action: "Open DS-160 Portal ↗",
    primary: true,
  },
  {
    id: "sevis",
    name: "SEVIS I-901 Fee Portal",
    badge: "F-1, M-1, J-1 Fee",
    icon: "🎓",
    url: "https://www.fmjfee.com/",
    domain: "fmjfee.com",
    desc: "Official DHS portal to pay the mandatory SEVIS I-901 fee ($350 for F/M, $220 for J) and print official payment receipts.",
    action: "Pay SEVIS Fee (fmjfee.com) ↗",
    primary: true,
  },
  {
    id: "usvisascheduling",
    name: "US Visa Scheduling Portal",
    badge: "India & Asia-Pacific",
    icon: "📅",
    url: "https://www.usvisascheduling.com/",
    domain: "usvisascheduling.com",
    desc: "Official portal for Indian consulates (Delhi, Mumbai, Chennai, Hyderabad, Kolkata) to schedule VAC biometrics and consular interview slots.",
    action: "Book Appointments ↗",
    primary: true,
  },
  {
    id: "ais",
    name: "AIS Global US Visa Portal",
    badge: "Americas & Europe",
    icon: "🌐",
    url: "https://ais.usvisa-info.com/",
    domain: "ais.usvisa-info.com",
    desc: "Official appointment scheduling service for Canada, United Kingdom, European Union, and Latin American consular districts.",
    action: "Open AIS Portal ↗",
  },
  {
    id: "ceac-status",
    name: "CEAC Visa Status Tracker",
    badge: "Real-Time Tracking",
    icon: "🔍",
    url: "https://ceac.state.gov/CEACStatTracker/Status.aspx",
    domain: "ceac.state.gov",
    desc: "Track real-time passport and visa application status (Application Received, Administrative Processing, Approved, Issued, Refused).",
    action: "Track Visa Status ↗",
    primary: true,
  },
  {
    id: "travel-state",
    name: "U.S. Department of State",
    badge: "Bureau of Consular Affairs",
    icon: "🏛️",
    url: "https://travel.state.gov/content/travel/en/us-visas.html",
    domain: "travel.state.gov",
    desc: "Official US Department of State policy, reciprocity tables, standard appointment wait times, and worldwide consular guidance.",
    action: "Visit travel.state.gov ↗",
  },
  {
    id: "uscis",
    name: "USCIS Petition Status Online",
    badge: "H, L, O, P, K Petitions",
    icon: "🏢",
    url: "https://egov.uscis.gov/",
    domain: "egov.uscis.gov",
    desc: "Track your Form I-129 (H-1B, L-1, O-1), Form I-129F (K-1), and Form I-140 approval notice receipt numbers directly with USCIS.",
    action: "Track USCIS Petition ↗",
  },
  {
    id: "i94",
    name: "CBP Official I-94 Travel Record",
    badge: "DHS / CBP",
    icon: "✈️",
    url: "https://i94.cbp.dhs.gov/",
    domain: "i94.cbp.dhs.gov",
    desc: "Retrieve your official electronic Form I-94 arrival/departure record, compliance history, and US travel entry logs.",
    action: "Retrieve I-94 Record ↗",
  },
];

function CheckableItem({ text }) {
  const [checked, setChecked] = useState(false);
  return (
    <label className={`checklist-item ${checked ? "checked" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="checklist-checkbox"
      />
      <span className="checklist-custom-box">{checked ? "✓" : ""}</span>
      <span className="checklist-text">{text}</span>
    </label>
  );
}

function CategoryDetailView({ category, proc }) {
  const [activeTab, setActiveTab] = useState("process"); // "process" | "vac" | "interview" | "dropbox" | "tips"

  const isStudentOrExchange = ["F1/F2", "M1/M2", "J1/J2"].includes(category);
  const isPetitionBased = ["H1B/H4", "L1/L2", "O1/O2/O3", "P1/P2/P3", "R1/R2", "K1/K2"].includes(category);

  return (
    <div className="category-detail-panel">
      {/* Category Visual Banner */}
      {proc.image && (
        <div className="guide-card-banner">
          <img
            src={proc.image}
            alt={proc.imageAlt || proc.label}
            className="guide-banner-img"
            loading="lazy"
          />
          <div className="guide-banner-overlay">
            <span className="category-hero-badge">
              {proc.icon} {category}
            </span>
            <div className="guide-banner-meta">
              <span className="meta-item">💵 Fee: {proc.fee}</span>
              <span className="meta-item">📅 Validity: {proc.validity}</span>
            </div>
          </div>
        </div>
      )}

      {/* Category Header & Official Portals */}
      <div className="guide-card-body">
        <div className="guide-card-header">
          <div className="guide-card-title-wrap">
            <span className="guide-cat-tag">
              {proc.icon} {category} Requirements &amp; Checklist
            </span>
            <h3 className="guide-card-title">{proc.label}</h3>
            <p className="guide-card-tagline">{proc.tagline}</p>
          </div>

          {/* Quick Direct Official Portal Buttons */}
          <div className="category-portal-actions">
            <span className="portal-actions-label">Official Portals:</span>
            <a
              href="https://ceac.state.gov/genniv/"
              target="_blank"
              rel="noopener noreferrer"
              className="portal-action-pill"
              title="Open Official DS-160 Application Portal"
            >
              📝 Fill Form DS-160 ↗
            </a>
            <a
              href="https://www.usvisascheduling.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="portal-action-pill"
              title="Open Official US Visa Appointment Scheduling Portal"
            >
              📅 US Visa Scheduling ↗
            </a>
            {isStudentOrExchange && (
              <a
                href="https://www.fmjfee.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="portal-action-pill highlight"
                title="Pay Mandatory SEVIS I-901 Fee"
              >
                🎓 Pay SEVIS Fee (fmjfee.com) ↗
              </a>
            )}
            {isPetitionBased && (
              <a
                href="https://egov.uscis.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="portal-action-pill"
                title="Track USCIS Petition Approval"
              >
                🏢 Track USCIS Petition ↗
              </a>
            )}
            <a
              href="https://ceac.state.gov/CEACStatTracker/Status.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="portal-action-pill"
              title="Track Visa Stamping & Passport Status"
            >
              🔍 CEAC Status Tracker ↗
            </a>
          </div>
        </div>

        {/* Section View Mode Tabs */}
        <div className="guide-view-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "process"}
            className={`guide-view-tab ${activeTab === "process" ? "active" : ""}`}
            onClick={() => setActiveTab("process")}
          >
            🚀 Step-by-Step Process
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "vac"}
            className={`guide-view-tab ${activeTab === "vac" ? "active" : ""}`}
            onClick={() => setActiveTab("vac")}
          >
            📑 Biometrics (VAC) Checklist
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "interview"}
            className={`guide-view-tab ${activeTab === "interview" ? "active" : ""}`}
            onClick={() => setActiveTab("interview")}
          >
            🏛️ Consular Interview Checklist
          </button>
          {proc.dropboxChecklist && (
            <button
              role="tab"
              aria-selected={activeTab === "dropbox"}
              className={`guide-view-tab ${activeTab === "dropbox" ? "active" : ""}`}
              onClick={() => setActiveTab("dropbox")}
            >
              🛡️ Dropbox Waiver Checklist
            </button>
          )}
          {proc.consularTips && (
            <button
              role="tab"
              aria-selected={activeTab === "tips"}
              className={`guide-view-tab ${activeTab === "tips" ? "active" : ""}`}
              onClick={() => setActiveTab("tips")}
            >
              💡 Interview Strategies
            </button>
          )}
        </div>

        {/* Tab 1: Step-by-Step Process */}
        {activeTab === "process" && (
          <div className="guide-tab-pane">
            <h4 className="pane-heading">Complete Roadmap for {category}</h4>
            <ol className="step-list-modern">
              {proc.steps.map((s, i) => (
                <li key={i} className="step-item-modern">
                  <div className="step-num-badge">{i + 1}</div>
                  <div className="step-info">
                    <strong className="step-title-text">{s.title}</strong>
                    <p className="step-body-text">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Tab 2: Biometrics (VAC / OFC) Checklist */}
        {activeTab === "vac" && (
          <div className="guide-tab-pane">
            <div className="checklist-head-bar">
              <div>
                <h4 className="pane-heading">📑 Step 1: Biometrics (OFC / VAC) Required Documents</h4>
                <p className="pane-sub">
                  Mandatory items to carry to your Visa Application Center appointment for fingerprints & digital photo.
                </p>
              </div>
              <span className="checklist-count-badge">
                {proc.vacChecklist.length} Required Items
              </span>
            </div>
            <div className="checklist-container">
              {proc.vacChecklist.map((item, idx) => (
                <CheckableItem key={idx} text={item} />
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Consular Interview Checklist */}
        {activeTab === "interview" && (
          <div className="guide-tab-pane">
            <div className="checklist-head-bar">
              <div>
                <h4 className="pane-heading">🏛️ Step 2: Consular Interview Required Documents Binder</h4>
                <p className="pane-sub">
                  Carry these original documents in a clear accordion folder organized by category.
                </p>
              </div>
              <span className="checklist-count-badge">
                {proc.interviewChecklist.length} Required Items
              </span>
            </div>
            <div className="checklist-container">
              {proc.interviewChecklist.map((item, idx) => (
                <CheckableItem key={idx} text={item} />
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Dropbox Waiver Checklist (Exclusive to B1/B2) */}
        {activeTab === "dropbox" && proc.dropboxChecklist && (
          <div className="guide-tab-pane">
            <div className="checklist-head-bar">
              <div>
                <h4 className="pane-heading">🛡️ Interview Waiver (Dropbox) Submission Checklist</h4>
                <p className="pane-sub">
                  If eligible for the interview waiver renewal, submit these items at your selected drop-off location.
                </p>
              </div>
              <span className="checklist-count-badge">
                {proc.dropboxChecklist.length} Required Items
              </span>
            </div>
            <div className="checklist-container">
              {proc.dropboxChecklist.map((item, idx) => (
                <CheckableItem key={idx} text={item} />
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Consular Tips */}
        {activeTab === "tips" && proc.consularTips && (
          <div className="guide-tab-pane">
            <h4 className="pane-heading">💡 Consular Interview Tips & Success Strategies</h4>
            <div className="tips-grid">
              {proc.consularTips.map((tip, idx) => (
                <div key={idx} className="tip-card">
                  <span className="tip-icon">✨</span>
                  <p className="tip-text">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GuidePage() {
  const [selectedCategory, setSelectedCategory] = useState("B1/B2");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORY_GROUPS;
    const q = searchQuery.toLowerCase();
    return CATEGORY_GROUPS.filter((g) => {
      const proc = CATEGORY_PROCEDURES[g];
      return (
        g.toLowerCase().includes(q) ||
        (proc && (
          proc.label.toLowerCase().includes(q) ||
          (proc.subtitle && proc.subtitle.toLowerCase().includes(q)) ||
          proc.tagline.toLowerCase().includes(q)
        ))
      );
    });
  }, [searchQuery]);

  const activeProc = CATEGORY_PROCEDURES[selectedCategory] || CATEGORY_PROCEDURES["B1/B2"];

  return (
    <PageShell>
      <section className="section guide-page-section" id="guide">
        <div className="container">
          {/* Header */}
          <div className="section-head text-center">
            <div className="eyebrow">
              <span>📚 Comprehensive US Visa Guide</span>
            </div>
            <h2>Step-by-Step Process &amp; Document Checklists</h2>
            <p>
              Select your visa category on the left to view complete booking roadmaps, official portals, and interactive document checklists for Biometrics (VAC) and Consular Interview appointments.
            </p>
          </div>

          {/* Official Government Portals & Resource Hub */}
          <div className="official-portals-hub">
            <div className="portals-hub-head">
              <div className="portals-hub-title-row">
                <span className="hub-seal-icon">🏛️</span>
                <div>
                  <h3>Official U.S. Government Portals &amp; Direct Services</h3>
                  <p>Verified government links for DS-160 forms, SEVIS fee payments, and consular appointment scheduling.</p>
                </div>
              </div>
            </div>

            <div className="portals-cards-grid">
              {OFFICIAL_GOV_PORTALS.map((portal) => (
                <a
                  key={portal.id}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`portal-card ${portal.primary ? "portal-primary" : ""}`}
                >
                  <div className="portal-card-top">
                    <span className="portal-icon">{portal.icon}</span>
                    <span className="portal-badge">{portal.badge}</span>
                  </div>
                  <strong className="portal-name">{portal.name}</strong>
                  <span className="portal-domain">{portal.domain}</span>
                  <p className="portal-desc">{portal.desc}</p>
                  <span className="portal-link-btn">{portal.action}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Master-Detail Split Layout */}
          <div className="guide-split-layout">
            {/* Left Column: Categories Sidebar Filter */}
            <aside className="guide-sidebar">
              <div className="guide-sidebar-card">
                <div className="sidebar-head">
                  <div className="sidebar-title-row">
                    <span className="sidebar-title-icon">📂</span>
                    <div>
                      <h4 className="sidebar-title">Visa Categories</h4>
                      <span className="sidebar-subtitle">{CATEGORY_GROUPS.length} Available Categories</span>
                    </div>
                  </div>

                  {/* Search / Filter Input */}
                  <div className="sidebar-search-wrap">
                    <span className="sidebar-search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Filter category (e.g. F1, H1B)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="sidebar-search-input"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="sidebar-search-clear"
                        title="Clear filter"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories List */}
                <div className="sidebar-cat-list" role="tablist">
                  {/* Master Universal Process Option */}
                  <button
                    role="tab"
                    aria-selected={selectedCategory === "general"}
                    className={`sidebar-cat-item ${selectedCategory === "general" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("general")}
                  >
                    <span className="cat-item-icon">🇺🇸</span>
                    <div className="cat-item-info">
                      <div className="cat-item-top">
                        <strong className="cat-item-code">Universal 7-Step Process</strong>
                        <span className="cat-item-badge">All Visas</span>
                      </div>
                      <span className="cat-item-sub">Consular Appointment Guide</span>
                    </div>
                    <span className="cat-item-arrow">→</span>
                  </button>

                  {/* 13 Specific Categories */}
                  {filteredCategories.map((g) => {
                    const proc = CATEGORY_PROCEDURES[g];
                    const isSelected = selectedCategory === g;
                    return (
                      <button
                        key={g}
                        role="tab"
                        aria-selected={isSelected}
                        className={`sidebar-cat-item ${isSelected ? "active" : ""}`}
                        onClick={() => setSelectedCategory(g)}
                      >
                        <span className="cat-item-icon">{proc?.icon || "📄"}</span>
                        <div className="cat-item-info">
                          <div className="cat-item-top">
                            <strong className="cat-item-code">{g}</strong>
                            <span className="cat-item-fee">{proc?.fee.split(" ")[0] || "$185"}</span>
                          </div>
                          <span className="cat-item-sub">{proc?.subtitle || proc?.label}</span>
                        </div>
                        <span className="cat-item-arrow">→</span>
                      </button>
                    );
                  })}

                  {filteredCategories.length === 0 && (
                    <div className="sidebar-empty-state">
                      <p>No categories found for "{searchQuery}".</p>
                      <button onClick={() => setSearchQuery("")} className="btn btn-outline btn-sm">
                        Reset Filter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Right Column: Active Category Requirements & Checklists */}
            <main className="guide-content-area">
              {selectedCategory === "general" ? (
                <div className="universal-process-card" id="g-general">
                  <div className="universal-head">
                    <div className="universal-icon">🇺🇸</div>
                    <div>
                      <h3>Master US Visa Appointment Booking Process</h3>
                      <p>Universal 7-step process applicable to all nonimmigrant visa classes.</p>
                    </div>
                  </div>
                  <div className="universal-steps-grid">
                    {GENERAL_STEPS.map((step) => (
                      <div key={step.step} className="universal-step-item">
                        <div className="universal-step-badge">Step {step.step}</div>
                        <strong className="universal-step-title">{step.title}</strong>
                        <p className="universal-step-desc">{step.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <CategoryDetailView
                  key={selectedCategory}
                  category={selectedCategory}
                  proc={activeProc}
                />
              )}
            </main>
          </div>

          {/* Disclaimer Banner */}
          <div className="guide-disclaimer-box">
            <span className="disclaimer-icon">ℹ️</span>
            <div>
              <strong>Official Consular Policy Reminder:</strong>
              <p>
                Always verify specific documentation requirements in your official appointment confirmation letter on usvisascheduling.com / ais.usvisa-info.com. Consular officers reserve the right to request additional supporting documents during the interview.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}



