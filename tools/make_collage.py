"""Builds a vertical collage (1080x1920) from several photos, for an opening hook.

Usage: python3 tools/make_collage.py out.jpg photo1 photo2 ...  (4 or 5 photos)
Layout: 2 photos per row; with an odd count, the last photo takes a full row.
"""
import sys
from PIL import Image, ImageOps

W, H, GAP = 1080, 1920, 12
out, photos = sys.argv[1], sys.argv[2:]
rows = [photos[i:i + 2] for i in range(0, len(photos), 2)]
canvas = Image.new("RGB", (W, H), (10, 10, 14))
row_h = (H - GAP * (len(rows) + 1)) // len(rows)
y = GAP
for row in rows:
    cell_w = (W - GAP * (len(row) + 1)) // len(row)
    x = GAP
    for p in row:
        im = ImageOps.fit(Image.open(p).convert("RGB"), (cell_w, row_h), Image.LANCZOS)
        canvas.paste(im, (x, y))
        x += cell_w + GAP
    y += row_h + GAP
canvas.save(out, quality=92)
print("wrote", out)
