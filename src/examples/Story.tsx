// Niche: STORIES — short lines that appear one after another, like a narrator.
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { GradientBackground, PopWords, ramp, textStyle } from "../components";

const LINES = [
  "An old man planted a tiny tree.",
  "A boy laughed: “You'll never see it grow.”",
  "The man smiled: “It's not for me.”",
  "Fifty years later, the boy sat in its shade.",
];
const PER_LINE = 100; // frames each line stays on screen

const StoryLine: React.FC<{ text: string; last: boolean }> = ({ text, last }) => {
  const frame = useCurrentFrame();
  const out = last ? 1 : ramp(frame, PER_LINE - 15, PER_LINE, 1, 0);
  return (
    <AbsoluteFill style={{ justifyContent: "center", opacity: out }}>
      <PopWords text={text} fontSize={100} stagger={4} highlight={["tree", "never", "me", "shade"]} accent="#fbbf24" />
    </AbsoluteFill>
  );
};

export const Story: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <GradientBackground colors={["#1c1917", "#44403c", "#78350f"]} />
      {LINES.map((line, i) => (
        <Sequence key={i} from={i * PER_LINE} durationInFrames={i === LINES.length - 1 ? undefined : PER_LINE}>
          <StoryLine text={line} last={i === LINES.length - 1} />
        </Sequence>
      ))}
      {/* Progress dots at the bottom */}
      <div style={{ position: "absolute", bottom: 300, width: "100%", display: "flex", justifyContent: "center", gap: 22 }}>
        {LINES.map((_, i) => (
          <div
            key={i}
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              background: "white",
              opacity: frame >= i * PER_LINE ? 0.95 : 0.25,
            }}
          />
        ))}
      </div>
      <div style={{ ...textStyle, position: "absolute", top: 260, width: "100%", fontSize: 48, fontWeight: 700, letterSpacing: 8, opacity: 0.7 }}>
        A SHORT STORY
      </div>
    </AbsoluteFill>
  );
};
