// Country Series — Japan, rebuilt with the council formula (EditorialV2).
import type { EpisodeV2 } from "./EditorialV2";
import timing from "./japan.timing.json";

const img = (f: string) => `images/series/japan/${f}`;

export const japanV2: EpisodeV2 = {
  country: "Japan",
  flag: "🇯🇵",
  hookLine: "Number one is unreal.",
  closeText: "Like & follow 👍",
  nextCountry: "Italy 🇮🇹",
  voice: "voice/japan.mp3",
  music: "music/japan-bed.mp3",
  musicVolume: 0.12,
  timing,
  host: { name: "Zoe", clip: "video/zoe/japan-intro-intone.mp4", image: "images/zoe/japan-intro-hq.png" },
  places: [
    {
      name: "Osaka", spot: "Dotonbori", detail: "Street-food capital", image: img("osaka.jpg"),
      shots: [{ x: 0.5, y: 0.5, zoom: 1 }, { x: 0.12, y: 0.2, zoom: 1.7 }, { x: 0.5, y: 0.72, zoom: 1.5 }],
    },
    {
      name: "Nara", spot: "Nara Park", detail: "1,000+ deer roam free", image: img("nara.jpg"),
      shots: [{ x: 0.4, y: 0.5, zoom: 1 }, { x: 0.55, y: 0.33, zoom: 2.0 }, { x: 0.3, y: 0.62, zoom: 1.4 }],
    },
    {
      name: "Tokyo", spot: "Shibuya Crossing", detail: "One of Earth's busiest", image: img("tokyo.jpg"),
      shots: [{ x: 0.5, y: 0.5, zoom: 1 }, { x: 0.5, y: 0.7, zoom: 1.8 }, { x: 0.62, y: 0.3, zoom: 1.6 }],
    },
    {
      name: "Kyoto", spot: "Fushimi Inari", detail: "Thousands of red gates", image: img("kyoto.jpg"),
      shots: [{ x: 0.5, y: 0.5, zoom: 1 }, { x: 0.3, y: 0.4, zoom: 1.5 }, { x: 0.62, y: 0.55, zoom: 1.7 }],
    },
    {
      name: "Mount Fuji", spot: "Japan's highest peak", detail: "3,776 metres", image: img("fuji.jpg"),
      grade: "contrast(1.3) saturate(1.5) sepia(0.12) brightness(1.0) hue-rotate(-6deg)",
      shots: [{ x: 0.48, y: 0.4, zoom: 1.25 }, { x: 0.5, y: 0.5, zoom: 1 }, { x: 0.92, y: 0.55, zoom: 1.2 }],
    },
  ],
};
