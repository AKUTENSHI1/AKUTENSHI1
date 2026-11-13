// Style 2.0 — a faster Top 5 (16 s) built from what works on Shorts:
// instant hook with fast cuts, quick reveals, a "Guess #1?" pause,
// a big #1 reveal with a comment prompt, and an ending that loops into the start.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ramp, textStyle } from "../../components";
import { CardImage, PanImage, Shade } from "../Top5Video";
import type { Top5Data } from "../data";

// Timing (frames at 30 fps). tools/make_music_v2.py uses the same numbers.
export const V2 = { HOOK: 45, ITEM: 75, GUESS: 30, FINAL: 90, TAIL: 15, SWIPE: 8 };
export const v2Duration = (d: Top5Data) =>
  V2.HOOK + (d.items.length - 1) * V2.ITEM + V2.GUESS + V2.FINAL + V2.TAIL;

export type V2Extras = {
  accent?: string; // highlight color (default gold)
  guessText?: string; // shown during the pause before #1
  commentText?: string; // shown at the end of #1
};

const Photo: React.FC<{ d: Top5Data; i: number; duration: number }> = ({ d, i, duration }) => {
  const it = d.items[i];
  return it.fit === "card" ? (
    <CardImage src={it.image} aspect={it.aspect} duration={duration} />
  ) : (
    <PanImage src={it.image} aspect={it.aspect} duration={duration} direction={i % 2 ? -1 : 1} pan={it.pan ?? d.pan} />
  );
};

// Big outlined text that stays readable on any photo.
const big = (size: number, color = "white"): React.CSSProperties => ({
  ...textStyle,
  fontSize: size,
  fontWeight: 900,
  color,
  lineHeight: 1.05,
  WebkitTextStroke: `${Math.round(size / 40)}px rgba(0,0,0,0.85)`,
  paintOrder: "stroke fill",
  textShadow: "0 8px 30px rgba(0,0,0,0.7)",
});

// ---------- 1. Hook: title from frame 0 over fast cuts of all photos ----------
const Hook: React.FC<{ d: Top5Data & V2Extras }> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cut = 9;
  const idx = Math.min(d.items.length - 1, Math.floor(frame / cut));
  const isLast = idx === d.items.length - 1; // the #1 photo is shown blurred: no spoilers
  const local = frame - idx * cut;
  const accent = d.accent ?? "#facc15";
  const tease = spring({ frame: frame - 14, fps, config: { damping: 9 } });
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ filter: isLast ? "blur(30px)" : undefined, transform: `scale(${1.15 - local * 0.01})` }}>
        <Img src={staticFile(d.items[idx].image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.45)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 50px" }}>
        <div
          style={{
            ...textStyle,
            fontSize: 96,
            fontWeight: 900,
            color: "#111",
            background: accent,
            borderRadius: 22,
            padding: "0 36px 12px",
            transform: `rotate(-3deg) scale(${1 + Math.sin(frame / 3) * 0.03})`,
          }}
        >
          {d.hookTop}
        </div>
        <div style={{ ...big(128), marginTop: 26 }}>{d.hookTitle}</div>
        <div style={{ ...big(62, accent), marginTop: 30, transform: `scale(${tease})` }}>{d.hookTease}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- 2. Items #5 … #2 ----------
const Dots: React.FC<{ d: Top5Data & V2Extras; active: number; unknownFirst?: boolean }> = ({ d, active, unknownFirst }) => {
  const accent = d.accent ?? "#facc15";
  return (
    <div style={{ position: "absolute", top: 210, width: "100%", display: "flex", justifyContent: "center", gap: 18 }}>
      {d.items.map((_, i) => {
        const rank = d.items.length - i;
        const on = i === active;
        return (
          <div
            key={i}
            style={{
              ...textStyle,
              fontSize: 40,
              fontWeight: 900,
              width: 78,
              height: 78,
              lineHeight: "70px",
              borderRadius: 39,
              color: on ? "#111" : "white",
              background: on ? accent : "rgba(0,0,0,0.45)",
              border: "3px solid rgba(255,255,255,0.7)",
              opacity: i <= active ? 1 : 0.5,
            }}
          >
            {rank === 1 && unknownFirst ? "?" : rank}
          </div>
        );
      })}
    </div>
  );
};

const Item: React.FC<{ d: Top5Data & V2Extras; i: number }> = ({ d, i }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const it = d.items[i];
  const rank = d.items.length - i;
  const enter = interpolate(frame, [0, V2.SWIPE], [width, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const num = spring({ frame: frame - 2, fps, config: { damping: 8, mass: 0.6 } });
  const name = spring({ frame: frame - 7, fps, config: { damping: 13 } });
  const detail = spring({ frame: frame - 13, fps, config: { damping: 11 } });
  return (
    <AbsoluteFill style={{ transform: `translateX(${enter}px)` }}>
      <Photo d={d} i={i} duration={V2.ITEM + V2.SWIPE} />
      <Shade />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 330 }}>
        <div style={{ ...big(260), transform: `scale(${num})` }}>#{rank}</div>
        <div style={{ ...big(it.name.length > 12 ? 100 : 124), opacity: name, transform: `translateY(${(1 - name) * 60}px)` }}>
          {it.name}
        </div>
        <div
          style={{
            ...textStyle,
            fontSize: 64,
            fontWeight: 800,
            color: "#111",
            background: "white",
            borderRadius: 999,
            padding: "0 36px 10px",
            marginTop: 16,
            transform: `scale(${detail})`,
          }}
        >
          {it.detail}
        </div>
      </AbsoluteFill>
      <Dots d={d} active={i} unknownFirst />
      <AbsoluteFill style={{ background: "white", opacity: ramp(frame, 0, 5, 0.6, 0) }} />
    </AbsoluteFill>
  );
};

// ---------- 3. "Guess #1?" pause ----------
const Guess: React.FC<{ d: Top5Data & V2Extras }> = ({ d }) => {
  const frame = useCurrentFrame();
  const last = d.items.length - 1;
  const shake = Math.sin(frame * 2.2) * 6;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "blur(38px) brightness(0.5)", transform: "scale(1.2)" }}>
        <Photo d={d} i={last} duration={V2.GUESS} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translateX(${shake}px)` }}>
        <div style={{ fontSize: 260, lineHeight: 1 }}>🤔</div>
        <div style={{ ...big(120), marginTop: 20 }}>Guess #1?</div>
        {d.guessText ? <div style={{ ...big(60, d.accent ?? "#facc15"), marginTop: 24, padding: "0 60px" }}>{d.guessText}</div> : null}
      </AbsoluteFill>
      <Dots d={d} active={last} unknownFirst />
    </AbsoluteFill>
  );
};

// ---------- 4. #1 reveal ----------
const Final: React.FC<{ d: Top5Data & V2Extras }> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const last = d.items.length - 1;
  const it = d.items[last];
  const accent = d.accent ?? "#facc15";
  const num = spring({ frame, fps, config: { damping: 7, mass: 0.7 } });
  const name = spring({ frame: frame - 6, fps, config: { damping: 12 } });
  const detail = spring({ frame: frame - 12, fps, config: { damping: 10 } });
  const comment = spring({ frame: frame - 45, fps, config: { damping: 10 } });
  const shake = frame < 10 ? Math.sin(frame * 3) * (10 - frame) * 2 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${-shake / 2}px)` }}>
      <Photo d={d} i={last} duration={V2.FINAL + V2.TAIL} />
      <Shade />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 330 }}>
        <div style={{ ...big(300, accent), transform: `scale(${num}) rotate(${(1 - num) * -10}deg)` }}>#1</div>
        <div style={{ ...big(it.name.length > 12 ? 104 : 130), opacity: name, transform: `scale(${0.7 + name * 0.3})` }}>{it.name}</div>
        <div
          style={{
            ...textStyle,
            fontSize: 68,
            fontWeight: 800,
            color: "#111",
            background: accent,
            borderRadius: 999,
            padding: "0 40px 10px",
            marginTop: 16,
            transform: `scale(${detail})`,
          }}
        >
          {it.detail}
        </div>
      </AbsoluteFill>
      <Dots d={d} active={last} />
      {/* comment prompt */}
      <div style={{ position: "absolute", top: 330, width: "100%", display: "flex", justifyContent: "center" }}>
        <div
          style={{
            ...textStyle,
            fontSize: 54,
            fontWeight: 800,
            color: "white",
            background: "rgba(0,0,0,0.65)",
            border: `3px solid ${accent}`,
            borderRadius: 999,
            padding: "4px 40px 14px",
            transform: `scale(${comment})`,
          }}
        >
          {d.commentText ?? "Did you guess right? 👇"}
        </div>
      </div>
      {/* small follow badge */}
      <div
        style={{
          ...textStyle,
          position: "absolute",
          right: 40,
          bottom: 210,
          fontSize: 40,
          fontWeight: 900,
          color: "white",
          background: "#ef4444",
          borderRadius: 18,
          padding: "2px 24px 10px",
          opacity: ramp(frame, 20, 30),
        }}
      >
        + Follow
      </div>
      <AbsoluteFill style={{ background: "white", opacity: ramp(frame, 0, 8, 0.9, 0) }} />
    </AbsoluteFill>
  );
};

export const Top5V2: React.FC<{ data: Top5Data & V2Extras }> = ({ data: d }) => {
  const n = d.items.length;
  const itemsStart = V2.HOOK;
  const guessStart = itemsStart + (n - 1) * V2.ITEM;
  const finalStart = guessStart + V2.GUESS;
  const tailStart = finalStart + V2.FINAL;
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {d.music ? <Audio src={staticFile(d.music)} volume={d.musicVolume ?? 0.8} /> : null}
      <Sequence durationInFrames={V2.HOOK + V2.SWIPE}>
        <Hook d={d} />
      </Sequence>
      {d.items.slice(0, n - 1).map((_, i) => (
        <Sequence key={i} from={itemsStart + i * V2.ITEM} durationInFrames={V2.ITEM + V2.SWIPE}>
          <Item d={d} i={i} />
        </Sequence>
      ))}
      <Sequence from={guessStart} durationInFrames={V2.GUESS}>
        <Guess d={d} />
      </Sequence>
      <Sequence from={finalStart}>
        <Final d={d} />
      </Sequence>
      {/* Loop: the last frames fade into the very first frame, so a replay feels seamless */}
      <Sequence from={tailStart}>
        <AbsoluteFill style={{ opacity: interpolate(frame, [tailStart, tailStart + V2.TAIL - 1], [0, 1], { extrapolateRight: "clamp" }) }}>
          <Freeze frame={0}>
            <Hook d={d} />
          </Freeze>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
