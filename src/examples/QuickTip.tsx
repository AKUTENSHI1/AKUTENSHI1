// Niche: QUICK TIPS — a problem, then the solution shown visually.
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Badge, GradientBackground, PopWords, ramp, textStyle } from "../components";

const Key: React.FC<{ label: string; index: number; pressAt: number }> = ({ label, index, pressAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - index * 8, fps, config: { damping: 12 } });
  const pressed = frame >= pressAt && frame < pressAt + 12;
  return (
    <div
      style={{
        ...textStyle,
        color: "#111827",
        fontSize: 80,
        fontWeight: 900,
        background: "white",
        borderRadius: 28,
        padding: "20px 44px 34px",
        boxShadow: pressed ? "0 4px 0 #9ca3af" : "0 16px 0 #9ca3af",
        transform: `translateY(${pressed ? 12 : 0}px) scale(${enter})`,
      }}
    >
      {label}
    </div>
  );
};

export const QuickTip: React.FC = () => {
  const frame = useCurrentFrame();
  const keys = ["Ctrl", "Shift", "T"];
  return (
    <AbsoluteFill>
      <GradientBackground colors={["#14532d", "#16a34a", "#052e16"]} />
      <Badge label="QUICK TIP" color="white" textColor="#14532d" />
      <Sequence durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: "center", opacity: ramp(frame, 75, 90, 1, 0) }}>
          <PopWords text="Closed a browser tab by accident?" fontSize={120} highlight={["accident"]} accent="#bbf7d0" />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={90}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ ...textStyle, fontSize: 70, fontWeight: 700, marginBottom: 70 }}>Just press:</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {keys.map((k, i) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                {i > 0 && <span style={{ ...textStyle, fontSize: 80, fontWeight: 900 }}>+</span>}
                <Key label={k} index={i} pressAt={40 + i * 3} />
              </div>
            ))}
          </div>
          <div style={{ ...textStyle, fontSize: 64, fontWeight: 700, marginTop: 90, padding: "0 90px", opacity: ramp(frame, 150, 170) }}>
            and it comes right back. ✨
          </div>
          <div style={{ ...textStyle, fontSize: 42, fontWeight: 400, marginTop: 30, opacity: ramp(frame, 175, 195) * 0.85 }}>
            (On a Mac: Cmd + Shift + T)
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
