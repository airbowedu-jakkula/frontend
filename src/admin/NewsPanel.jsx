import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { NEWS_CATEGORIES, formatDate } from "../constants";

const EMPTY = { title: "", summary: "", body: "", url: "", source: "", category: "General" };

export default function NewsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState({ status: "idle", msg: "" });
  const [busy, setBusy] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/news/all", { auth: true });
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "sending", msg: "" });
    try {
      await apiFetch("/api/news", { method: "POST", auth: true, body: JSON.stringify(form) });
      setState({ status: "done", msg: "Published." });
      setForm(EMPTY);
      load();
    } catch (err) {
      setState({ status: "error", msg: err.message });
    }
  };

  const toggle = async (row) => {
    setBusy(row._id);
    try {
      const updated = await apiFetch(`/api/news/${row._id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ visible: !row.visible }),
      });
      setRows((list) => list.map((r) => (r._id === row._id ? { ...r, ...updated } : r)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this news item?")) return;
    setBusy(id);
    try {
      await apiFetch(`/api/news/${id}`, { method: "DELETE", auth: true });
      setRows((list) => list.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="admin-card">
        <h2>Post news / information</h2>
        <form onSubmit={submit}>
          <div className="two-col">
            <div className="field">
              <label htmlFor="n-title">Headline</label>
              <input id="n-title" value={form.title} onChange={set("title")} required />
            </div>
            <div className="field">
              <label htmlFor="n-cat">Category</label>
              <select id="n-cat" value={form.category} onChange={set("category")}>
                {NEWS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="n-sum">Summary (1–3 sentences, shown on the card)</label>
            <textarea id="n-sum" rows="2" value={form.summary} onChange={set("summary")} required />
          </div>
          <div className="field">
            <label htmlFor="n-body">More detail (optional)</label>
            <textarea id="n-body" rows="3" value={form.body} onChange={set("body")} />
          </div>
          <div className="two-col">
            <div className="field">
              <label htmlFor="n-url">Source link (optional)</label>
              <input id="n-url" type="url" value={form.url} onChange={set("url")} placeholder="https://travel.state.gov/..." />
            </div>
            <div className="field">
              <label htmlFor="n-src">Source name (optional)</label>
              <input id="n-src" value={form.source} onChange={set("source")} placeholder="travel.state.gov" />
            </div>
          </div>
          <button type="submit" disabled={state.status === "sending"}>
            {state.status === "sending" ? "Publishing…" : "Publish news"}
          </button>
          {state.msg && (
            <p className={`form-msg ${state.status === "error" ? "err" : "ok"}`}>{state.msg}</p>
          )}
        </form>
      </div>

      <div className="admin-card">
        <h2>Published news ({rows.length})</h2>
        {error && <p className="form-msg err">{error}</p>}
        {loading ? (
          <p>Loading…</p>
        ) : rows.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>No news yet.</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Headline</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>State</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id}>
                    <td style={{ maxWidth: 320 }}>
                      <strong>{r.title}</strong>
                      <div style={{ color: "var(--ink-soft)", fontSize: 12 }}>{r.summary}</div>
                    </td>
                    <td><span className="tag">{r.category}</span></td>
                    <td>{formatDate(r.publishedAt)}</td>
                    <td>{r.visible ? <span className="tag ok">Public</span> : <span className="tag">Hidden</span>}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="ghost sm" disabled={busy === r._id} onClick={() => toggle(r)}>
                        {r.visible ? "Hide" : "Show"}
                      </button>{" "}
                      <button className="danger sm" disabled={busy === r._id} onClick={() => remove(r._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
