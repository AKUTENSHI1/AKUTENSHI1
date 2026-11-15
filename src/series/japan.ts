// Country Series — Episode 1: Japan. Timing follows the voiceover
// (src/series/japan.timing.json, written by tools/voiceover.mjs).
import type { V2Timing } from "../top5/v2/Top5V2";
import type { EditorialData } from "./Editorial";
import timing from "./japan.timing.json";

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

// Lines: 0 hook, 1-4 = #5..#2, 5 = guess, 6 = #1, 7 = "follow, next is…"
export const timingFromVoice = (t: { lineStarts: number[]; duration: number }): V2Timing => {
  const s = t.lineStarts;
  return {
    hook: f(s[1]),
    items: [f(s[2]) - f(s[1]), f(s[3]) - f(s[2]), f(s[4]) - f(s[3]), f(s[5]) - f(s[4])],
    guess: f(s[6]) - f(s[5]),
    final: f(t.duration + 0.6) - f(s[6]),
    tail: 15,
  };
};

const photo = (file: string, aspect: number) => ({ image: `images/series/japan/${file}`, aspect, pan: 0.6 });

export const japan: EditorialData = {
  country: "Japan",
  hookTop: "TOP 5 PLACES",
  hookTitle: "Going to Japan? 🇯🇵",
  hookTease: "Don't miss No. 01",
  hookImage: "images/series/japan/fuji.jpg",
  hookAspect: 1.537,
  seriesBadge: "Country Series",
  accent: "#f5d0a9",
  guessText: "Hint: 3,776 metres tall",
  commentText: "Have you been to Japan?",
  nextText: "Next issue · Italy",
  voiceStartsNextAt: f(timing.lineStarts[7] - timing.lineStarts[6]),
  outro: "",
  voice: "voice/japan.mp3",
  // no background music: voice only
  pan: 0.6,
  timing: timingFromVoice(timing),
  items: [
    { name: "Osaka", detail: "Street-food capital", ...photo("osaka.jpg", 0.667) },
    { name: "Nara", detail: "1,000+ deer roam free", ...photo("nara.jpg", 0.666) },
    { name: "Tokyo", detail: "Shibuya Crossing", ...photo("tokyo.jpg", 0.666) },
    { name: "Kyoto", detail: "Thousands of red gates", ...photo("kyoto.jpg", 1.0) },
    { name: "Mount Fuji", detail: "Japan's highest peak", ...photo("fuji.jpg", 1.537) },
  ],
};
