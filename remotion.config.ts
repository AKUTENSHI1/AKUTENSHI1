// Settings used by Remotion Studio and when rendering.
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// H.264 MP4 is what YouTube recommends.
Config.setCodec("h264");
