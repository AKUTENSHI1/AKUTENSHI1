"""Places the real moon photos on a starry panoramic background (2400x1600).

Each moon is cut out along its round edge (so grey photo backgrounds disappear),
scaled to grow from #5 to #1, and centered above the text.
Run:  python3 tools/compose_moons.py
"""
import random
from PIL import Image, ImageChops, ImageDraw, ImageFilter

W, H = 2400, 1600
SRC = "public/images/moons/photos"
OUT = "public/images/moons"
CENTER = (1200, 600)

# name: (file, disc center x, disc center y, disc diameter in the photo, size in the scene)
MOONS = {
    "moon":     ("moon.jpg",     165, 160,  278, 420),
    "io":       ("io.jpg",       512, 512, 1020, 460),
    "callisto": ("callisto.jpg", 369, 375,  640, 520),
    "titan":    ("titan.jpg",    469, 460,  745, 580),
    "ganymede": ("ganymede.jpg", 479, 503,  814, 620),
}

def starfield(seed):
    rnd = random.Random(seed)
    im = Image.new("RGB", (W, H), (2, 4, 14))
    d = ImageDraw.Draw(im)
    for _ in range(420):
        x, y = rnd.uniform(0, W), rnd.uniform(0, H)
        r = rnd.choice([0.8, 1, 1.2, 1.6, 2.2])
        b = int(rnd.uniform(90, 255))
        d.ellipse((x - r, y - r, x + r, y + r), fill=(b, b, min(255, b + 10)))
    return im

def compose(name, file, px, py, diam, target, seed):
    photo = Image.open(f"{SRC}/{file}").convert("RGB")
    s = target / diam
    photo = photo.resize((round(photo.width * s), round(photo.height * s)), Image.LANCZOS)
    if s > 1:
        photo = photo.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    ox, oy = round(CENTER[0] - px * s), round(CENTER[1] - py * s)
    layer = Image.new("RGB", (W, H), (0, 0, 0))
    layer.paste(photo, (ox, oy))
    # round cut-out (slightly larger than the disc, soft edge)
    r = target / 2 * 1.0
    disc = Image.new("L", (W, H), 0)
    ImageDraw.Draw(disc).ellipse((CENTER[0] - r, CENTER[1] - r, CENTER[0] + r, CENTER[1] + r), fill=255)
    disc = disc.filter(ImageFilter.GaussianBlur(3))
    cut = Image.composite(layer, Image.new("RGB", (W, H), (0, 0, 0)), disc)
    stars = starfield(seed)
    stars.paste((0, 0, 0), mask=disc.point(lambda v: 255 if v > 0 else 0))
    out = ImageChops.lighter(stars, cut)
    out.save(f"{OUT}/{name}.jpg", quality=92)
    print(name, "scale", round(s, 3))

for i, (name, args) in enumerate(MOONS.items()):
    compose(name, *args, seed=400 + i)
