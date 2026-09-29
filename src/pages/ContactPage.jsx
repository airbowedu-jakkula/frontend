import { useState, useEffect } from "react";
import PageShell from "../components/PageShell.jsx";
import ContactForm from "../components/ContactForm.jsx";
import FeedbackForm from "../components/FeedbackForm.jsx";
import { FeedbackWall } from "../components/Testimonials.jsx";

export default function ContactPage({ initialTab = "contact" }) {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <PageShell>
      <section className="section contact-feedback-section" id="contact">
        <div className="container">
          <div className="section-head text-center">
            <div className="eyebrow">
              <span>📩 Connect with VisaSlot Updates</span>
            </div>
            <h2>Contact &amp; Client Feedback</h2>
            <p>
              Get in touch with our team for slot tracking inquiries, or share your experience and review our live community feedback.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="contact-feedback-tabs-wrap">
            <div className="contact-segmented-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={tab === "contact"}
                className={`contact-seg-btn ${tab === "contact" ? "active" : ""}`}
                onClick={() => {
                  setTab("contact");
                  window.location.hash = "#/contact";
                }}
              >
                💬 Get In Touch / Inquiries
              </button>
              <button
                role="tab"
                aria-selected={tab === "feedback"}
                className={`contact-seg-btn ${tab === "feedback" ? "active" : ""}`}
                onClick={() => {
                  setTab("feedback");
                  window.location.hash = "#/feedback";
                }}
              >
                ⭐ Community Reviews &amp; Feedback
              </button>
            </div>
          </div>

          {/* Tab 1: Contact Form & Support Info */}
          {tab === "contact" && (
            <div className="contact-tab-content">
              <div className="contact-grid">
                <div className="contact-form-col">
                  <ContactForm />
                </div>
                <div className="contact-info-col">
                  <div className="panel-card info-card">
                    <h3>Direct Support &amp; Alerts Assistance</h3>
                    <p className="hint">
                      Need help tracking early consular appointment openings, Dropbox submission criteria, or urgent slot notifications?
                    </p>
                    <ul className="contact-benefits-list">
                      <li>
                        <span className="benefit-icon">⚡</span>
                        <div>
                          <strong>Instant Alert Dispatches</strong>
                          <p>Receive notifications within seconds of consular system batch slot releases.</p>
                        </div>
                      </li>
                      <li>
                        <span className="benefit-icon">🛡️</span>
                        <div>
                          <strong>24/7 Verified Tracking</strong>
                          <p>Automated verification against official US visa scheduling portals.</p>
                        </div>
                      </li>
                      <li>
                        <span className="benefit-icon">🔒</span>
                        <div>
                          <strong>Privacy &amp; Security</strong>
                          <p>Your contact information is strictly used for visa update dispatches.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Feedback Form & Wall */}
          {tab === "feedback" && (
            <div className="feedback-tab-content">
              <div style={{ maxWidth: 640, margin: "0 auto 40px auto" }}>
                <FeedbackForm />
              </div>
              <FeedbackWall />
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
