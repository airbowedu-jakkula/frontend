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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>Contact &amp; Schedule Call Requests ({rows.length})</h2>
        <button className="ghost sm" onClick={load} disabled={loading}>
          {loading ? "Refreshing…" : "🔄 Refresh"}
        </button>
      </div>

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
                <th>Type</th>
                <th>Client Name</th>
                <th>Mobile Number</th>
                <th>Category</th>
                <th>Preferred Time</th>
                <th>Target City / Notes</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isScheduleCall = r.type === "schedule-call";
                return (
                  <tr key={r._id} style={r.handled ? { opacity: 0.55 } : undefined}>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          background: isScheduleCall ? "rgba(178, 34, 52, 0.12)" : "rgba(12, 35, 64, 0.08)",
                          color: isScheduleCall ? "#b22234" : "var(--usa-blue-bright)",
                        }}
                      >
                        {isScheduleCall ? "📅 Schedule Call" : "✉️ General Contact"}
                      </span>
                    </td>
                    <td>
                      <strong>{r.name}</strong>
                      {r.email && <div style={{ fontSize: 11.5, color: "var(--ink-muted)" }}>{r.email}</div>}
                    </td>
                    <td>
                      <a href={`tel:${r.mobile}`} style={{ fontWeight: 700, color: "var(--ink)" }}>
                        {r.mobile}
                      </a>
                    </td>
                    <td>
                      <span className="badge" style={{ fontSize: 11 }}>
                        {r.category || "General"}
                      </span>
                    </td>
                    <td style={{ color: "#b22234", fontWeight: 600 }}>{r.preferredTime || "Anytime"}</td>
                    <td style={{ maxWidth: 240, fontSize: 12.5 }}>
                      {r.targetCity && r.targetCity !== "Any Center" && (
                        <div style={{ fontWeight: 600, color: "var(--ink-soft)" }}>📍 {r.targetCity}</div>
                      )}
                      <div>{r.message || "—"}</div>
                    </td>
                    <td style={{ fontSize: 11.5, whiteSpace: "nowrap" }}>{formatDateTime(r.createdAt)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button className="ghost sm" disabled={busy === r._id} onClick={() => toggle(r)}>
                        {r.handled ? "Reopen" : "Mark done"}
                      </button>{" "}
                      <button className="danger sm" disabled={busy === r._id} onClick={() => remove(r._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
