// Creates the ElevenLabs voiceover for a Country Series episode, and records
// exactly when each line is spoken so the video can follow the voice.
//
// PowerShell (in the project folder):
//   node tools/voiceover.mjs japan
// It asks for your ElevenLabs API key and voice ID (or reads them from
// $env:ELEVENLABS_API_KEY and $env:ELEVENLABS_VOICE_ID if you set those).
//
// Reads  src/series/<episode>.script.json  (one entry per line of the script)
// Writes public/voice/<episode>.mp3  and  src/series/<episode>.timing.json
import fs from "node:fs";

import readline from "node:readline/promises";

const episode = process.argv[2];
if (!episode) {
  console.error("Usage: node tools/voiceover.mjs <episode>   (for example: node tools/voiceover.mjs japan)");
  process.exit(1);
}
// Use the environment variables if set; otherwise just ask.
let key = process.env.ELEVENLABS_API_KEY;
let voice = process.env.ELEVENLABS_VOICE_ID;
if (!key || !voice) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  if (!key) key = (await rl.question("Paste your ElevenLabs API key, then press Enter: ")).trim();
  if (!voice) voice = (await rl.question("Paste your ElevenLabs voice ID, then press Enter: ")).trim();
  rl.close();
}
if (!key || !voice) {
  console.error("Both the API key and the voice ID are needed.");
  process.exit(1);
}

const { lines } = JSON.parse(fs.readFileSync(`src/series/${episode}.script.json`, "utf8"));
const text = lines.join(" ");

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps`, {
  method: "POST",
  headers: { "xi-api-key": key, "Content-Type": "application/json" },
  body: JSON.stringify({
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.5 },
  }),
});
if (!res.ok) {
  console.error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const data = await res.json();
fs.mkdirSync("public/voice", { recursive: true });
fs.writeFileSync(`public/voice/${episode}.mp3`, Buffer.from(data.audio_base64, "base64"));

// Find when each line starts, using the character timings ElevenLabs returns.
const starts = data.alignment.character_start_times_seconds;
const ends = data.alignment.character_end_times_seconds;
const lineStarts = [];
let offset = 0;
for (const line of lines) {
  lineStarts.push(starts[Math.min(offset, starts.length - 1)]);
  offset += line.length + 1; // +1 for the space joining the lines
}
const duration = ends[ends.length - 1];
fs.writeFileSync(`src/series/${episode}.timing.json`, JSON.stringify({ lineStarts, duration }, null, 2) + "\n");
console.log(`Saved public/voice/${episode}.mp3 (${duration.toFixed(1)} s) and src/series/${episode}.timing.json`);
