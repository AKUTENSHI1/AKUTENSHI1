// Channel banner for "Top Five Facts" — 2560×1440 (YouTube's recommended size).
// Phones only show the middle strip (1546×423), so all the text stays inside it.
// The sides are decoration that only shows on TVs and big screens.
import React from "react";
import { AbsoluteFill } from "remotion";
import { MAIN_FONT } from "../fonts";

type Style = "gold" | "night" | "sunset";

const THEMES: Record<Style, { bg: string; deco: string; title: string; five: string; tag: string; tagText: string; sub: string }> = {
  gold: { bg: "linear-gradient(120deg, #f59e0b, #fde047 50%, #f59e0b)", deco: "rgba(17,24,39,0.10)", title: "#111827", five: "#111827", tag: "#111827", tagText: "#facc15", sub: "#1f2937" },
  night: { bg: "linear-gradient(120deg, #020617, #1e3a8a 50%, #020617)", deco: "rgba(250,204,21,0.10)", title: "white", five: "#facc15", tag: "#facc15", tagText: "#111827", sub: "#cbd5e1" },
  sunset: { bg: "linear-gradient(120deg, #431407, #dc2626 45%, #f97316 70%, #431407)", deco: "rgba(255,255,255,0.10)", title: "white", five: "white", tag: "white", tagText: "#b91c1c", sub: "#ffedd5" },
};

// Faint countdown numbers scattered in the background.
const DECO = [
  { n: "5", x: 120, y: 180, s: 520, r: -12 },
  { n: "4", x: 560, y: 960, s: 380, r: 8 },
  { n: "3", x: 1900, y: 120, s: 420, r: 10 },
  { n: "2", x: 2180, y: 760, s: 520, r: -8 },
  { n: "1", x: 1180, y: 1020, s: 360, r: 4 },
  { n: "#", x: 300, y: 1000, s: 300, r: -6 },
  { n: "#", x: 1650, y: 980, s: 260, r: 12 },
];

export const Banner: React.FC<{ variant: Style }> = ({ variant }) => {
  const t = THEMES[variant];
  const font: React.CSSProperties = { fontFamily: MAIN_FONT, fontWeight: 900, lineHeight: 1, textAlign: "center" };
  return (
    <AbsoluteFill style={{ background: t.bg }}>
      {DECO.map((d, i) => (
        <div key={i} style={{ ...font, position: "absolute", left: d.x, top: d.y, fontSize: d.s, color: t.deco, transform: `rotate(${d.r}deg)` }}>
          {d.n}
        </div>
      ))}
      {/* Safe area: the part every device shows */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 1546, height: 423, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <span style={{ ...font, fontSize: 150, color: t.title }}>TOP</span>
            <span style={{ ...font, fontSize: 210, color: t.five, marginTop: -20, textShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>5</span>
            <span
              style={{
                ...font,
                fontSize: 110,
                color: t.tagText,
                background: t.tag,
                borderRadius: 999,
                padding: "6px 50px 22px",
                transform: "rotate(-4deg)",
              }}
            >
              FACTS
            </span>
          </div>
          <div style={{ ...font, fontSize: 54, fontWeight: 700, color: t.sub, marginTop: 34, letterSpacing: 2 }}>
            The world's most amazing countdowns
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
