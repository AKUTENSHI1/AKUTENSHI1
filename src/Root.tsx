// The list of videos ("compositions") in this project.
// Every YouTube Short uses the same vertical format, defined once here.
import { Composition } from "remotion";
import { HelloShort } from "./HelloShort";

export const SHORT_WIDTH = 1080;
export const SHORT_HEIGHT = 1920;
export const SHORT_FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloShort"
        component={HelloShort}
        width={SHORT_WIDTH}
        height={SHORT_HEIGHT}
        fps={SHORT_FPS}
        durationInFrames={10 * SHORT_FPS} // 10 seconds
      />
    </>
  );
};
