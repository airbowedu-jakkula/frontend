export default function BrandLogo({ size = 54, showText = true, className = "" }) {
  return (
    <div className={`brand-logo-container ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      {/* Official USA Visa Slots Update Circular Seal Emblem */}
      <img
        src="/brand-logo.png"
        alt="USA Visa Slots Update Official Logo"
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          objectFit: "contain",
          filter: "drop-shadow(0 3px 8px rgba(12, 35, 64, 0.28))",
          borderRadius: "50%",
        }}
      />

      {/* Brand Text */}
      {showText && (
        <span className="brand-text-wrap" style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1.15 }}>
          <span className="brand-name" style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.025em" }}>
            VisaSlot<span style={{ color: "#dc2626" }}>Updates</span>
          </span>
          <span className="brand-tagline" style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            USA Visa Tracker
          </span>
        </span>
      )}
    </div>
  );
}

