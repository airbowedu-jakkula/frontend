import { useState } from "react";
import { apiFetch } from "../api";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", message: "" });
  const [state, setState] = useState({ status: "idle", msg: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "sending", msg: "" });
    try {
      await apiFetch("/api/contacts", { method: "POST", body: JSON.stringify(form) });
      setState({ status: "done", msg: "Thanks — we'll reach out to you shortly." });
      setForm({ name: "", mobile: "", email: "", message: "" });
    } catch (err) {
      setState({ status: "error", msg: err.message });
    }
  };

  return (
    <div className="panel-card">
      <h3>Contact us</h3>
      <p className="hint">Leave your number and email and we'll get in touch about your visa slot needs.</p>
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input id="c-name" value={form.name} onChange={set("name")} required />
        </div>
        <div className="two-col">
          <div className="field">
            <label htmlFor="c-mobile">Mobile number</label>
            <input id="c-mobile" value={form.mobile} onChange={set("mobile")} required />
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" type="email" value={form.email} onChange={set("email")} required />
          </div>
        </div>
        <div className="field">
          <label htmlFor="c-msg">Message (optional)</label>
          <textarea id="c-msg" rows="3" value={form.message} onChange={set("message")} />
        </div>
        <button type="submit" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Sending…" : "Send"}
        </button>
        {state.msg && (
          <p className={`form-msg ${state.status === "error" ? "err" : "ok"}`}>{state.msg}</p>
        )}
      </form>
    </div>
  );
}
