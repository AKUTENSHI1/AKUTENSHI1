"""Places the real planet photos on a starry panoramic background (2400x1600).

Each planet is scaled so it grows from #5 to #1, and centered where the
video shows it best (above the text). Run:  python3 tools/compose_planets.py
"""
import random
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

W, H = 2400, 1600
SRC = "public/images/planets/photos"
OUT = "public/images/planets"
CENTER = (1200, 600)

# (file, disc center x, disc center y, disc diameter) measured in the original photo
PLANETS = {
    "earth":   ("earth.jpg",   640,  640, 1133, 420),
    "neptune": ("neptune.jpg", 602,  331,  615, 480),
    "uranus":  ("uranus.jpg",  925, 1295, 1231, 470),
    "saturn":  ("saturn.png", 2791, 1251, 2007, 700),
    "jupiter": ("jupiter.jpg", 223,  222,  372, 720),
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

def fix_saturn_ring(im):
    """Fills the missing wedge of the ring (lower left) with its mirror image from the right."""
    a = np.asarray(im).astype(np.int16)
    cx = 2761  # ring center, measured from the outer edges of the rings
    flipped = a[:, ::-1]
    shift = 2 * cx - a.shape[1]          # align the mirror axis with the planet center
    mirror = np.zeros_like(a)
    if shift >= 0:
        mirror[:, shift:] = flipped[:, : a.shape[1] - shift]
    else:
        mirror[:, : a.shape[1] + shift] = flipped[:, -shift:]
    region = np.zeros(a.shape[:2], bool)
    region[1000:1550, 380:1700] = True
    lum = a.mean(axis=2); mlum = mirror.mean(axis=2)
    use = region & (lum < 35) & (mlum > 35)
    a[use] = mirror[use]
    return Image.fromarray(a.astype(np.uint8))

def compose(name, file, px, py, diam, target, seed, center=CENTER):
    photo = Image.open(f"{SRC}/{file}").convert("RGB")
    if name == "saturn":
        photo = fix_saturn_ring(photo)
    s = target / diam
    photo = photo.resize((round(photo.width * s), round(photo.height * s)), Image.LANCZOS)
    if s > 1:  # small photo was enlarged: sharpen a little
        photo = photo.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    layer = Image.new("RGB", (W, H), (0, 0, 0))
    layer.paste(photo, (round(center[0] - px * s), round(center[1] - py * s)))
    # Hide stars wherever the planet (or its rings) is, then blend:
    # the photo's black sky disappears and the stars show through around it.
    mask = layer.convert("L").point(lambda v: 255 if v > 12 else 0).filter(ImageFilter.MaxFilter(9))
    stars = starfield(seed)
    stars.paste((0, 0, 0), mask=mask)
    out = ImageChops.lighter(stars, layer)
    out.save(f"{OUT}/{name}.jpg", quality=92)
    print(name, "scale", round(s, 3))

for i, (name, args) in enumerate(PLANETS.items()):
    compose(name, *args, seed=200 + i)
# Opening (hook) picture: Saturn, shifted left so the repaired part of the ring stays off-screen
compose("hook", *PLANETS["saturn"], seed=300, center=(1000, 600))
