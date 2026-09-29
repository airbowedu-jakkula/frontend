import { useEffect, useState } from "react";
import { apiFetch, getToken, setToken, clearToken, ApiError } from "../api";
import PostUpdate from "./PostUpdate.jsx";
import ManageUpdates from "./ManageUpdates.jsx";
import ContactsPanel from "./ContactsPanel.jsx";
import FeedbackPanel from "./FeedbackPanel.jsx";
import NewsPanel from "./NewsPanel.jsx";
import MonitoringPanel from "./MonitoringPanel.jsx";
import UsersPanel from "./UsersPanel.jsx";
import EventsPanel from "./EventsPanel.jsx";

const TABS = [
  { id: "monitoring", label: "📡 Live Monitoring & Screenshots" },
  { id: "users", label: "👥 Partner Accounts" },
  { id: "post", label: "📝 Post Update" },
  { id: "updates", label: "🗂️ Manage Updates" },
  { id: "news", label: "📰 News" },
  { id: "contacts", label: "✉️ Contact Requests" },
  { id: "feedback", label: "💬 Feedback" },
];

function LoginForm({ onIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data.user?.role !== "admin") {
        setError("This dashboard is for admins only.");
        return;
      }
      setToken(data.token);
      onIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <form className="admin-login" onSubmit={submit}>
        <h1>Admin sign in</h1>
        <p className="sub">Restricted area.</p>
        <div className="field">
          <label htmlFor="a-email">Email</label>
          <input id="a-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="a-pw">Password</label>
          <input id="a-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="form-msg err">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p style={{ marginTop: 16, fontSize: 13 }}>
          <a href="#/">← Back to site</a>
        </p>
      </form>
    </div>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(Boolean(getToken()));
  const [checking, setChecking] = useState(Boolean(getToken()));
  const [tab, setTab] = useState("monitoring");
  const [adminUser, setAdminUser] = useState(null);

  // Admin Profile Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  useEffect(() => {
    if (!getToken()) {
      setChecking(false);
      return;
    }
    apiFetch("/api/auth/me", { auth: true })
      .then((data) => {
        setAuthed(true);
        if (data && data.user) {
          setAdminUser(data.user);
          setAdminEmail(data.user.email || "");
          setAdminName(data.user.name || "");
        }
      })
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          clearToken();
          setAuthed(false);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  const logout = () => {
    clearToken();
    setAuthed(false);
  };

  const handleUpdateAdminProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");
    try {
      const res = await apiFetch("/api/auth/admin-profile", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          email: adminEmail,
          name: adminName,
          password: adminPass || undefined,
        }),
      });
      setProfileMsg(res.message || "Admin credentials updated.");
      setAdminPass("");
      if (res.user) setAdminUser(res.user);
      setTimeout(() => setShowProfileModal(false), 1200);
    } catch (err) {
      setProfileErr(err.message);
    }
  };

  if (checking) return <div className="admin-login-wrap">Loading…</div>;
  if (!authed) return <LoginForm onIn={() => setAuthed(true)} />;

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <h1>USA Visa Slot Admin</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="ghost sm"
            onClick={() => {
              setProfileMsg("");
              setProfileErr("");
              setAdminPass("");
              setShowProfileModal(true);
            }}
          >
            ⚙️ Admin Credentials
          </button>
          <a className="btn ghost sm" href="#/">View site</a>
          <button className="ghost sm" onClick={logout}>Log out</button>
        </div>
      </div>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "admin-tab on" : "admin-tab"}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-body">
        {tab === "events" && <EventsPanel />}
        {tab === "monitoring" && <MonitoringPanel />}
        {tab === "users" && <UsersPanel />}
        {tab === "post" && <PostUpdate onPosted={() => setTab("updates")} />}
        {tab === "updates" && <ManageUpdates />}
        {tab === "news" && <NewsPanel />}
        {tab === "contacts" && <ContactsPanel />}
        {tab === "feedback" && <FeedbackPanel />}
      </div>

      {/* Admin Credentials Modal */}
      {showProfileModal && (
        <div className="lightbox" onClick={() => setShowProfileModal(false)}>
          <div className="lightbox-content" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Change Admin Credentials</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowProfileModal(false)}
                title="Close"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 16px" }}>
              Update your Admin login email and password.
            </p>
            {profileMsg && <p className="form-msg ok">{profileMsg}</p>}
            {profileErr && <p className="form-msg err">{profileErr}</p>}
            <form onSubmit={handleUpdateAdminProfile}>
              <div className="field">
                <label>Admin Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Admin"
                />
              </div>
              <div className="field">
                <label>Admin Login Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
                <button type="button" className="ghost sm" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
