import { useState } from "react";
import { apiFetch } from "../api";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [state, setState] = useState({ status: "idle", msg: "" });

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "sending", msg: "" });
    try {
      await apiFetch("/api/feedback", {
        method: "POST",
        body: JSON.stringify({ name, email, rating: rating || undefined, message }),
      });
      setState({ status: "done", msg: "Thanks! Your feedback is now on the site." });
      setName("");
      setEmail("");
      setRating(0);
      setMessage("");
      window.dispatchEvent(new Event("feedback:posted"));
    } catch (err) {
      setState({ status: "error", msg: err.message });
    }
  };

  return (
    <div className="panel-card">
      <h3>Leave feedback</h3>
      <p className="hint">Your comment is published on this page straight away.</p>
      <form onSubmit={submit}>
        <div className="two-col">
          <div className="field">
            <label htmlFor="fb-name">Name</label>
            <input id="fb-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="fb-email">Email (optional)</label>
            <input id="fb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Rating</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className={rating >= n ? "on" : ""}
                onClick={() => setRating(n === rating ? 0 : n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="fb-msg">Your feedback</label>
          <textarea id="fb-msg" rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <button type="submit" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Submitting…" : "Submit feedback"}
        </button>
        {state.msg && (
          <p className={`form-msg ${state.status === "error" ? "err" : "ok"}`}>{state.msg}</p>
        )}
      </form>
    </div>
  );
}
