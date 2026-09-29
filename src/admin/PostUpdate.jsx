import { useState } from "react";
import { apiFetch } from "../api";
import { CATEGORY_GROUPS } from "../constants";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PostUpdate({ onPosted }) {
  const [form, setForm] = useState({
    category: CATEGORY_GROUPS[0],
    location: "",
    date: "",
    count: "",
    note: "",
  });
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [state, setState] = useState({ status: "idle", msg: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setState({ status: "error", msg: "Image is over 8 MB — please use a smaller one." });
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setScreenshot(dataUrl);
    setPreview(dataUrl);
  };

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "sending", msg: "" });
    try {
      await apiFetch("/api/updates", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ ...form, screenshot }),
      });
      setState({ status: "done", msg: "Posted." });
      setForm({ category: form.category, location: "", date: "", count: "", note: "" });
      setScreenshot(null);
      setPreview(null);
      if (onPosted) setTimeout(onPosted, 500);
    } catch (err) {
      setState({ status: "error", msg: err.message });
    }
  };

  return (
    <div className="admin-card">
      <h2>Post a slot update</h2>
      <form onSubmit={submit}>
        <div className="two-col">
          <div className="field">
            <label htmlFor="u-cat">Category</label>
            <select id="u-cat" value={form.category} onChange={set("category")}>
              {CATEGORY_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="u-loc">Location / consulate</label>
            <input id="u-loc" value={form.location} onChange={set("location")} placeholder="e.g. Chennai" />
          </div>
        </div>
        <div className="two-col">
          <div className="field">
            <label htmlFor="u-date">Date(s) opening</label>
            <input id="u-date" value={form.date} onChange={set("date")} placeholder="e.g. 12–15 Sep 2026" />
          </div>
          <div className="field">
            <label htmlFor="u-count">Number of slots</label>
            <input id="u-count" value={form.count} onChange={set("count")} placeholder="e.g. 5" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="u-note">Note (optional)</label>
          <textarea id="u-note" rows="2" value={form.note} onChange={set("note")} />
        </div>
        <div className="field">
          <label htmlFor="u-file">Screenshot (optional — also sent to Telegram)</label>
          <input id="u-file" type="file" accept="image/*" onChange={onFile} />
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{ marginTop: 10, maxHeight: 180, borderRadius: 8, border: "1px solid var(--line)" }}
            />
          )}
        </div>
        <button type="submit" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Posting…" : "Post update"}
        </button>
        {state.msg && (
          <p className={`form-msg ${state.status === "error" ? "err" : "ok"}`}>{state.msg}</p>
        )}
      </form>
    </div>
  );
}
