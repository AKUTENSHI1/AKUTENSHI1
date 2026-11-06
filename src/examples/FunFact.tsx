// Niche: FUN FACTS — a hook question, then the surprising answer.
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Badge, GradientBackground, PopWords, ramp, textStyle } from "../components";

const Hearts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", gap: 50, justifyContent: "center", marginBottom: 80 }}>
      {[0, 1, 2].map((i) => {
        const s = spring({ frame: frame - i * 8, fps, config: { damping: 9 } });
        const beat = 1 + Math.max(0, Math.sin((frame - i * 4) / 4)) * 0.12;
        return (
          <div key={i} style={{ fontSize: 170, transform: `scale(${s * beat})` }}>
            💙
          </div>
        );
      })}
    </div>
  );
};

export const FunFact: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0c4a6e", "#0891b2", "#1e1b4b"]} />
      <Badge label="FUN FACT" color="#facc15" textColor="#0c4a6e" />
      <Sequence durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: "center", opacity: ramp(frame, 75, 90, 1, 0) }}>
          <PopWords text="How many hearts does an octopus have?" fontSize={120} highlight={["octopus"]} />
        </AbsoluteFill>
      </Sequence>
      <Sequence from={90}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Hearts />
          <PopWords text="THREE!" fontSize={220} color="#facc15" />
          <div style={{ ...textStyle, fontSize: 64, fontWeight: 700, padding: "40px 90px 0", opacity: ramp(frame, 135, 155) }}>
            …and its blood is blue.
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
