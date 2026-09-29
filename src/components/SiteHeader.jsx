import { useState, useEffect } from "react";
import BrandLogo from "./BrandLogo.jsx";

function currentRoute() {
  return window.location.hash.replace(/^#/, "") || "/";
}

export default function SiteHeader() {
  const [route, setRoute] = useState(currentRoute());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onHash = () => setRoute(currentRoute());
    window.addEventListener("hashchange", onHash);

    // Auto-detect and sync system dark / light preference
    if (window.matchMedia) {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = (e) => {
        document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
      };
      // Set initial
      document.documentElement.setAttribute("data-theme", mql.matches ? "dark" : "light");
      mql.addEventListener("change", onChange);
      return () => {
        window.removeEventListener("hashchange", onHash);
        mql.removeEventListener("change", onChange);
      };
    }

    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const is = (r) => (route === r || (r === "/" && route === "/") ? "on" : "");

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="container inner">
          <a className="brand" href="#/">
            <BrandLogo size={56} showText={false} />
            <span className="brand-title">
              VisaSlot<span style={{ color: "#dc2626" }}>Updates</span>
            </span>
          </a>

          <nav className="site-nav">
            <a href="#/" className={is("/")}>Home</a>
            <a href="#/guide" className={is("/guide")}>Process Guide</a>
            <a href="#/updates" className={is("/updates")}>Live Slot Updates</a>
            <a href="#/social-media-vetting" className={is("/social-media-vetting")}>Social Media Vetting</a>
            <a className={`btn sm ${route.startsWith("/contact") || route.startsWith("/feedback") ? "active-nav-btn" : ""}`} href="#/contact">
              📩 Contact &amp; Feedback
            </a>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer-overlay ${mobileOpen ? "open" : ""}`}
        onClick={closeMobile}
      />
      <div className={`mobile-drawer ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-drawer-head">
          <div className="brand" style={{ fontSize: 18 }}>
            <BrandLogo size={44} showText={false} />
            <span>VisaSlot<span style={{ color: "#dc2626" }}>Updates</span></span>
          </div>
          <button
            onClick={closeMobile}
            style={{ background: "transparent", border: "none", fontSize: 22, cursor: "pointer", color: "var(--ink)" }}
          >
            ✕
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          <a href="#/" className={is("/")} onClick={closeMobile}>🏠 Home</a>
          <a href="#/guide" className={is("/guide")} onClick={closeMobile}>📋 Process Guide</a>
          <a href="#/updates" className={is("/updates")} onClick={closeMobile}>⚡ Live Slot Updates</a>
          <a href="#/social-media-vetting" className={is("/social-media-vetting")} onClick={closeMobile}>🛡️ Social Media Vetting</a>
          <a href="#/contact" className={`btn ${route.startsWith("/contact") || route.startsWith("/feedback") ? "on" : ""}`} onClick={closeMobile} style={{ marginTop: 8 }}>
            📩 Contact &amp; Feedback
          </a>
        </nav>
      </div>
    </>
  );
}
