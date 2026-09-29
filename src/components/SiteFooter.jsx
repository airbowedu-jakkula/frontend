export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container inner">
        <span>© {new Date().getFullYear()} VisaSlot Updates. Slot information is shared for guidance only.</span>
        <span style={{ display: "flex", gap: 16 }}>
          <a href="#/feedback">Feedback</a>
          <a href="#/contact">Contact us</a>
          <a href="#/admin">Admin</a>
        </span>
      </div>
    </footer>
  );
}
