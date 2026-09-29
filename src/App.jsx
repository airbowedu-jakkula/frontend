import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import UpdatesPage from "./pages/UpdatesPage.jsx";
import GuidePage from "./pages/GuidePage.jsx";
import SocialMediaVettingPage from "./pages/SocialMediaVettingPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import AdminApp from "./admin/AdminApp.jsx";

function currentRoute() {
  return window.location.hash.replace(/^#/, "") || "/";
}

export default function App() {
  const [route, setRoute] = useState(currentRoute());

  useEffect(() => {
    const onHash = () => {
      const next = currentRoute();
      setRoute(next);
      // Scroll to top only on real page changes (hash like "#/feedback"),
      // not on in-page anchors (hash like "#news").
      if (next.startsWith("/")) {
        window.scrollTo(0, 0);
      } else {
        // in-page anchor — allow the target page to render first
        setTimeout(() => {
          const el = document.getElementById(next);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route.startsWith("/admin")) return <AdminApp />;
  if (route.startsWith("/updates") || route.startsWith("/live-updates")) return <UpdatesPage />;
  if (route.startsWith("/guide")) return <GuidePage />;
  if (route.startsWith("/vetting") || route.startsWith("/social-media-vetting"))
    return <SocialMediaVettingPage />;
  if (route.startsWith("/feedback") || route.startsWith("/contact"))
    return <ContactPage initialTab={route.startsWith("/feedback") ? "feedback" : "contact"} />;
  return <Home />;
}
