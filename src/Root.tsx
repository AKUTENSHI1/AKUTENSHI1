// The list of videos ("compositions") in this project.
// Every YouTube Short uses the same vertical format, defined once here.
import { Composition, Still } from "remotion";
import { ProfilePic } from "./brand/ProfilePic";
import { Banner } from "./brand/Banner";
import { Thumbnail } from "./brand/Thumbnail";
import { HelloShort } from "./HelloShort";
import { FunFact } from "./examples/FunFact";
import { QuickTip } from "./examples/QuickTip";
import { Story } from "./examples/Story";
import { Quote } from "./examples/Quote";
import { Top5 } from "./examples/Top5";
import { Top5Video, top5Duration } from "./top5/Top5Video";
import { mountains } from "./top5/data";
import { week1 } from "./top5/week1";
import { Top5V2, v2Duration } from "./top5/v2/Top5V2";
import { deadliestBugs } from "./top5/week2/bugs";

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
      {/* Week 1: seven daily Top 5 videos */}
      {week1.map((v) => (
        <Composition
          key={v.id}
          id={v.id}
          component={Top5Video}
          defaultProps={{ data: v.data }}
          width={SHORT_WIDTH}
          height={SHORT_HEIGHT}
          fps={SHORT_FPS}
          durationInFrames={top5Duration(v.data)}
        />
      ))}
      {/* Style 2.0 videos */}
      <Composition
        id="Bugs-Deadliest"
        component={Top5V2}
        defaultProps={{ data: deadliestBugs }}
        width={SHORT_WIDTH}
        height={SHORT_HEIGHT}
        fps={SHORT_FPS}
        durationInFrames={v2Duration(deadliestBugs)}
      />
      {/* Channel profile pictures (800×800 still images) */}
      {(["gold", "night", "sunset"] as const).map((v) => (
        <Still key={v} id={`ProfilePic-${v}`} component={ProfilePic} defaultProps={{ variant: v }} width={800} height={800} />
      ))}
      {/* Thumbnails (1080x1920 stills) */}
      <Still
        id="Thumb-Bugs"
        component={Thumbnail}
        width={1080}
        height={1920}
        defaultProps={{
          image: "images/bugs/mosquito.jpg",
          top: "TOP 5",
          title: "DEADLIEST BUGS",
          punch: "#1 IS TINY 😨",
          accent: "#ef4444",
          zoom: 1.0,
          focusX: 45,
          focusY: 40,
          textTop: 900,
        }}
      />
      {/* Channel banners (2560×1440 still images) */}
      {(["gold", "night", "sunset"] as const).map((v) => (
        <Still key={v} id={`Banner-${v}`} component={Banner} defaultProps={{ variant: v }} width={2560} height={1440} />
      ))}
    </>
  );
};
