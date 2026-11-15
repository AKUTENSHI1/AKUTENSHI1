// Vertical Shorts thumbnail (1080x1920): big photo, bold outlined text, channel badge.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { MAIN_FONT } from "../fonts";

export type ThumbProps = {
  image: string;
  top: string; // small line above (e.g. "TOP 5")
  title: string; // big words
  punch: string; // accent line
  accent: string;
  zoom?: number;
  focusX?: number; // 0..100, which part of the photo to center
  focusY?: number;
  textTop?: number; // where the title block starts (px from top)
  hostImage?: string; // optional host photo, shown as a framed card
  hostName?: string;
};

const outline = (size: number, color: string): React.CSSProperties => ({
  fontFamily: MAIN_FONT,
  fontWeight: 900,
  fontSize: size,
  lineHeight: 1,
  color,
  textAlign: "center",
  WebkitTextStroke: `${Math.round(size / 18)}px #000`,
  paintOrder: "stroke fill",
  textShadow: "0 10px 40px rgba(0,0,0,0.8)",
});

export const Thumbnail: React.FC<ThumbProps> = ({ image, top, title, punch, accent, zoom = 1.3, focusX = 50, focusY = 50, textTop = 150, hostImage, hostName }) => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <Img
      src={staticFile(image)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: `${focusX}% ${focusY}%`,
        transform: `scale(${zoom})`,
        filter: "saturate(1.25) contrast(1.1)",
      }}
    />
    {/* darken top and bottom for text */}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.85) 100%)",
      }}
    />
    {/* red danger glow around the edges */}
    <AbsoluteFill style={{ boxShadow: `inset 0 0 220px ${accent}` , opacity: 0.55 }} />
    {hostImage ? (
      <div style={{ position: "absolute", right: 40, top: 230, width: 470, transform: "rotate(3deg)" }}>
        <Img
          src={staticFile(hostImage)}
          style={{ width: 470, height: 620, objectFit: "cover", objectPosition: "50% 30%", borderRadius: 28, border: "8px solid white", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
        />
        {hostName ? (
          <div style={{ position: "absolute", left: 24, bottom: 20, fontFamily: MAIN_FONT, fontWeight: 900, fontSize: 64, color: "#111", background: "#facc15", borderRadius: 16, padding: "0 22px 8px" }}>
            {hostName} 👋
          </div>
        ) : null}
      </div>
    ) : null}
    <AbsoluteFill style={{ alignItems: "center", paddingTop: textTop }}>
      <div
        style={{
          fontFamily: MAIN_FONT,
          fontWeight: 900,
          fontSize: 100,
          color: "#111",
          background: "#facc15",
          borderRadius: 24,
          padding: "0 40px 14px",
          transform: "rotate(-4deg)",
        }}
      >
        {top}
      </div>
      <div style={{ ...outline(170, "white"), marginTop: 30, padding: "0 40px" }}>{title}</div>
    </AbsoluteFill>
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 170 }}>
      <div style={{ ...outline(150, accent), padding: "0 40px", transform: "rotate(-2deg)" }}>{punch}</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
