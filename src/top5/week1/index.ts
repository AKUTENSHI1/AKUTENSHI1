// Week 1: seven Top 5 videos, one per day.
// Facts checked against standard references (as of 2025–2026).
import type { Top5Data } from "../data";

const base = {
  hookTop: "TOP 5",
  outro: "Follow for more Top 5s",
  music: "music/intro-track.mp3",
  musicVolume: 0.6,
  hookAspect: 1.5,
};
const img = (path: string) => ({ image: `images/${path}`, aspect: 1.5 });

export const week1: { id: string; data: Top5Data }[] = [
  {
    id: "Day1-Deserts",
    data: {
      ...base,
      hookTitle: "Biggest Deserts on Earth",
      hookTease: "#1 is NOT the Sahara 🤯",
      hookImage: "images/deserts/hook.svg",
      pan: 1,
      items: [
        { name: "Arabian Desert", detail: "2.3 million km²", ...img("deserts/arabian.svg") },
        { name: "Great Australian", detail: "2.7 million km²", ...img("deserts/australian.svg") },
        { name: "Sahara", detail: "9.2 million km²", ...img("deserts/sahara.svg") },
        { name: "Arctic Desert", detail: "13.9 million km²", ...img("deserts/arctic.svg") },
        { name: "Antarctic Desert", detail: "14.2 million km²", ...img("deserts/antarctic.svg") },
      ],
    },
  },
  {
    id: "Day2-Planets",
    data: {
      ...base,
      hookTitle: "Biggest Planets in Our Solar System",
      hookTease: "Earth made the list 🌍",
      hookImage: "images/planets/hook.svg",
      pan: 0.15,
      items: [
        { name: "Earth", detail: "12,756 km wide", ...img("planets/earth.svg") },
        { name: "Neptune", detail: "49,528 km wide", ...img("planets/neptune.svg") },
        { name: "Uranus", detail: "51,118 km wide", ...img("planets/uranus.svg") },
        { name: "Saturn", detail: "120,536 km wide", ...img("planets/saturn.svg") },
        { name: "Jupiter", detail: "142,984 km wide", ...img("planets/jupiter.svg") },
      ],
    },
  },
  {
    id: "Day3-Countries",
    data: {
      ...base,
      hookTitle: "Biggest Countries in the World",
      hookTease: "#1 is HUGE 😳",
      hookImage: "images/globe/globe0.svg",
      pan: 0.6,
      items: [
        { name: "Brazil", detail: "8.52 million km²", emoji: "🇧🇷", ...img("globe/globe2.svg") },
        { name: "China", detail: "9.60 million km²", emoji: "🇨🇳", ...img("globe/globe1.svg") },
        { name: "United States", detail: "9.83 million km²", emoji: "🇺🇸", ...img("globe/globe0.svg") },
        { name: "Canada", detail: "9.98 million km²", emoji: "🇨🇦", ...img("globe/globe4.svg") },
        { name: "Russia", detail: "17.1 million km²", emoji: "🇷🇺", ...img("globe/globe3.svg") },
      ],
    },
  },
  {
    id: "Day4-Buildings",
    data: {
      ...base,
      hookTitle: "Tallest Buildings in the World",
      hookTease: "Wait for #1… 🏙️",
      hookImage: "images/buildings/hook.svg",
      pan: 0.3,
      items: [
        { name: "Ping An Finance Center", detail: "599 m · Shenzhen", ...img("buildings/pingan.svg") },
        { name: "Makkah Clock Tower", detail: "601 m · Mecca", ...img("buildings/clock.svg") },
        { name: "Shanghai Tower", detail: "632 m · Shanghai", ...img("buildings/shanghai.svg") },
        { name: "Merdeka 118", detail: "679 m · Kuala Lumpur", ...img("buildings/merdeka.svg") },
        { name: "Burj Khalifa", detail: "828 m · Dubai", ...img("buildings/burj.svg") },
      ],
    },
  },
  {
    id: "Day5-Islands",
    data: {
      ...base,
      hookTitle: "Biggest Islands on Earth",
      hookTease: "Australia doesn't count 👀",
      hookImage: "images/islands/hook.svg",
      pan: 0.15,
      items: [
        { name: "Baffin Island", detail: "507,000 km²", ...img("islands/baffin.svg") },
        { name: "Madagascar", detail: "587,000 km²", ...img("islands/madagascar.svg") },
        { name: "Borneo", detail: "748,000 km²", ...img("islands/borneo.svg") },
        { name: "New Guinea", detail: "786,000 km²", ...img("islands/newguinea.svg") },
        { name: "Greenland", detail: "2.17 million km²", ...img("islands/greenland.svg") },
      ],
    },
  },
  {
    id: "Day6-Moons",
    data: {
      ...base,
      hookTitle: "Biggest Moons in the Solar System",
      hookTease: "Two are bigger than Mercury!",
      hookImage: "images/moons/hook.svg",
      pan: 0.15,
      items: [
        { name: "Our Moon", detail: "3,475 km · Earth", ...img("moons/moon.svg") },
        { name: "Io", detail: "3,643 km · Jupiter", ...img("moons/io.svg") },
        { name: "Callisto", detail: "4,821 km · Jupiter", ...img("moons/callisto.svg") },
        { name: "Titan", detail: "5,150 km · Saturn", ...img("moons/titan.svg") },
        { name: "Ganymede", detail: "5,268 km · Jupiter", ...img("moons/ganymede.svg") },
      ],
    },
  },
  {
    id: "Day7-Population",
    data: {
      ...base,
      hookTitle: "Most Populated Countries",
      hookTease: "#1 changed in 2023!",
      hookImage: "images/globe/globe5.svg",
      pan: 0.6,
      items: [
        { name: "Pakistan", detail: "255 million", emoji: "🇵🇰", ...img("globe/globe2.svg") },
        { name: "Indonesia", detail: "286 million", emoji: "🇮🇩", ...img("globe/globe1.svg") },
        { name: "United States", detail: "347 million", emoji: "🇺🇸", ...img("globe/globe0.svg") },
        { name: "China", detail: "1.42 billion", emoji: "🇨🇳", ...img("globe/globe4.svg") },
        { name: "India", detail: "1.46 billion", emoji: "🇮🇳", ...img("globe/globe3.svg") },
      ],
    },
  },
];
