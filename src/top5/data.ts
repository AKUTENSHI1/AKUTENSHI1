// ✏️ EDIT THIS FILE to make a new Top 5 video.
// Put your pictures in public/images/ and your music in public/music/.

export type Top5Item = {
  name: string; // big title, e.g. "Mount Everest"
  detail: string; // small line under it, e.g. "8,849 m"
  image: string; // file inside public/ (e.g. "images/everest.jpg")
  aspect: number; // picture width ÷ height (e.g. 1.5 for a 3:2 photo)
};

export type Top5Data = {
  hookTop: string; // small line above the title
  hookTitle: string; // the big hook title (first seconds)
  hookTease: string; // little teaser, e.g. "Wait for #1…"
  hookImage: string;
  hookAspect: number;
  unit?: string; // optional label for the bars (e.g. "height")
  items: Top5Item[]; // in order #5, #4, #3, #2, #1
  outro: string;
  music?: string; // file inside public/ — leave empty for no music
  musicVolume?: number; // 0 to 1
};

// The pictures below are drawn stand-ins. To use real photos, save them in
// public/images/ and change the file name (and aspect) on each line.
export const mountains: Top5Data = {
  hookTop: "TOP 5",
  hookTitle: "Tallest Mountains on Earth",
  hookTease: "Wait for #1…",
  hookImage: "images/hook.svg",
  hookAspect: 2,
  items: [
    { name: "Makalu", detail: "8,485 m", image: "images/makalu.svg", aspect: 1.5 },
    { name: "Lhotse", detail: "8,516 m", image: "images/lhotse.svg", aspect: 1.5 },
    { name: "Kangchenjunga", detail: "8,586 m", image: "images/kangchenjunga.svg", aspect: 1.5 },
    { name: "K2", detail: "8,611 m", image: "images/k2.svg", aspect: 1.5 },
    { name: "Mount Everest", detail: "8,849 m", image: "images/everest.svg", aspect: 1.5 },
  ],
  outro: "Follow for more Top 5s",
  music: "music/intro-track.mp3",
  musicVolume: 0.6,
};
