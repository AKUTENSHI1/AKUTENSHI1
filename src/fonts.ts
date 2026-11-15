// Loads the Cairo font from the public/fonts folder.
// Remotion waits for the font to finish loading before it draws any frame,
// so the rendered video always uses the right font.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const MAIN_FONT = "Cairo";

for (const weight of ["400", "700", "900"]) {
  loadFont({
    family: MAIN_FONT,
    url: staticFile(`fonts/cairo-latin-${weight}-normal.woff2`),
    weight,
  });
}

// Editorial style: Playfair Display (serif headlines) + Inter (small captions).
export const SERIF_FONT = "Playfair Display";
export const SANS_FONT = "Inter";
for (const [weight, style] of [["400", "normal"], ["400", "italic"], ["700", "normal"], ["900", "normal"]]) {
  loadFont({ family: SERIF_FONT, url: staticFile(`fonts/playfair-display-latin-${weight}-${style}.woff2`), weight, style });
}
for (const weight of ["400", "700"]) {
  loadFont({ family: SANS_FONT, url: staticFile(`fonts/inter-latin-${weight}-normal.woff2`), weight });
}
