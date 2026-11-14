// Style 2.0 video: Top 5 Hottest Planets (NASA average temperatures).
import type { Top5Data } from "../data";
import type { V2Extras } from "../v2/Top5V2";

const space = (file: string) => ({ image: `images/planets/${file}`, aspect: 1.5 });

export const hottestPlanets: Top5Data & V2Extras = {
  hookTop: "TOP 5",
  hookTitle: "Hottest Planets",
  hookTease: "#1 is NOT the closest to the Sun 🔥",
  hookImage: "images/planets/venus.jpg",
  hookAspect: 1.5,
  accent: "#f97316",
  guessText: "Hint: it's NOT Mercury 👀",
  commentText: "Did you guess #1? 👇",
  outro: "",
  music: "music/v2-track.mp3",
  musicVolume: 0.8,
  pan: 0.1,
  items: [
    { name: "Jupiter", detail: "−110 °C average", ...space("jupiter.jpg") },
    { name: "Mars", detail: "−65 °C average", ...space("mars.jpg") },
    { name: "Earth", detail: "15 °C average", ...space("earth.jpg") },
    { name: "Mercury", detail: "167 °C average", ...space("mercury.jpg") },
    { name: "Venus", detail: "464 °C average", ...space("venus.jpg") },
  ],
};
