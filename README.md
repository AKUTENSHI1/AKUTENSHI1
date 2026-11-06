# YouTube Shorts with Remotion

Animated vertical videos (1080×1920, 30 fps).

## Requirements
- Node.js 18 or newer (includes npm)
- FFmpeg is not needed separately: Remotion ships its own copy.

## First time only
```bash
npm install
```

## Preview your video (Remotion Studio)
```bash
npm run studio
```
Then open http://localhost:3000 in your browser.

## Render the Top 5 video
```bash
npx remotion render Top5Mountains out/top5-mountains.mp4
```

## Render the test video to MP4
```bash
npm run render
```
The video is saved to `out/hello-short.mp4`.

To render a different video: `npx remotion render <VideoId> out/<name>.mp4`

## Where things are
- `src/Root.tsx` – the list of videos and their size, fps and length
- `src/HelloShort.tsx` – the 10-second test video (edit the `TEXT` section to change the words)
- `src/top5/data.ts` – **edit this to make a new Top 5 video** (titles, pictures, music)
- `src/top5/Top5Video.tsx` – the Top 5 template (hook, panning photos, countdown, outro)
- `REAL_PHOTOS.md` – how to swap the drawn stand-in pictures for real photos
- `public/music/intro-track.mp3` – original background music (no copyright, made by `tools/make_music.py`)
- `src/examples/` – example Shorts for five niches: FunFact, QuickTip, Story, Quote, Top5
- `src/components.tsx` – shared animations (pop-in words, badges, backgrounds)
- `src/fonts.ts` – loads the Cairo font
- `public/fonts/` – the font files (free, SIL Open Font License)
