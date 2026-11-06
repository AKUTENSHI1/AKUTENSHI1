// Niche: MOTIVATIONAL QUOTES — calm, elegant, one strong sentence.
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GradientBackground, PopWords, ramp, textStyle } from "../components";

export const Quote: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <GradientBackground colors={["#000000", "#1f2937", "#111827"]} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            ...textStyle,
            fontSize: 400,
            fontWeight: 900,
            color: "#f59e0b",
            height: 240,
            opacity: ramp(frame, 0, 20),
            transform: `translateY(${ramp(frame, 0, 20, -40, 0)}px)`,
          }}
        >
          “
        </div>
        <PopWords text="Well done is better than well said." fontSize={130} delay={15} stagger={7} highlight={["done"]} accent="#f59e0b" />
        <div
          style={{
            width: ramp(frame, 80, 110, 0, 260),
            height: 6,
            background: "#f59e0b",
            margin: "70px 0 40px",
            borderRadius: 3,
          }}
        />
        <div style={{ ...textStyle, fontSize: 56, fontWeight: 400, opacity: ramp(frame, 100, 125), letterSpacing: 3 }}>
          — Benjamin Franklin
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
