// Style 2.0 video: Top 5 Deadliest Bugs.
// Numbers: estimated human deaths per year from the diseases each bug spreads
// (WHO estimates; only the mosquito's figure is precise, the rest are rough).
import type { Top5Data } from "../data";
import type { V2Extras } from "../v2/Top5V2";

const card = (file: string, aspect: number) => ({ image: `images/bugs/${file}`, aspect, fit: "card" as const });

export const deadliestBugs: Top5Data & V2Extras = {
  hookTop: "TOP 5",
  hookTitle: "Deadliest Bugs on Earth",
  hookTease: "#1 is smaller than your fingernail 😨",
  hookImage: "images/bugs/mosquito.jpg",
  hookAspect: 1.348,
  accent: "#ef4444",
  guessText: "Hint: it's TINY 🤏",
  commentText: "Did you guess #1? 👇",
  outro: "",
  music: "music/v2-track.mp3",
  musicVolume: 0.8,
  pan: 0.2,
  items: [
    { name: "Flea", detail: "~100 deaths/year", ...card("flea.jpg", 1.429) },
    { name: "Tsetse Fly", detail: "Hundreds/year", ...card("tsetse.jpg", 1.535) },
    { name: "Sandfly", detail: "Thousands/year", ...card("sandfly.jpg", 1.472) },
    { name: "Kissing Bug", detail: "~10,000/year", ...card("kissingbug.jpg", 1.111) },
    { name: "Mosquito", detail: "600,000+ deaths/year", ...card("mosquito.jpg", 1.348) },
  ],
};
