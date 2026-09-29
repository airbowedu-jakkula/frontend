import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { formatDate } from "../constants";

const STATUS = {
  pending: { cls: "tag warn", label: "Pending Verification" },
  approved: { cls: "tag ok", label: "Approved" },
  rejected: { cls: "tag", label: "Rejected" },
};

function timeAgo(date) {
  if (!date) return "Never";
  const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

export default function UsersPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  // Add Partner Form
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPass, setAddPass] = useState("");
  const [addNote, setAddNote] = useState("");
  const [addAutoApprove, setAddAutoApprove] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/users", { auth: true });
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

  const act = async (id, path, method = "POST", body = null) => {
    setBusy(id);
    setMsg("");
    setError("");
    try {
      const res = await apiFetch(`/api/users/${id}${path}`, {
        method,
        auth: true,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (res && res.message) setMsg(res.message);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const handleCreatePartner = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      const res = await apiFetch("/api/users/partner", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          name: addName,
          email: addEmail,
          password: addPass,
          note: addNote,
          autoApprove: addAutoApprove,
        }),
      });
      setMsg(res.message || "Partner created successfully.");
      setShowAddModal(false);
      setAddName("");
      setAddEmail("");
      setAddPass("");
      setAddNote("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetUser || !newPassword) return;
    try {
      const res = await apiFetch(`/api/users/${resetUser._id}/reset-password`, {
        method: "PUT",
        auth: true,
        body: JSON.stringify({ password: newPassword }),
      });
      setMsg(res.message || "Password reset successfully.");
      setResetUser(null);
      setNewPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  const pending = rows.filter((r) => r.status === "pending");
  const approved = rows.filter((r) => r.status === "approved");
  const rejected = rows.filter((r) => r.status === "rejected");

  return (
    <>
      {/* Top Header Card */}
      <div className="admin-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: "0 0 4px" }}>Partner &amp; Extension User Management</h2>
          <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 13 }}>
            Verify partner registrations, manage extension monitoring credentials, and reset passwords.
          </p>
        </div>
        <button className="btn sm" onClick={() => setShowAddModal(true)}>
          ➕ Create New Partner
        </button>
      </div>

      {msg && <p className="form-msg ok" style={{ marginBottom: 12 }}>{msg}</p>}
      {error && <p className="form-msg err" style={{ marginBottom: 12 }}>{error}</p>}

      {/* 1. Pending Verification Section */}
      <div className="admin-card">
        <h2 style={{ color: "#b45309", display: "flex", alignItems: "center", gap: 8 }}>
          <span>⏳ Pending Partner Verifications ({pending.length})</span>
        </h2>
        <p style={{ color: "var(--ink-soft)", fontSize: 13, marginTop: -8 }}>
          Only verified partners can log into the extension and submit screenshot captures.
        </p>
        {loading ? (
          <p>Loading…</p>
        ) : pending.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>✅ No partner accounts waiting for verification.</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Partner Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Note / Center</th>
                  <th>Requested On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((u) => (
                  <tr key={u._id} style={{ background: "rgba(245, 158, 11, 0.05)" }}>
                    <td><strong>{u.name || "—"}</strong></td>
                    <td>{u.email}</td>
                    <td><span className="tag" style={{ textTransform: "capitalize" }}>{u.role || "partner"}</span></td>
                    <td style={{ fontSize: 12, color: "var(--ink-soft)" }}>{u.partnerNote || "—"}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        className="btn sm"
                        style={{ marginRight: 6, background: "#059669", color: "#fff", border: "none" }}
                        disabled={busy === u._id}
                        onClick={() => act(u._id, "/approve")}
                      >
                        ✓ Verify &amp; Approve
                      </button>
                      <button
                        className="danger sm"
                        disabled={busy === u._id}
                        onClick={() => act(u._id, "/reject")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Active Verified Partners */}
      <div className="admin-card">
        <h2>Active Verified Accounts ({approved.length})</h2>
        {loading ? (
          <p>Loading…</p>
        ) : approved.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>None.</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Active</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong>{u.name || "—"}</strong>
                      {u.role === "admin" && <span style={{ marginLeft: 6, fontSize: 11 }}>👑</span>}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={u.role === "admin" ? "tag" : "tag ok"} style={{ textTransform: "capitalize" }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>{timeAgo(u.lastActiveAt)}</td>
                    <td style={{ fontSize: 12, color: "var(--ink-soft)" }}>{u.partnerNote || "—"}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {u.role !== "admin" && (
                        <>
                          <button
                            className="ghost sm"
                            style={{ marginRight: 4 }}
                            onClick={() => { setResetUser(u); setNewPassword(""); }}
                          >
                            🔑 Reset Password
                          </button>
                          <button
                            className="ghost sm"
                            style={{ marginRight: 4 }}
                            disabled={busy === u._id}
                            onClick={() => act(u._id, "/reject")}
                          >
                            Revoke
                          </button>
                          <button
                            className="danger sm"
                            disabled={busy === u._id}
                            onClick={() => act(u._id, "", "DELETE")}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Rejected / Inactive Accounts */}
      {rejected.length > 0 && (
        <div className="admin-card">
          <h2>Revoked / Rejected Accounts ({rejected.length})</h2>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rejected.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name || "—"}</td>
                    <td>{u.email}</td>
                    <td><span className="tag">{u.status}</span></td>
                    <td>
                      <button
                        className="ghost sm"
                        style={{ marginRight: 4 }}
                        disabled={busy === u._id}
                        onClick={() => act(u._id, "/approve")}
                      >
                        Re-Approve
                      </button>
                      <button
                        className="danger sm"
                        disabled={busy === u._id}
                        onClick={() => act(u._id, "", "DELETE")}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Partner Modal */}
      {showAddModal && (
        <div className="lightbox" onClick={() => setShowAddModal(false)}>
          <div className="lightbox-content" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Create Partner Account</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
                title="Close"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePartner}>
              <div className="field">
                <label>Partner Name</label>
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. John Doe / Team Delhi"
                  required
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="partner@example.com"
                  required
                />
              </div>
              <div className="field">
                <label>Password (6+ chars)</label>
                <input
                  type="password"
                  value={addPass}
                  onChange={(e) => setAddPass(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="field">
                <label>Internal Note / Assigned Centers</label>
                <input
                  type="text"
                  value={addNote}
                  onChange={(e) => setAddNote(e.target.value)}
                  placeholder="e.g. Delhi & Chennai OFC"
                />
              </div>
              <div className="field" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <input
                  type="checkbox"
                  id="autoApprove"
                  checked={addAutoApprove}
                  onChange={(e) => setAddAutoApprove(e.target.checked)}
                />
                <label htmlFor="autoApprove" style={{ margin: 0, fontSize: 13, cursor: "pointer" }}>
                  Verify &amp; Activate Immediately
                </label>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
                <button type="button" className="ghost sm" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn sm">
                  Create Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetUser && (
        <div className="lightbox" onClick={() => setResetUser(null)}>
          <div className="lightbox-content" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Reset Password</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setResetUser(null)}
                title="Close"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 16px" }}>
              Set a new password for <strong>{resetUser.name || resetUser.email}</strong>.
            </p>
            <form onSubmit={handleResetPassword}>
              <div className="field">
                <label>New Password (6+ chars)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
                <button type="button" className="ghost sm" onClick={() => setResetUser(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn sm">
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
