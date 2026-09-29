import PageShell from "../components/PageShell.jsx";
import UpdatesBoard from "../components/UpdatesBoard.jsx";
import CategoryAvailabilityOverview from "../components/CategoryAvailabilityOverview.jsx";

export default function UpdatesPage() {
  return (
    <PageShell>
      <section className="section" style={{ paddingTop: 36, paddingBottom: 16 }}>
        <div className="container">
          <div className="section-head text-center" style={{ marginBottom: 28 }}>
            <div className="eyebrow">
              <span className="pulse-dot"></span>
              Live Scanner Stream
            </div>
            <h2>Live US Visa Appointment Openings</h2>
            <p>
              Consolidated real-time consular &amp; VAC appointment availability across all categories, plus live opening alerts from official portals.
            </p>
          </div>

          {/* Structured Category Availability Overview Table & Screenshot Analyzer */}
          <CategoryAvailabilityOverview />
        </div>
      </section>

      {/* Full Live Slot Updates Board */}
      <UpdatesBoard />
    </PageShell>
  );
}

