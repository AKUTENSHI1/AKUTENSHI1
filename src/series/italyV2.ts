// Country Series — Ep. 2: Italy (free format: photos + user's ElevenLabs voice + original music).
import type { EpisodeV2 } from "./EditorialV2";
import timing from "./italy.timing.json";

const img = (f: string) => `images/series/italy/${f}`;

export const italyV2: EpisodeV2 = {
  country: "Italy",
  flag: "🇮🇹",
  hookLine: "Looks like a painting.",
  closeText: "Like & follow 👍",
  nextCountry: "France 🇫🇷",
  voice: "voice/italy.mp3",
  music: "music/italy-bed.mp3",
  musicVolume: 0.12,
  timing,
  places: [
    { name: "Venice", spot: "Grand Canal", detail: "A city on water", image: img("venice.jpg"),
      shots: [{ x: 0.5, y: 0.5, zoom: 1 }, { x: 0.45, y: 0.65, zoom: 1.6 }, { x: 0.15, y: 0.35, zoom: 1.5 }] },
    { name: "Florence", spot: "The Duomo", detail: "Renaissance skyline", image: img("florence.jpg"),
      shots: [{ x: 0.6, y: 0.5, zoom: 1 }, { x: 0.07, y: 0.5, zoom: 1.2 }, { x: 0.45, y: 0.5, zoom: 1.1 }] },
    { name: "Cinque Terre", spot: "Manarola", detail: "Five cliffside villages", image: img("cinqueterre.jpg"),
      shots: [{ x: 0.45, y: 0.5, zoom: 1 }, { x: 0.15, y: 0.4, zoom: 1.2 }, { x: 0.75, y: 0.5, zoom: 1.15 }] },
    { name: "Amalfi Coast", spot: "Positano", detail: "Houses stacked on cliffs", image: img("amalfi.jpg"),
      shots: [{ x: 0.5, y: 0.5, zoom: 1 }, { x: 0.3, y: 0.45, zoom: 1.6 }, { x: 0.7, y: 0.5, zoom: 1.5 }] },
    { name: "Colosseum", spot: "Rome", detail: "Almost 2,000 years old", image: img("rome.jpg"),
      shots: [{ x: 0.5, y: 0.5, zoom: 1 }, { x: 0.65, y: 0.45, zoom: 1.5 }, { x: 0.3, y: 0.5, zoom: 1.3 }] },
  ],
};
