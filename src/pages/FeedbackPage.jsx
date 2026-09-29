import PageShell from "../components/PageShell.jsx";
import FeedbackForm from "../components/FeedbackForm.jsx";
import { FeedbackWall } from "../components/Testimonials.jsx";

export default function FeedbackPage() {
  return (
    <PageShell>
      <section className="section" id="feedback">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">Feedback</div>
            <h2>Client feedback</h2>
            <p>Read what people using our slot updates have said, and add your own. Comments are published here straight away.</p>
          </div>

          <div style={{ maxWidth: 560 }}>
            <FeedbackForm />
          </div>

          <FeedbackWall />
        </div>
      </section>
    </PageShell>
  );
}
