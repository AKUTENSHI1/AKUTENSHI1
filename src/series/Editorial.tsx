// Editorial (travel-magazine) style for the Country Series.
// Serif headlines, "No. 05" numbering, thin rules, italic captions, slow
// cinematic camera moves with soft cross-fades, film grain and a warm grade.
// Timing follows the voiceover (same sections as Style 2.0).
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SANS_FONT, SERIF_FONT } from "../fonts";
import type { Top5Data } from "../top5/data";
import { v2Timing, type V2Extras } from "../top5/v2/Top5V2";

type Ep = Top5Data & V2Extras & { country: string; issue?: string; likeSubscribe?: boolean };

const FADE = 12; // cross-fade length in frames
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const serif = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: SERIF_FONT,
  fontSize: size,
  color: "#fdfaf3",
  lineHeight: 1,
  textAlign: "center",
  textShadow: "0 4px 30px rgba(0,0,0,0.55)",
  ...extra,
});
const caps = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: SANS_FONT,
  fontWeight: 700,
  fontSize: size,
  letterSpacing: size * 0.35,
  textTransform: "uppercase",
  color: "#fdfaf3",
  textAlign: "center",
  ...extra,
});

// Slow "Ken Burns" camera move over a photo, with a warm, slightly faded grade.
const Shot: React.FC<{ src: string; len: number; dir: number; blur?: number }> = ({ src, len, dir, blur = 0 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, len], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const scale = 1.12 + t * 0.12;
  const x = (dir > 0 ? -1 : 1) * (t - 0.5) * 60;
  const y = (t - 0.5) * -30;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0b0b0b" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          filter: `saturate(0.85) contrast(1.05) sepia(0.12) brightness(0.95)${blur ? ` blur(${blur}px)` : ""}`,
        }}
      />
    </AbsoluteFill>
  );
};

// Soft vignette + gradients so text is always readable.
const Grade: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.78) 100%)",
      }}
    />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 260px rgba(0,0,0,0.65)" }} />
  </>
);

// Animated film grain (changes every frame).
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(random(frame) * 1000);
  return (
    <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// Thin top bar like a magazine header.
const Masthead: React.FC<{ d: Ep; label: string }> = ({ d, label }) => (
  <div style={{ position: "absolute", top: 150, left: 70, right: 70 }}>
    <div style={{ display: "flex", justifyContent: d.issue ? "space-between" : "flex-end", ...caps(24, { letterSpacing: 6, opacity: 0.85 }) }}>
      {d.issue ? <span>{d.issue}</span> : null}
      <span>{label}</span>
    </div>
    <div style={{ height: 2, background: "rgba(253,250,243,0.7)", marginTop: 16 }} />
  </div>
);

// Text that rises and fades in.
const Rise: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)`, ...style }}>{children}</div>;
};

const FadeIn: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, FADE, len, len + FADE], [0, 1, 1, 1], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

// ---------- Cover (hook) ----------
const Cover: React.FC<{ d: Ep; len: number }> = ({ d, len }) => {
  const frame = useCurrentFrame();
  // quick cuts through the places (no #1 spoiler: it stays blurred)
  const cut = Math.max(8, Math.floor(len / d.items.length));
  const idx = Math.min(d.items.length - 1, Math.floor(frame / cut));
  const isLast = idx === d.items.length - 1;
  return (
    <AbsoluteFill>
      <Sequence from={idx * cut} durationInFrames={cut + 1} key={idx}>
        <Shot src={d.items[idx].image} len={cut} dir={1} blur={isLast ? 24 : 0} />
      </Sequence>
      <Grade />
      <Masthead d={d} label={d.seriesBadge ?? "Country Series"} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
        <div style={caps(34, { opacity: 0.9 })}>The 5 places you can't miss</div>
        <div style={serif(210, { fontWeight: 900, marginTop: 20, letterSpacing: 6 })}>{d.country.toUpperCase()}</div>
        <div style={{ width: 160, height: 2, background: "#fdfaf3", margin: "34px 0" }} />
        <div style={serif(64, { fontStyle: "italic", fontWeight: 400 })}>{d.hookTitle}</div>
        <Rise at={12} style={{ marginTop: 24 }}>
          <div style={serif(56, { fontStyle: "italic", color: d.accent ?? "#f5d0a9" })}>{d.hookTease}</div>
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- A place (#5 … #1) ----------
const Place: React.FC<{ d: Ep; i: number; len: number; final?: boolean }> = ({ d, i, len, final }) => {
  const it = d.items[i];
  const rank = d.items.length - i;
  return (
    <FadeIn len={len}>
      <Shot src={it.image} len={len + FADE} dir={i % 2 ? -1 : 1} />
      <Grade />
      <Masthead d={d} label={`No. 0${rank} of 05`} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 300 }}>
        <Rise at={4}>
          <div style={serif(final ? 120 : 96, { fontStyle: "italic", fontWeight: 400, color: final ? d.accent ?? "#f5d0a9" : "#fdfaf3" })}>
            No. 0{rank}
          </div>
        </Rise>
        <Rise at={10} style={{ marginTop: 18 }}>
          <div style={serif(it.name.length > 9 ? 120 : 150, { fontWeight: 900, letterSpacing: 4 })}>{it.name.toUpperCase()}</div>
        </Rise>
        <Rise at={16} style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 26 }}>
          <div style={{ width: 70, height: 2, background: "#fdfaf3" }} />
          <div style={serif(46, { fontStyle: "italic", fontWeight: 400 })}>{it.detail}</div>
          <div style={{ width: 70, height: 2, background: "#fdfaf3" }} />
        </Rise>
      </AbsoluteFill>
    </FadeIn>
  );
};

// ---------- "Can you guess No. 01?" ----------
const Guess: React.FC<{ d: Ep; len: number }> = ({ d, len }) => {
  const last = d.items.length - 1;
  return (
    <FadeIn len={len}>
      <Shot src={d.items[last].image} len={len + FADE} dir={1} blur={30} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.45)" }} />
      <Masthead d={d} label="No. 01 of 05" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
        <div style={caps(30, { opacity: 0.85 })}>And finally</div>
        <div style={serif(110, { fontStyle: "italic", fontWeight: 400, marginTop: 24 })}>Can you guess</div>
        <div style={serif(170, { fontWeight: 900, marginTop: 10 })}>No. 01?</div>
        {d.guessText ? (
          <Rise at={6} style={{ marginTop: 34 }}>
            <div style={serif(48, { fontStyle: "italic", color: d.accent ?? "#f5d0a9" })}>{d.guessText}</div>
          </Rise>
        ) : null}
      </AbsoluteFill>
    </FadeIn>
  );
};

// Small closing card over the #1 shot: comment prompt + next episode.
const Closing: React.FC<{ d: Ep; nextAt: number }> = ({ d, nextAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [nextAt, nextAt + 15], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <Rise at={40}>
        <div style={serif(46, { fontStyle: "italic" })}>{d.commentText}</div>
      </Rise>
      {d.nextText ? (
        <div
          style={{
            opacity: p,
            transform: `translateY(${(1 - p) * 30}px)`,
            border: "2px solid #fdfaf3",
            padding: "14px 40px 18px",
            background: "rgba(0,0,0,0.35)",
            ...caps(30, { letterSpacing: 8 }),
          }}
        >
          {d.nextText}
        </div>
      ) : null}
    </div>
  );
};

// Animated "Like + Subscribe" moment, shown right after #1 is revealed:
// the buttons pop in, a finger taps them, the thumb turns blue and
// "Subscribe" becomes "Subscribed ✓".
const LikeSubscribe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame() - at;
  if (frame < 0) return null;
  const pop = (start: number) => interpolate(frame, [start, start + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const tapLike = frame >= 14;
  const tapSub = frame >= 30;
  const press = (t: number) => (frame >= t && frame < t + 5 ? 0.9 : 1);
  const finger = frame < 14 ? { x: -160, y: 60 } : frame < 30 ? { x: -150, y: 20 } : { x: 170, y: 20 };
  const fingerIn = interpolate(frame, [6, 12], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", display: "flex", gap: 30, alignItems: "center" }}>
        <div
          style={{
            transform: `scale(${pop(0) * press(14)})`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 999,
            padding: "14px 34px",
            fontFamily: SANS_FONT,
            fontWeight: 700,
            fontSize: 44,
            color: tapLike ? "#065fd4" : "#0f0f0f",
          }}
        >
          <span style={{ fontSize: 50, filter: tapLike ? "none" : "grayscale(1)" }}>👍</span>
          Like
        </div>
        <div
          style={{
            transform: `scale(${pop(4) * press(30)})`,
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: tapSub ? "rgba(255,255,255,0.9)" : "#ff0000",
            borderRadius: 999,
            padding: "14px 38px",
            fontFamily: SANS_FONT,
            fontWeight: 700,
            fontSize: 44,
            color: tapSub ? "#0f0f0f" : "white",
          }}
        >
          {tapSub ? "Subscribed ✓" : "Subscribe"}
          <span style={{ fontSize: 44 }}>🔔</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            fontSize: 80,
            opacity: fingerIn * (frame < 50 ? 1 : interpolate(frame, [50, 58], [1, 0], clamp)),
            transform: `translate(${finger.x}px, ${finger.y}px)`,
            transition: "none",
          }}
        >
          👆
        </div>
      </div>
    </div>
  );
};

export const EditorialEpisode: React.FC<{ data: Ep }> = ({ data: d }) => {
  const t = v2Timing(d);
  const n = d.items.length;
  const starts = t.items.map((_, i) => t.hook + t.items.slice(0, i).reduce((a, b) => a + b, 0));
  const guessStart = t.hook + t.items.reduce((a, b) => a + b, 0);
  const finalStart = guessStart + t.guess;
  const finalLen = t.final + t.tail;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0b" }}>
      {d.music ? <Audio src={staticFile(d.music)} volume={d.musicVolume ?? 0.15} loop /> : null}
      {d.voice ? <Audio src={staticFile(d.voice)} volume={1} /> : null}
      <Sequence durationInFrames={t.hook + FADE}>
        <Cover d={d} len={t.hook} />
      </Sequence>
      {d.items.slice(0, n - 1).map((_, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={t.items[i] + FADE}>
          <Place d={d} i={i} len={t.items[i]} />
        </Sequence>
      ))}
      <Sequence from={guessStart} durationInFrames={t.guess + FADE}>
        <Guess d={d} len={t.guess} />
      </Sequence>
      <Sequence from={finalStart}>
        <Place d={d} i={n - 1} len={finalLen} final />
        <Closing d={d} nextAt={d.voiceStartsNextAt ?? 60} />
        {d.likeSubscribe ? <LikeSubscribe at={d.voiceStartsNextAt ?? 60} /> : null}
      </Sequence>
      <Grain />
    </AbsoluteFill>
  );
};

export type EditorialData = Ep;
