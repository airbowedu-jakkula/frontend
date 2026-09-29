import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { formatDateTime } from "../constants";

export default function FeedbackPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/feedback/all", { auth: true });
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

  const patch = async (row, body) => {
    setBusy(row._id);
    try {
      const updated = await apiFetch(`/api/feedback/${row._id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(body),
      });
      setRows((list) => list.map((r) => (r._id === row._id ? { ...r, ...updated } : r)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    setBusy(id);
    try {
      await apiFetch(`/api/feedback/${id}`, { method: "DELETE", auth: true });
      setRows((list) => list.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="admin-card">
      <h2>Feedback ({rows.length})</h2>
      <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: -6 }}>
        New feedback is public by default. Hide anything unwanted, or promote the best ones to
        success stories.
      </p>
      {error && <p className="form-msg err">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : rows.length === 0 ? (
        <p style={{ color: "var(--ink-soft)" }}>No feedback yet.</p>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Message</th>
                <th>State</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>
                    {r.name}
                    {r.email && <div style={{ color: "var(--ink-soft)", fontSize: 12 }}>{r.email}</div>}
                  </td>
                  <td>{r.rating ? "★".repeat(r.rating) : "—"}</td>
                  <td style={{ maxWidth: 280 }}>{r.message}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {r.visible ? <span className="tag ok">Public</span> : <span className="tag">Hidden</span>}
                    {r.isSuccessStory && <div><span className="tag ok" style={{ marginTop: 4 }}>Success story</span></div>}
                  </td>
                  <td>{formatDateTime(r.createdAt)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button className="ghost sm" disabled={busy === r._id} onClick={() => patch(r, { visible: !r.visible })}>
                      {r.visible ? "Hide" : "Show"}
                    </button>{" "}
                    <button className="ghost sm" disabled={busy === r._id} onClick={() => patch(r, { isSuccessStory: !r.isSuccessStory })}>
                      {r.isSuccessStory ? "Unstar" : "Make story"}
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
  );
}
