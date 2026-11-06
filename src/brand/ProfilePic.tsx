// Channel profile picture for "Top Five Facts".
// YouTube shows it as a circle, so everything important stays inside the middle.
import React from "react";
import { AbsoluteFill } from "remotion";
import { MAIN_FONT } from "../fonts";

type Style = "gold" | "night" | "sunset";

const THEMES: Record<Style, { bg: string; ring: string; five: string; text: string; badge: string; badgeText: string }> = {
  gold: { bg: "radial-gradient(circle at 50% 40%, #fde047, #f59e0b 75%)", ring: "#111827", five: "#111827", text: "#111827", badge: "#111827", badgeText: "#facc15" },
  night: { bg: "radial-gradient(circle at 50% 35%, #1e3a8a, #020617 75%)", ring: "#facc15", five: "#facc15", text: "white", badge: "#facc15", badgeText: "#111827" },
  sunset: { bg: "linear-gradient(160deg, #f97316, #b91c1c 60%, #431407)", ring: "white", five: "white", text: "white", badge: "white", badgeText: "#b91c1c" },
};

export const ProfilePic: React.FC<{ variant: Style }> = ({ variant }) => {
  const t = THEMES[variant];
  const font: React.CSSProperties = { fontFamily: MAIN_FONT, fontWeight: 900, textAlign: "center", lineHeight: 1 };
  return (
    <AbsoluteFill style={{ background: t.bg, justifyContent: "center", alignItems: "center" }}>
      {/* ring that sits just inside YouTube's circle crop */}
      <div style={{ position: "absolute", inset: 46, borderRadius: "50%", border: `14px solid ${t.ring}`, opacity: 0.9 }} />
      <div style={{ ...font, color: t.text, fontSize: 108, letterSpacing: 10, marginBottom: -30, marginLeft: 10 }}>TOP</div>
      <div style={{ ...font, color: t.five, fontSize: 400, textShadow: "0 18px 40px rgba(0,0,0,0.35)" }}>5</div>
      <div
        style={{
          ...font,
          color: t.badgeText,
          background: t.badge,
          fontSize: 86,
          letterSpacing: 6,
          borderRadius: 999,
          padding: "4px 44px 18px",
          marginTop: -10,
          transform: "rotate(-4deg)",
        }}
      >
        FACTS
      </div>
    </AbsoluteFill>
  );
};
