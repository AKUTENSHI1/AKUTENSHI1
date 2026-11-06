// The list of videos ("compositions") in this project.
// Every YouTube Short uses the same vertical format, defined once here.
import { Composition, Still } from "remotion";
import { ProfilePic } from "./brand/ProfilePic";
import { Banner } from "./brand/Banner";
import { HelloShort } from "./HelloShort";
import { FunFact } from "./examples/FunFact";
import { QuickTip } from "./examples/QuickTip";
import { Story } from "./examples/Story";
import { Quote } from "./examples/Quote";
import { Top5 } from "./examples/Top5";
import { Top5Video, top5Duration } from "./top5/Top5Video";
import { mountains } from "./top5/data";

export const SHORT_WIDTH = 1080;
export const SHORT_HEIGHT = 1920;
export const SHORT_FPS = 30;

const shorts = [
  { id: "HelloShort", component: HelloShort, seconds: 10 },
  { id: "FunFact", component: FunFact, seconds: 8 },
  { id: "QuickTip", component: QuickTip, seconds: 10 },
  { id: "Story", component: Story, seconds: 15 },
  { id: "Quote", component: Quote, seconds: 7 },
  { id: "Top5", component: Top5, seconds: 15 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {shorts.map((s) => (
        <Composition
          key={s.id}
          id={s.id}
          component={s.component}
          width={SHORT_WIDTH}
          height={SHORT_HEIGHT}
          fps={SHORT_FPS}
          durationInFrames={s.seconds * SHORT_FPS}
        />
      ))}
      {/* Top 5 template with pictures, panning and music */}
      <Composition
        id="Top5Mountains"
        component={Top5Video}
        defaultProps={{ data: mountains }}
        width={SHORT_WIDTH}
        height={SHORT_HEIGHT}
        fps={SHORT_FPS}
        durationInFrames={top5Duration(mountains)}
      />
      {/* Channel profile pictures (800×800 still images) */}
      {(["gold", "night", "sunset"] as const).map((v) => (
        <Still key={v} id={`ProfilePic-${v}`} component={ProfilePic} defaultProps={{ variant: v }} width={800} height={800} />
      ))}
      {/* Channel banners (2560×1440 still images) */}
      {(["gold", "night", "sunset"] as const).map((v) => (
        <Still key={v} id={`Banner-${v}`} component={Banner} defaultProps={{ variant: v }} width={2560} height={1440} />
      ))}
    </>
  );
};
