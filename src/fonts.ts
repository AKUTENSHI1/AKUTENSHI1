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
