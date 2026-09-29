import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { formatDateTime } from "../constants";

export default function ContactsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/contacts", { auth: true });
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

  const toggle = async (row) => {
    setBusy(row._id);
    try {
      await apiFetch(`/api/contacts/${row._id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ handled: !row.handled }),
      });
      setRows((list) => list.map((r) => (r._id === row._id ? { ...r, handled: !r.handled } : r)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this contact request?")) return;
    setBusy(id);
    try {
      await apiFetch(`/api/contacts/${id}`, { method: "DELETE", auth: true });
      setRows((list) => list.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="admin-card">
      <h2>Contact requests ({rows.length})</h2>
      {error && <p className="form-msg err">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : rows.length === 0 ? (
        <p style={{ color: "var(--ink-soft)" }}>No requests yet.</p>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Message</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} style={r.handled ? { opacity: 0.55 } : undefined}>
                  <td>{r.name}</td>
                  <td>{r.mobile}</td>
                  <td>{r.email}</td>
                  <td style={{ maxWidth: 260 }}>{r.message || "—"}</td>
                  <td>{formatDateTime(r.createdAt)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button className="ghost sm" disabled={busy === r._id} onClick={() => toggle(r)}>
                      {r.handled ? "Reopen" : "Mark done"}
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
