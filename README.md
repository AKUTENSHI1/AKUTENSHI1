# YouTube Shorts with Remotion

Animated vertical videos (1080×1920, 30 fps) with Arabic / right-to-left support.

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
- `src/fonts.ts` – loads the Cairo font (Arabic + English)
- `public/fonts/` – the font files (free, SIL Open Font License)

## Arabic tips
- Put `dir="rtl"` and `lang="ar"` on any element containing Arabic.
- Animate Arabic **word by word**, never letter by letter (letters must stay joined).
