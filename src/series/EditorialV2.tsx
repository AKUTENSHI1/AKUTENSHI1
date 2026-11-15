// Editorial style v2 — rebuilt from the Shorts Council review (strategy/FORMULA.md):
// ~20-25 s, a new shot every ~1.5 s (several framings per photo, hard cuts),
// big readable text kept between 15 % and 65 % of the height, one warm grade,
// huge hook on frame 0, Like/Subscribe during #1, end card that matches the voice,
// and an ending that loops into the start.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  Img,
  interpolate,
  OffthreadVideo,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SANS_FONT, SERIF_FONT } from "../fonts";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CREAM = "#fdfaf3";

// One framing of a photo: where to look (0-1) and how close (1 = whole photo).
export type Framing = { x: number; y: number; zoom: number };
export type Place = { name: string; spot: string; detail: string; image: string; shots: Framing[]; grade?: string };
export type EpisodeV2 = {
  country: string;
  flag: string;
  places: Place[]; // #5 … #1
  hookLine: string; // under the country name
  guessHint?: string;
  closeText: string; // matches the spoken close
  nextCountry: string;
  voice: string;
  music?: string;
  musicVolume?: number;
  timing: { lineStarts: number[]; duration: number };
  host?: { name: string; clip: string; image: string }; // talking intro (muted: the voice track carries the audio)
};

const f = (s: number) => Math.round(s * FPS);

// Warm, slightly punchy grade shared by every shot.
const GRADE = "contrast(1.1) saturate(1.15) sepia(0.08) brightness(1.02)";

// A single shot: one framing of a photo with a visible push-in.
const Shot: React.FC<{ src: string; fr: Framing; len: number; blur?: number; grade?: string }> = ({ src, fr, len, blur = 0, grade }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, len], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const scale = fr.zoom * (1.0 + t * 0.12);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0b0b0b" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${fr.x * 100}% ${fr.y * 100}%`,
          transformOrigin: `${fr.x * 100}% ${fr.y * 100}%`,
          transform: `scale(${scale})`,
          filter: `${grade ?? GRADE}${blur ? ` blur(${blur}px)` : ""}`,
        }}
      />
    </AbsoluteFill>
  );
};

// Cuts between the framings of one photo, a new one every `every` frames.
const ShotList: React.FC<{ place: Place; len: number; every?: number; blur?: number }> = ({ place, len, every = 45, blur }) => {
  const n = Math.max(1, Math.min(place.shots.length, Math.ceil(len / every)));
  const each = Math.ceil(len / n);
  return (
    <AbsoluteFill>
      {Array.from({ length: n }).map((_, k) => (
        <Sequence key={k} from={k * each} durationInFrames={k === n - 1 ? len - k * each + 30 : each}>
          <Shot src={place.image} fr={place.shots[k % place.shots.length]} len={each} blur={blur} grade={place.grade} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Scrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.2) 100%)",
    }}
  />
);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(random(frame) * 1000);
  return (
    <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

const serif = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: SERIF_FONT,
  fontSize: size,
  color: CREAM,
  lineHeight: 1.02,
  textAlign: "center",
  textShadow: "0 6px 30px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.6)",
  ...extra,
});
const caps = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: SANS_FONT,
  fontWeight: 700,
  fontSize: size,
  letterSpacing: size * 0.22,
  textTransform: "uppercase",
  color: CREAM,
  textAlign: "center",
  textShadow: "0 3px 16px rgba(0,0,0,0.8)",
  ...extra,
});

// Text that punches in quickly.
const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `scale(${0.85 + p * 0.15})`, ...style }}>{children}</div>;
};

// A short white flash + zoom punch on every cut between places.
const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 4], [0.45, 0], clamp) }} />;
};

// ---------- Host intro: Zoe talks (clip muted, main voice plays) ----------
const HostIntro: React.FC<{ d: EpisodeV2; len: number }> = ({ d, len }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [len - 8, len], [1, 1.15], { ...clamp, easing: Easing.in(Easing.quad) });
  const tag = interpolate(frame, [4, 12, 45, 55], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0b" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "65% 35%" }}>
        <OffthreadVideo src={staticFile(d.host!.clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 26%)" }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 140 }}>
        <div style={caps(40)}>5 places in</div>
        <div style={serif(150, { fontWeight: 900, letterSpacing: 4, marginTop: 4 })}>
          {d.country.toUpperCase()} {d.flag}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 70, top: 1180, opacity: tag }}>
        <div style={serif(56, { fontStyle: "italic", textAlign: "left" })}>with {d.host!.name}</div>
        <div style={{ width: 120, height: 3, background: CREAM, marginTop: 8 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Hook: huge country name over fast cuts (no #1 spoiler: last cut blurred) ----------
const Hook: React.FC<{ d: EpisodeV2; len: number }> = ({ d, len }) => {
  const frame = useCurrentFrame();
  const order = [4, 0, 1, 2, 3]; // open on #1's best shot, then the others
  const cut = Math.max(9, Math.floor(len / order.length));
  const k = Math.min(order.length - 1, Math.floor(frame / cut));
  const place = d.places[order[k]];
  return (
    <AbsoluteFill>
      <Sequence from={k * cut} durationInFrames={cut + 1} key={k}>
        <Shot src={place.image} fr={place.shots[0]} len={cut} grade={place.grade} />
      </Sequence>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.38)" }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
        <div style={caps(46)}>Top 5 places</div>
        <div style={serif(250, { fontWeight: 900, marginTop: 10, letterSpacing: 4 })}>{d.country.toUpperCase()}</div>
        <div style={{ fontSize: 120, marginTop: 6 }}>{d.flag}</div>
        <Pop at={10} style={{ marginTop: 18, padding: "0 70px" }}>
          <div style={serif(64, { fontStyle: "italic" })}>{d.hookLine}</div>
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- One place ----------
const PlaceCard: React.FC<{ d: EpisodeV2; i: number; len: number; final?: boolean }> = ({ d, i, len, final }) => {
  const p = d.places[i];
  const rank = d.places.length - i;
  return (
    <AbsoluteFill>
      <ShotList place={p} len={len} />
      <Scrim />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: final ? 880 : 930 }}>
        <Pop at={2}>
          <div style={serif(final ? 120 : 100, { fontStyle: "italic", color: final ? "#ffd27a" : CREAM })}>No. {rank}</div>
        </Pop>
        <Pop at={5} style={{ marginTop: 6 }}>
          <div style={serif(p.name.length > 9 ? 120 : 150, { fontWeight: 900, letterSpacing: 3 })}>{p.name.toUpperCase()}</div>
        </Pop>
        <Pop at={9} style={{ marginTop: 14 }}>
          <div style={caps(40, { opacity: 0.95 })}>{p.spot}</div>
        </Pop>
        <Pop at={13} style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 60, height: 3, background: CREAM }} />
          <div style={serif(52, { fontStyle: "italic" })}>{p.detail}</div>
          <div style={{ width: 60, height: 3, background: CREAM }} />
        </Pop>
      </AbsoluteFill>
      <CutFlash />
    </AbsoluteFill>
  );
};

// ---------- Guess ----------
const Guess: React.FC<{ d: EpisodeV2; len: number }> = ({ d, len }) => {
  const frame = useCurrentFrame();
  const last = d.places[d.places.length - 1];
  const shake = Math.sin(frame * 2.4) * 5;
  return (
    <AbsoluteFill>
      <ShotList place={last} len={len} every={999} blur={28} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.35)" }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 560, transform: `translateX(${shake}px)` }}>
        <div style={serif(110, { fontStyle: "italic" })}>Guess</div>
        <div style={serif(230, { fontWeight: 900, color: "#ffd27a" })}>No. 1?</div>
        {d.guessHint ? <div style={caps(40, { marginTop: 20 })}>{d.guessHint}</div> : null}
      </AbsoluteFill>
      <CutFlash />
    </AbsoluteFill>
  );
};

// ---------- Like + Subscribe (during #1) ----------
const LikeSubscribe: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame() - at;
  if (frame < 0 || frame > 75) return null;
  const pop = (s: number) => interpolate(frame, [s, s + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const out = interpolate(frame, [62, 75], [1, 0], clamp);
  const liked = frame >= 14;
  const subbed = frame >= 28;
  const finger = frame < 14 ? -150 : frame < 28 ? -150 : 160;
  return (
    <div style={{ position: "absolute", top: 470, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: out }}>
      <div style={{ position: "relative", display: "flex", gap: 28 }}>
        <div style={{ transform: `scale(${pop(0) * (frame >= 14 && frame < 18 ? 0.9 : 1)})`, display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.96)", borderRadius: 999, padding: "14px 34px", fontFamily: SANS_FONT, fontWeight: 700, fontSize: 46, color: liked ? "#065fd4" : "#0f0f0f" }}>
          <span style={{ fontSize: 52, filter: liked ? "none" : "grayscale(1)" }}>👍</span>Like
        </div>
        <div style={{ transform: `scale(${pop(4) * (frame >= 28 && frame < 32 ? 0.9 : 1)})`, display: "flex", alignItems: "center", gap: 12, background: subbed ? "rgba(255,255,255,0.92)" : "#ff0000", borderRadius: 999, padding: "14px 36px", fontFamily: SANS_FONT, fontWeight: 700, fontSize: 46, color: subbed ? "#0f0f0f" : "white" }}>
          {subbed ? "Subscribed ✓" : "Subscribe"} <span style={{ fontSize: 46 }}>🔔</span>
        </div>
        <div style={{ position: "absolute", left: "50%", top: "45%", fontSize: 84, transform: `translate(${finger}px, 20px)`, opacity: interpolate(frame, [6, 10], [0, 1], clamp) }}>👆</div>
      </div>
    </div>
  );
};

// ---------- End card (matches the spoken close) ----------
const EndCard: React.FC<{ d: EpisodeV2; at: number }> = ({ d, at }) => {
  const frame = useCurrentFrame() - at;
  if (frame < 0) return null;
  const p = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 380 }}>
      <div style={{ opacity: p, transform: `scale(${0.8 + p * 0.2})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        {d.host ? (
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Img src={staticFile(d.host.image)} style={{ width: 150, height: 150, borderRadius: 75, objectFit: "cover", objectPosition: "50% 22%", border: `4px solid ${CREAM}` }} />
            <div style={serif(64, { fontStyle: "italic", textAlign: "left" })}>{d.host.name}</div>
          </div>
        ) : null}
        <div style={serif(70, { fontStyle: "italic" })}>{d.closeText}</div>
        <div style={{ border: `3px solid ${CREAM}`, background: "rgba(0,0,0,0.45)", padding: "14px 44px 20px", ...caps(48) }}>
          Next: {d.nextCountry}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const v2EpisodeDuration = (d: EpisodeV2) => f(d.timing.duration + 0.4) + 12;

export const EditorialV2: React.FC<{ data: EpisodeV2 }> = ({ data: d }) => {
  const s = d.timing.lineStarts.map(f);
  const end = f(d.timing.duration + 0.4);
  const total = end + 12; // + loop fade
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0b" }}>
      {d.music ? <Audio src={staticFile(d.music)} volume={d.musicVolume ?? 0.12} /> : null}
      <Audio src={staticFile(d.voice)} volume={1} />
      <Sequence durationInFrames={s[1]}>
        {d.host ? <HostIntro d={d} len={s[1]} /> : <Hook d={d} len={s[1]} />}
      </Sequence>
      {[0, 1, 2, 3].map((i) => (
        <Sequence key={i} from={s[1 + i]} durationInFrames={s[2 + i] - s[1 + i]}>
          <PlaceCard d={d} i={i} len={s[2 + i] - s[1 + i]} />
        </Sequence>
      ))}
      <Sequence from={s[5]} durationInFrames={s[6] - s[5]}>
        <Guess d={d} len={s[6] - s[5]} />
      </Sequence>
      <Sequence from={s[6]}>
        <PlaceCard d={d} i={4} len={total - s[6]} final />
        <LikeSubscribe at={20} />
        <EndCard d={d} at={s[7] - s[6]} />
      </Sequence>
      {/* loop: fade into the first frame */}
      <Sequence from={end}>
        <AbsoluteFill style={{ opacity: interpolate(frame, [end, total - 1], [0, 1], clamp) }}>
          <Freeze frame={0}>
            {d.host ? <HostIntro d={d} len={s[1]} /> : <Hook d={d} len={s[1]} />}
          </Freeze>
        </AbsoluteFill>
      </Sequence>
      <Grain />
    </AbsoluteFill>
  );
};
