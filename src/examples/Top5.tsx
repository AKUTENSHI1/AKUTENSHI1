// Niche: TOP 5 LISTS — a countdown from #5 to #1.
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GradientBackground, PopWords, ramp, textStyle } from "../components";

const ITEMS = [
  { name: "Makalu", detail: "8,485 m" },
  { name: "Lhotse", detail: "8,516 m" },
  { name: "Kangchenjunga", detail: "8,586 m" },
  { name: "K2", detail: "8,611 m" },
  { name: "Mount Everest", detail: "8,849 m" },
];
const INTRO = 60;
const PER_ITEM = 78;

const Item: React.FC<{ rank: number; name: string; detail: string; last: boolean }> = ({ rank, name, detail, last }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numberIn = spring({ frame, fps, config: { damping: 10 } });
  const nameIn = spring({ frame: frame - 8, fps, config: { damping: 14 } });
  const out = last ? 1 : ramp(frame, PER_ITEM - 10, PER_ITEM, 1, 0);
  const gold = rank === 1;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: out }}>
      <div
        style={{
          ...textStyle,
          fontSize: 380,
          fontWeight: 900,
          color: gold ? "#facc15" : "white",
          transform: `scale(${numberIn})`,
          textShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        #{rank}
      </div>
      <div style={{ ...textStyle, fontSize: name.length > 10 ? 100 : 130, fontWeight: 900, opacity: nameIn, transform: `translateX(${(1 - nameIn) * -500}px)` }}>
        {name}
      </div>
      <div style={{ ...textStyle, fontSize: 70, fontWeight: 700, marginTop: 20, opacity: ramp(frame, 20, 35) * 0.85 }}>
        {detail}
      </div>
    </AbsoluteFill>
  );
};

export const Top5: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <GradientBackground colors={["#7f1d1d", "#ea580c", "#431407"]} />
      <Sequence durationInFrames={INTRO}>
        <AbsoluteFill style={{ justifyContent: "center", opacity: ramp(frame, INTRO - 10, INTRO, 1, 0) }}>
          <PopWords text="Top 5 tallest mountains on Earth" fontSize={120} highlight={["5", "tallest"]} />
        </AbsoluteFill>
      </Sequence>
      {ITEMS.map((item, i) => (
        <Sequence key={i} from={INTRO + i * PER_ITEM} durationInFrames={i === ITEMS.length - 1 ? undefined : PER_ITEM}>
          <Item rank={5 - i} name={item.name} detail={item.detail} last={i === ITEMS.length - 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
