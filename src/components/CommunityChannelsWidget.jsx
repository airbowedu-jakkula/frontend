import React, { useState } from "react";
import ScheduleCallModal from "./ScheduleCallModal.jsx";

export const CHANNELS_DATA = [
  {
    num: "01",
    id: "B1/B2",
    category: "B1/B2",
    code: "B1/B2",
    subtitle: "TOURIST & BUSINESS",
    desc: "Real-time opening alerts for in-person consular interviews & dropbox appointments across all 5 India consulates.",
    telegramUrl: "https://t.me/visaupdatesB1B2",
    telegramHandle: "@visaupdatesB1B2",
    whatsappUrl: "https://chat.whatsapp.com/K6oAst22aRfJQfGjuwciyn",
    whatsappLabel: "JOIN WHATSAPP GROUP",
    telegramLabel: "JOIN TELEGRAM CHANNEL",
  },
  {
    num: "02",
    id: "F1/F2",
    category: "F1/F2",
    code: "F1/F2",
    subtitle: "STUDENT VISA",
    desc: "Instant notifications for Spring, Fall & Summer intake visa appointments, expedited releases & OFC biometrics.",
    telegramUrl: "https://t.me/USVisaSlotsF1F2",
    telegramHandle: "@USVisaSlotsF1F2",
    whatsappUrl: "https://chat.whatsapp.com/GoMELpPBN8K3IJWwaJfoi3",
    whatsappLabel: "JOIN WHATSAPP GROUP",
    telegramLabel: "JOIN TELEGRAM CHANNEL",
  },
  {
    num: "03",
    id: "H1B/H4",
    category: "H1B/H4",
    code: "H1B/H4",
    subtitle: "SPECIALTY WORK",
    desc: "Ultra-fast alerts for primary applicants & dependents, dropbox releases, and Mumbai/Delhi/Chennai regular interview dates.",
    telegramUrl: "https://t.me/H1BandH4",
    telegramHandle: "@H1BandH4",
    whatsappUrl: "https://chat.whatsapp.com/DCeD9MeK7ZXASuundqAl6Q",
    whatsappLabel: "JOIN WHATSAPP GROUP",
    telegramLabel: "JOIN TELEGRAM CHANNEL",
  },
  {
    num: "04",
    id: "NOT_SURE",
    category: "Not Sure / Other",
    code: "NOT SURE",
    subtitle: "DIRECTLY CONTACT US",
    desc: "Unsure which visa category or consulate to target? Contact our team directly on WhatsApp or schedule a dedicated assistance call.",
    whatsappUrl: "https://wa.me/918143852523?text=Hi%2C%20I%20am%20looking%20for%20US%20visa%20slot%20booking%20assistance.%20Please%20guide%20me.",
    whatsappLabel: "CHAT ON WHATSAPP",
    telegramUrl: null,
    telegramLabel: null,
  },
];

export default function CommunityChannelsWidget({ activeCategory = null }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState("B1/B2");

  const openScheduleModal = (category = "B1/B2") => {
    setModalCategory(category === "ALL" || category === "Not Sure / Other" ? "Not Sure / Other" : category);
    setModalOpen(true);
  };

  return (
    <>
      <section className="community-channels-section" aria-label="WhatsApp and Telegram Alert Communities">
        <div className="community-channels-header">
          <div className="community-title-wrap">
            <div className="community-eyebrow">
              <span className="pulse-dot"></span>
              Direct Mobile Alerts • Instant Community Access
            </div>
            <h2 className="community-title">
              Join Our WhatsApp Community &amp; Telegram Channels
            </h2>
            <p className="community-subtitle">
              Get instant mobile alerts the exact second US visa slots open. Choose your visa category below to automatically join verified announcement channels or get your slot booked directly.
            </p>
          </div>

          {/* Slot Booking Assistance Call Trigger */}
          <div className="community-schedule-call-card">
            <div className="schedule-call-info">
              <span className="schedule-call-icon" aria-hidden="true">📅</span>
              <div className="schedule-call-texts">
                <span className="schedule-call-label">Visa Slot Booking Assistance</span>
                <span className="schedule-call-sub">Need urgent interview or dropbox slots?</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-schedule-call-direct"
              onClick={() => openScheduleModal(activeCategory || "B1/B2")}
            >
              <span>Schedule Call Directly</span>
              <span className="schedule-call-arrow">→</span>
            </button>
          </div>
        </div>

        {/* Editorial Minimalist Cards Grid */}
        <div className="editorial-channels-grid">
          {CHANNELS_DATA.map((ch) => {
            const isHighlighted = activeCategory && (ch.category === activeCategory || ch.id === activeCategory);

            return (
              <div
                key={ch.id}
                className={`editorial-channel-card ${isHighlighted ? "highlighted" : ""}`}
              >
                <div className="card-num">{ch.num}</div>

                <h3 className="card-code-title">
                  {ch.code}
                </h3>
                <div className="card-subtitle-label">{ch.subtitle}</div>

                <div className={`card-links-stack ${!ch.telegramUrl ? "single-action-stack" : ""}`}>
                  {/* WhatsApp Action Link */}
                  <a
                    href={ch.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-action-link link-whatsapp"
                    title={`${ch.whatsappLabel || "Join on WhatsApp"} - ${ch.code}`}
                  >
                    <svg
                      className="action-icon"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.49-1.39-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.3 3.81.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.29z" />
                    </svg>
                    <span>{ch.whatsappLabel || "JOIN WHATSAPP GROUP"}</span>
                    <span className="action-arrow">↗</span>
                  </a>

                  {/* Telegram Action Link (if configured) */}
                  {ch.telegramUrl && (
                    <a
                      href={ch.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-action-link link-telegram"
                      title={`${ch.telegramLabel || "Join on Telegram"} - ${ch.code}`}
                    >
                      <svg
                        className="action-icon"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                      </svg>
                      <span>{ch.telegramLabel || "JOIN TELEGRAM CHANNEL"}</span>
                      <span className="action-arrow">↗</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="community-banner-footer">
          <span className="info-icon">⚡</span>
          <p>
            <strong>All alert channels are 100% free to join.</strong> You will receive real-time notifications with verified portal screenshots as soon as consular and VAC appointments open up across India. Need personalized booking assistance?{" "}
            <button
              type="button"
              className="inline-schedule-btn"
              onClick={() => openScheduleModal("General")}
            >
              Schedule a direct call with our team →
            </button>
          </p>
        </div>
      </section>

      {/* Booking Assistance Call Modal */}
      <ScheduleCallModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialCategory={modalCategory}
      />
    </>
  );
}
