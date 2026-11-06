// The Top 5 template: hook → #5…#1 with panning photos → outro.
// You normally don't need to edit this file — change data.ts instead.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ramp, textStyle } from "../components";
import type { Top5Data } from "./data";

export const HOOK = 75; // 2.5 s
export const PER_ITEM = 120; // 4 s each
export const OUTRO = 60; // 2 s
const SWIPE = 10; // frames of overlap for the swipe transition

export const top5Duration = (d: Top5Data) => HOOK + d.items.length * PER_ITEM + OUTRO;

// A photo that fills the screen and slowly pans sideways (panoramic look).
const PanImage: React.FC<{
  src: string;
  aspect: number;
  duration: number;
  direction: 1 | -1;
  zoomFrom?: number;
  zoomTo?: number;
  pan?: number;
}> = ({ src, aspect, duration, direction, zoomFrom = 1.08, zoomTo = 1.18, pan = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const zoom = interpolate(frame, [0, duration], [zoomFrom, zoomTo]);
  const h = height * zoom;
  const w = Math.max(h * aspect, width * zoom);
  const travel = w - width; // how far the photo can slide
  const t = interpolate(frame, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  // Centered slide; pan = 1 goes edge to edge, smaller values stay near the middle.
  const x = -travel / 2 + direction * (0.5 - t) * travel * pan;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          width: w,
          height: (w / aspect) < h ? h : w / aspect,
          objectFit: "cover",
          left: 0,
          top: (height - Math.max(h, w / aspect)) / 2,
          transform: `translateX(${x}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Dark fade at top and bottom so white text is always readable.
const Shade: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)",
    }}
  />
);

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ background: "white", opacity: ramp(frame, 0, 6, 0.7, 0) }} />;
};

const Hook: React.FC<{ d: Top5Data }> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Start part-way into the animation so the very first frame already shows the title.
  const top = spring({ frame: frame + 8, fps, config: { damping: 10 } });
  const title = spring({ frame: frame + 6, fps, config: { damping: 11 } });
  const tease = spring({ frame: frame - 24, fps, config: { damping: 9 } });
  const shake = frame < 12 ? Math.sin(frame * 3) * (12 - frame) * 1.5 : 0;
  return (
    <AbsoluteFill>
      <PanImage src={d.hookImage} aspect={d.hookAspect} duration={HOOK + SWIPE} direction={1} zoomFrom={1.6} zoomTo={1.15} pan={d.pan} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.35)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translateX(${shake}px)` }}>
        <div
          style={{
            ...textStyle,
            fontSize: 110,
            fontWeight: 900,
            color: "#111",
            background: "#facc15",
            borderRadius: 24,
            padding: "0 40px 14px",
            transform: `scale(${top}) rotate(-3deg)`,
          }}
        >
          {d.hookTop}
        </div>
        <div
          style={{
            ...textStyle,
            fontSize: 140,
            fontWeight: 900,
            padding: "30px 60px 0",
            textShadow: "0 8px 40px rgba(0,0,0,0.8)",
            opacity: title,
            transform: `scale(${0.6 + title * 0.4})`,
          }}
        >
          {d.hookTitle}
        </div>
        <div
          style={{
            ...textStyle,
            fontSize: 64,
            fontWeight: 700,
            marginTop: 40,
            color: "#facc15",
            textShadow: "0 4px 20px rgba(0,0,0,0.9)",
            transform: `scale(${tease})`,
          }}
        >
          {d.hookTease}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Item: React.FC<{ d: Top5Data; index: number }> = ({ d, index }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const item = d.items[index];
  const rank = d.items.length - index;
  const isFirst = rank === 1;
  // Swipe in from the right (panoramic whip-pan).
  const enter = interpolate(frame, [0, SWIPE], [width, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const num = spring({ frame: frame - 6, fps, config: { damping: 9 } });
  const name = spring({ frame: frame - 14, fps, config: { damping: 14 } });
  const detail = ramp(frame, 26, 40);
  const gold = isFirst ? "#facc15" : "white";
  return (
    <AbsoluteFill style={{ transform: `translateX(${enter}px)` }}>
      <PanImage
        src={item.image}
        aspect={item.aspect}
        duration={PER_ITEM + SWIPE}
        direction={index % 2 === 0 ? 1 : -1}
        pan={d.pan}
      />
      <Shade />
      {item.emoji ? (
        <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 470 }}>
          <div
            style={{
              fontSize: 340,
              lineHeight: 1,
              transform: `scale(${spring({ frame: frame - 4, fps, config: { damping: 10 } })}) rotate(${Math.sin(frame / 12) * 3}deg)`,
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))",
            }}
          >
            {item.emoji}
          </div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 380 }}>
        <div
          style={{
            ...textStyle,
            fontSize: 300,
            fontWeight: 900,
            color: gold,
            lineHeight: 1,
            textShadow: "0 10px 50px rgba(0,0,0,0.7)",
            transform: `scale(${num})`,
          }}
        >
          #{rank}
        </div>
        <div
          style={{
            ...textStyle,
            fontSize: item.name.length > 10 ? 110 : 140,
            fontWeight: 900,
            textShadow: "0 6px 30px rgba(0,0,0,0.8)",
            opacity: name,
            transform: `translateX(${(1 - name) * -400}px)`,
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            ...textStyle,
            fontSize: 72,
            fontWeight: 700,
            marginTop: 10,
            color: "#111",
            background: gold,
            borderRadius: 999,
            padding: "0 40px 10px",
            opacity: detail,
            transform: `scale(${0.8 + detail * 0.2})`,
          }}
        >
          {item.detail}
        </div>
      </AbsoluteFill>
      {/* Countdown dots at the top */}
      <div style={{ position: "absolute", top: 230, width: "100%", display: "flex", justifyContent: "center", gap: 20 }}>
        {d.items.map((_, i) => {
          const r = d.items.length - i;
          return (
            <div
              key={i}
              style={{
                ...textStyle,
                fontSize: 40,
                fontWeight: 900,
                width: 80,
                height: 80,
                lineHeight: "72px",
                borderRadius: 40,
                color: i === index ? "#111" : "white",
                background: i === index ? gold : "rgba(0,0,0,0.35)",
                border: "3px solid rgba(255,255,255,0.6)",
                opacity: i <= index ? 1 : 0.5,
              }}
            >
              {r}
            </div>
          );
        })}
      </div>
      <Flash />
    </AbsoluteFill>
  );
};

const Outro: React.FC<{ d: Top5Data }> = ({ d }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10 } });
  const last = d.items[d.items.length - 1];
  return (
    <AbsoluteFill>
      <PanImage src={last.image} aspect={last.aspect} duration={OUTRO} direction={-1} zoomFrom={1.2} zoomTo={1.3} pan={d.pan} />
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.55)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            ...textStyle,
            fontSize: 84,
            fontWeight: 900,
            padding: "0 50px",
            transform: `scale(${s})`,
          }}
        >
          {d.outro}
        </div>
        <div
          style={{
            ...textStyle,
            fontSize: 70,
            fontWeight: 900,
            marginTop: 50,
            background: "#ef4444",
            borderRadius: 30,
            padding: "6px 60px 20px",
            transform: `scale(${spring({ frame: frame - 10, fps, config: { damping: 8 } }) * (1 + Math.sin(frame / 4) * 0.04)})`,
          }}
        >
          Follow
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Top5Video: React.FC<{ data: Top5Data }> = ({ data }) => {
  const { durationInFrames, fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {data.music ? (
        <Audio
          src={staticFile(data.music)}
          volume={(f) =>
            (data.musicVolume ?? 0.6) *
            interpolate(f, [0, 10, durationInFrames - fps, durationInFrames], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      ) : null}
      <Sequence durationInFrames={HOOK + SWIPE}>
        <Hook d={data} />
      </Sequence>
      {data.items.map((_, i) => (
        <Sequence key={i} from={HOOK + i * PER_ITEM} durationInFrames={PER_ITEM + SWIPE}>
          <Item d={data} index={i} />
        </Sequence>
      ))}
      <Sequence from={HOOK + data.items.length * PER_ITEM}>
        <Outro d={data} />
      </Sequence>
    </AbsoluteFill>
  );
};
