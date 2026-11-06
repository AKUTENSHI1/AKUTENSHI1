// A 10-second test Short with animated text.
// Change the words in TEXT below to make your own version.
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MAIN_FONT } from "./fonts";

const TEXT = {
  title: "Hello World",
  subtitle: "My first video made with Remotion",
  line1: "Short.",
  line2: "Animated.",
  cta: "Subscribe",
};

// Shared text style.
const textStyle: React.CSSProperties = {
  fontFamily: MAIN_FONT,
  textAlign: "center",
  color: "white",
  lineHeight: 1.4,
};

// Background with slowly moving gradient colors.
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const angle = interpolate(frame, [0, 300], [135, 315]);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, #1e3a8a, #7c3aed, #db2777)`,
      }}
    />
  );
};

// Words pop in one after another.
const WordByWord: React.FC<{ text: string; fontSize: number }> = ({
  text,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        ...textStyle,
        fontSize,
        fontWeight: 900,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 0.3em",
        padding: "0 60px",
      }}
    >
      {words.map((word, i) => {
        const pop = spring({ frame: frame - i * 6, fps, config: { damping: 12 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: pop,
              transform: `translateY(${(1 - pop) * 80}px) scale(${0.6 + pop * 0.4})`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Scene 1 (0–3.5 s): big title + subtitle.
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [90, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleIn = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}
    >
      <WordByWord text={TEXT.title} fontSize={150} />
      <div
        style={{
          ...textStyle,
          fontSize: 60,
          fontWeight: 700,
          marginTop: 40,
          padding: "0 80px",
          opacity: subtitleIn,
          transform: `translateY(${(1 - subtitleIn) * 30}px)`,
        }}
      >
        {TEXT.subtitle}
      </div>
    </AbsoluteFill>
  );
};

// Scene 2 (3.5–7 s): two lines sliding in from the left.
const SceneLines: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeOut = interpolate(frame, [90, 105], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lines = [TEXT.line1, TEXT.line2];
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", opacity: fadeOut }}
    >
      {lines.map((line, i) => {
        const slide = spring({ frame: frame - i * 12, fps, config: { damping: 14 } });
        return (
          <div
            key={i}
            style={{
              ...textStyle,
              fontSize: 170,
              fontWeight: 900,
              opacity: slide,
              transform: `translateX(${(1 - slide) * -700}px)`,
              textShadow: "0 10px 40px rgba(0,0,0,0.35)",
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Scene 3 (7–10 s): pulsing "subscribe" button + a progress bar filling up.
const SceneCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 10 } });
  const pulse = 1 + Math.sin(frame / 5) * 0.04;
  const progress = interpolate(frame, [0, 85], [0, 100], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          ...textStyle,
          fontSize: 110,
          fontWeight: 900,
          background: "#ef4444",
          borderRadius: 40,
          padding: "20px 90px 40px",
          transform: `scale(${enter * pulse})`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {TEXT.cta}
      </div>
      <div
        style={{
          marginTop: 120,
          width: 700,
          height: 24,
          borderRadius: 12,
          background: "rgba(255,255,255,0.25)",
          overflow: "hidden",
          opacity: enter,
        }}
      >
        <div style={{ width: `${progress}%`, height: "100%", background: "white" }} />
      </div>
    </AbsoluteFill>
  );
};

export const HelloShort: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={105}>
        <SceneTitle />
      </Sequence>
      <Sequence from={105} durationInFrames={105}>
        <SceneLines />
      </Sequence>
      <Sequence from={210}>
        <SceneCta />
      </Sequence>
    </AbsoluteFill>
  );
};
