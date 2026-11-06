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

## Render to MP4
```bash
npm run render
```
The video is saved to `out/hello-short.mp4`.

To render a different video: `npx remotion render <VideoId> out/<name>.mp4`

## Where things are
- `src/Root.tsx` – the list of videos and their size, fps and length
- `src/HelloShort.tsx` – the 10-second test video (edit the `TEXT` section to change the words)
- `src/fonts.ts` – loads the Cairo font
- `public/fonts/` – the font files (free, SIL Open Font License)
