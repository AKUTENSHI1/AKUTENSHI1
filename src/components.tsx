// Reusable building blocks shared by all the Shorts.
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MAIN_FONT } from "./fonts";

export const textStyle: React.CSSProperties = {
  fontFamily: MAIN_FONT,
  textAlign: "center",
  color: "white",
  lineHeight: 1.2,
};

// Smooth value between two frames, held steady outside that range.
export const ramp = (frame: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(frame, [from, to], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Gradient background whose angle slowly turns.
export const GradientBackground: React.FC<{ colors: string[] }> = ({ colors }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const angle = interpolate(frame, [0, durationInFrames], [135, 255]);
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(${angle}deg, ${colors.join(", ")})` }}
    />
  );
};

// Words pop in one after another.
export const PopWords: React.FC<{
  text: string;
  fontSize: number;
  delay?: number;
  stagger?: number;
  color?: string;
  highlight?: string[]; // words to show in the accent color
  accent?: string;
}> = ({ text, fontSize, delay = 0, stagger = 5, color = "white", highlight = [], accent = "#facc15" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        ...textStyle,
        fontSize,
        fontWeight: 900,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 0.28em",
        padding: "0 70px",
      }}
    >
      {text.split(" ").map((word, i) => {
        const pop = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 12 } });
        const clean = word.replace(/[^\w']/g, "");
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: highlight.includes(clean) ? accent : color,
              opacity: Math.min(1, pop * 1.5),
              transform: `translateY(${(1 - pop) * 60}px) scale(${0.7 + pop * 0.3})`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Small label at the top of the screen (e.g. "FUN FACT").
export const Badge: React.FC<{ label: string; color: string; textColor?: string }> = ({
  label,
  color,
  textColor = "white",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 260,
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          ...textStyle,
          fontSize: 54,
          fontWeight: 900,
          letterSpacing: 6,
          color: textColor,
          background: color,
          borderRadius: 999,
          padding: "6px 44px 14px",
          transform: `scale(${s})`,
        }}
      >
        {label}
      </div>
    </div>
  );
};
