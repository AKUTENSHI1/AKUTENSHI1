"""Draws the panoramic pictures (SVG) for the week-1 Top 5 videos.

Everything is drawn from scratch, so there are no copyright issues.
Run:  python3 tools/make_scenes.py
"""
import math, os, random

W, H = 2400, 1600
OUT = "public/images"

def save(path, body, defs=""):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><defs>{defs}</defs>{body}</svg>'
    )

def lin(id_, stops, vertical=True):
    x2, y2 = ("0", "1") if vertical else ("1", "0")
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id_}" x1="0" y1="0" x2="{x2}" y2="{y2}">{s}</linearGradient>'

def rad(id_, stops, cx="50%", cy="50%", r="50%"):
    s = "".join(f'<stop offset="{o}" stop-color="{c}" stop-opacity="{a}"/>' for o, c, a in stops)
    return f'<radialGradient id="{id_}" cx="{cx}" cy="{cy}" r="{r}">{s}</radialGradient>'

def wave_line(base, amp, freqs, seed, w=W):
    r = random.Random(seed)
    ph = [r.random() * 6.28 for _ in freqs]
    pts = []
    for i in range(121):
        x = w * i / 120
        y = base - sum(a * math.sin(x / w * f * 6.28 + p) for (f, a), p in zip(freqs, ph))
        pts.append((x, y))
    return pts

def fill_below(pts, color, extra=""):
    p = " ".join(f"{x:.0f},{y:.0f}" for x, y in pts)
    return f'<polygon points="{p} {W},{H} 0,{H}" fill="{color}" {extra}/>'

def stars(seed, n=320, maxy=H):
    r = random.Random(seed)
    return "".join(
        f'<circle cx="{r.random() * W:.0f}" cy="{r.random() * maxy:.0f}" r="{r.choice([1, 1.5, 2, 2.5, 3.5])}" fill="white" opacity="{r.uniform(0.3, 1):.2f}"/>'
        for _ in range(n)
    )

# ---------------- SPACE ----------------
def planet(path, bands, ring=None, r=520, seed=1, glow="#60a5fa", cx=1200, cy=540):
    r = r * 0.6  # small enough that the whole planet fits on a phone screen
    stops = []
    for i, c in enumerate(bands):
        stops += [(f"{i / len(bands):.3f}", c), (f"{(i + 1) / len(bands) - 0.002:.3f}", c)]
    defs = lin("bands", stops) + rad("shade", [(0, "#ffffff", 0.25), (0.55, "#000000", 0), (1, "#000000", 0.75)], "35%", "30%", "75%")
    defs += rad("glow", [(0, glow, 0.35), (1, glow, 0)])
    defs += f'<clipPath id="top"><rect x="0" y="0" width="{W}" height="{cy}"/></clipPath><clipPath id="bot"><rect x="0" y="{cy}" width="{W}" height="{H}"/></clipPath>'
    body = f'<rect width="{W}" height="{H}" fill="#020617"/>{stars(seed)}'
    body += f'<circle cx="{cx}" cy="{cy}" r="{r * 1.6}" fill="url(#glow)"/>'
    ring_svg = lambda clip: (
        f'<g clip-path="url(#{clip})" transform="rotate(-14 {cx} {cy})">'
        f'<ellipse cx="{cx}" cy="{cy}" rx="{r * 2.1}" ry="{r * 0.45}" fill="none" stroke="{ring}" stroke-width="{r * 0.22}" opacity="0.75"/>'
        f'<ellipse cx="{cx}" cy="{cy}" rx="{r * 1.7}" ry="{r * 0.34}" fill="none" stroke="{ring}" stroke-width="{r * 0.1}" opacity="0.5"/></g>'
    ) if ring else ""
    body += ring_svg("top")
    body += f'<g transform="rotate(-14 {cx} {cy})"><circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#bands)"/></g>'
    body += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#shade)"/>'
    body += ring_svg("bot")
    save(path, body, defs)

def earth(path):
    r = 320; cx, cy = 1200, 540
    rnd = random.Random(3)
    defs = rad("sea", [(0, "#38bdf8", 1), (1, "#1e3a8a", 1)], "35%", "30%", "80%")
    defs += rad("shade", [(0, "#ffffff", 0.15), (0.55, "#000000", 0), (1, "#000000", 0.75)], "35%", "30%", "75%")
    defs += rad("glow", [(0, "#38bdf8", 0.4), (1, "#38bdf8", 0)])
    defs += f'<clipPath id="ball"><circle cx="{cx}" cy="{cy}" r="{r}"/></clipPath>'
    land = ""
    for _ in range(7):
        x, y, s = cx + rnd.uniform(-250, 250), cy + rnd.uniform(-240, 240), rnd.uniform(55, 135)
        pts = " ".join(f"{x + s * (0.6 + 0.5 * rnd.random()) * math.cos(a):.0f},{y + s * (0.6 + 0.5 * rnd.random()) * math.sin(a):.0f}" for a in [i * 6.28 / 14 for i in range(14)])
        land += f'<polygon points="{pts}" fill="#16a34a"/>'
    clouds = "".join(f'<ellipse cx="{cx + rnd.uniform(-280, 280):.0f}" cy="{cy + rnd.uniform(-280, 280):.0f}" rx="{rnd.uniform(50, 140):.0f}" ry="{rnd.uniform(10, 22):.0f}" fill="white" opacity="0.7"/>' for _ in range(14))
    body = f'<rect width="{W}" height="{H}" fill="#020617"/>{stars(4)}<circle cx="{cx}" cy="{cy}" r="{r * 1.5}" fill="url(#glow)"/>'
    body += f'<g clip-path="url(#ball)"><circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#sea)"/>{land}{clouds}</g><circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#shade)"/>'
    save(path, body, defs)

def moon(path, base, crater, seed, host=None, haze=None, spots=None):
    r = 310; cx, cy = 1200, 540
    rnd = random.Random(seed)
    defs = rad("shade", [(0, "#ffffff", 0.2), (0.55, "#000000", 0), (1, "#000000", 0.8)], "35%", "30%", "75%")
    defs += f'<clipPath id="ball"><circle cx="{cx}" cy="{cy}" r="{r}"/></clipPath>'
    body = f'<rect width="{W}" height="{H}" fill="#020617"/>{stars(seed)}'
    if host:  # big host planet peeking in the corner
        defs += lin("host", [(0, host[0]), (0.5, host[1]), (1, host[0])])
        body += f'<circle cx="500" cy="1450" r="520" fill="url(#host)" opacity="0.9"/>'
    marks = ""
    for _ in range(40):
        x, y, s = cx + rnd.uniform(-r, r), cy + rnd.uniform(-r, r), rnd.uniform(10, 45)
        col = spots if spots and rnd.random() < 0.6 else crater
        marks += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{s:.0f}" fill="{col}" opacity="{rnd.uniform(0.4, 0.9):.2f}"/>'
    body += f'<g clip-path="url(#ball)"><circle cx="{cx}" cy="{cy}" r="{r}" fill="{base}"/>{marks}</g>'
    if haze:
        defs += rad("haze", [(0.85, haze, 0), (0.93, haze, 0.8), (1, haze, 0)])
        body += f'<circle cx="{cx}" cy="{cy}" r="{r * 1.08}" fill="url(#haze)"/>'
    body += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#shade)"/>'
    save(path, body, defs)

# ---------------- DESERTS ----------------
def dunes(path, sky, sand, seed, sun="#fef3c7", flat=False):
    defs = lin("sky", [(0, sky[0]), (1, sky[1])]) + rad("sun", [(0, sun, 0.9), (1, sun, 0)])
    body = f'<rect width="{W}" height="{H}" fill="url(#sky)"/>'
    body += f'<circle cx="1700" cy="420" r="420" fill="url(#sun)"/><circle cx="1700" cy="420" r="90" fill="{sun}"/>'
    amp = 0.4 if flat else 1
    for i, (c, base) in enumerate(zip(sand, [900, 1050, 1220, 1420])):
        pts = wave_line(base, 1, [(1.3, 90 * amp), (2.7, 60 * amp), (5.3, 25 * amp)], seed + i)
        body += fill_below(pts, c)
    if flat:  # rocks for a stony desert
        rnd = random.Random(seed)
        for _ in range(30):
            x, y, s = rnd.uniform(0, W), rnd.uniform(1250, 1580), rnd.uniform(10, 40)
            body += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{s * 1.6:.0f}" ry="{s:.0f}" fill="#44403c" opacity="0.7"/>'
    save(path, body, defs)

def ice_sheet(path, seed):
    defs = lin("sky", [(0, "#0c4a6e"), (1, "#bae6fd")]) + lin("ice", [(0, "#f8fafc"), (1, "#bfdbfe")])
    body = f'<rect width="{W}" height="{H}" fill="url(#sky)"/>'
    mtn = wave_line(880, 1, [(2, 140), (5, 70), (11, 30)], seed)
    body += fill_below(mtn, "#e2e8f0")
    body += fill_below(wave_line(1050, 1, [(1, 30), (3, 15)], seed + 1), "url(#ice)")
    rnd = random.Random(seed)
    for _ in range(18):
        y = rnd.uniform(1100, 1580); x = rnd.uniform(0, W)
        body += f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x + rnd.uniform(150, 500):.0f}" y2="{y + rnd.uniform(-20, 20):.0f}" stroke="#93c5fd" stroke-width="4" opacity="0.6"/>'
    save(path, body, defs)

def sea_ice(path, seed):
    defs = lin("sky", [(0, "#1e1b4b"), (1, "#a5b4fc")]) + lin("sea", [(0, "#1e3a8a"), (1, "#0f172a")])
    body = f'<rect width="{W}" height="{H}" fill="url(#sky)"/><rect y="820" width="{W}" height="{H}" fill="url(#sea)"/>'
    rnd = random.Random(seed)
    for row in range(9):
        y = 860 + row * 85
        x = rnd.uniform(-200, 0)
        while x < W:
            w = rnd.uniform(120, 420) * (1 + row * 0.15); h = 18 + row * 9
            body += f'<polygon points="{x:.0f},{y:.0f} {x + w:.0f},{y + rnd.uniform(-8, 8):.0f} {x + w * 0.9:.0f},{y + h:.0f} {x + w * 0.1:.0f},{y + h:.0f}" fill="#f1f5f9" opacity="0.95"/>'
            x += w + rnd.uniform(30, 160)
    save(path, body, defs)

# ---------------- BUILDINGS ----------------
def skyline(path, hero, tint, seed):
    defs = lin("sky", [(0, "#020617"), (0.6, tint), (1, "#f59e0b")])
    rnd = random.Random(seed)
    body = f'<rect width="{W}" height="{H}" fill="url(#sky)"/>{stars(seed, 150, 700)}'
    x = 0
    while x < W:  # background city
        w = rnd.uniform(60, 160); h = rnd.uniform(150, 520)
        body += f'<rect x="{x:.0f}" y="{H - h:.0f}" width="{w:.0f}" height="{h:.0f}" fill="#0f172a"/>'
        for wy in range(int(H - h + 20), H - 20, 36):
            for wx in range(int(x + 12), int(x + w - 12), 26):
                if rnd.random() < 0.35:
                    body += f'<rect x="{wx}" y="{wy}" width="10" height="14" fill="#fde68a" opacity="0.7"/>'
        x += w + rnd.uniform(4, 20)
    cx, base, top = 1200, H, 120
    hero_col = "#1e293b"
    shape = ""
    if hero == "burj":
        tiers = [(300, 1600), (240, 1250), (180, 950), (130, 700), (90, 470), (50, 300)]
        for w, y in tiers:
            shape += f'<rect x="{cx - w / 2}" y="{y - (y - 300 if y == 300 else 0) - 260 if False else y - 260}" width="{w}" height="{base - (y - 260)}" fill="{hero_col}"/>'
        shape += f'<polygon points="{cx - 16},60 {cx + 16},60 {cx},-200" fill="{hero_col}"/><rect x="{cx - 16}" y="20" width="32" height="300" fill="{hero_col}"/>'
    elif hero == "merdeka":
        shape += f'<polygon points="{cx - 190},{base} {cx + 190},{base} {cx + 110},420 {cx + 40},260 {cx - 40},260 {cx - 110},420" fill="{hero_col}"/>'
        shape += f'<polygon points="{cx - 12},270 {cx + 12},270 {cx},{top - 60}" fill="{hero_col}"/>'
    elif hero == "shanghai":
        shape += f'<path d="M {cx - 230} {base} Q {cx - 120} 700 {cx - 80} {top + 140} L {cx + 110} {top + 100} Q {cx + 140} 700 {cx + 230} {base} Z" fill="{hero_col}"/>'
    elif hero == "clock":
        shape += f'<rect x="{cx - 380}" y="1000" width="760" height="{base - 1000}" fill="{hero_col}"/>'
        shape += f'<rect x="{cx - 160}" y="360" width="320" height="700" fill="{hero_col}"/>'
        shape += f'<circle cx="{cx}" cy="520" r="120" fill="#f8fafc"/><circle cx="{cx}" cy="520" r="100" fill="#16a34a"/>'
        shape += f'<line x1="{cx}" y1="520" x2="{cx}" y2="440" stroke="white" stroke-width="12"/><line x1="{cx}" y1="520" x2="{cx + 55}" y2="520" stroke="white" stroke-width="12"/>'
        shape += f'<polygon points="{cx - 110},360 {cx + 110},360 {cx},160" fill="{hero_col}"/><rect x="{cx - 10}" y="40" width="20" height="160" fill="{hero_col}"/>'
    elif hero == "pingan":
        shape += f'<polygon points="{cx - 210},{base} {cx + 210},{base} {cx + 150},300 {cx - 150},300" fill="{hero_col}"/>'
        shape += f'<polygon points="{cx - 60},310 {cx + 60},310 {cx},{top}" fill="{hero_col}"/>'
    # lit windows on the hero building
    win = "".join(
        f'<rect x="{cx + dx}" y="{y}" width="12" height="18" fill="#fde68a" opacity="{rnd.uniform(0.3, 0.9):.2f}"/>'
        for y in range(420, H - 40, 46) for dx in range(-90, 90, 34) if rnd.random() < 0.55
    )
    body += f'<g>{shape}</g>{win}'
    save(path, body, defs)

# ---------------- ISLANDS ----------------
def island(path, land, beach, seed, size=1.0, ice=False):
    defs = rad("sea", [(0, "#0ea5e9", 1), (1, "#0c4a6e", 1)], "50%", "45%", "75%")
    rnd = random.Random(seed)
    body = f'<rect width="{W}" height="{H}" fill="url(#sea)"/>'
    for _ in range(60):
        x, y = rnd.uniform(0, W), rnd.uniform(0, H)
        body += f'<path d="M {x:.0f} {y:.0f} q 20 -12 40 0 t 40 0" stroke="white" stroke-width="3" fill="none" opacity="0.25"/>'
    cx, cy = 1200, 760
    ph = [rnd.random() * 6.28 for _ in range(4)]
    def blob(scale):
        pts = []
        for i in range(90):
            a = i / 90 * 6.28
            rr = 0.6 * scale * size * (430 + 90 * math.sin(3 * a + ph[0]) + 60 * math.sin(5 * a + ph[1]) + 30 * math.sin(9 * a + ph[2]))
            pts.append(f"{cx + rr * math.cos(a) * 1.35:.0f},{cy + rr * math.sin(a):.0f}")
        return " ".join(pts)
    body += f'<polygon points="{blob(1.06)}" fill="#7dd3fc" opacity="0.6"/>'
    body += f'<polygon points="{blob(1.0)}" fill="{beach}"/>'
    body += f'<polygon points="{blob(0.93)}" fill="{land}"/>'
    if ice:
        body += f'<polygon points="{blob(0.7)}" fill="#ffffff" opacity="0.9"/>'
    else:
        for _ in range(25):
            a = rnd.random() * 6.28; d = rnd.uniform(0, 180) * size
            body += f'<circle cx="{cx + d * math.cos(a) * 1.3:.0f}" cy="{cy + d * math.sin(a):.0f}" r="{rnd.uniform(15, 40) * size:.0f}" fill="#14532d" opacity="0.5"/>'
    save(path, body, defs)

# ---------------- GLOBE (behind flags) ----------------
def globe(path, tint, seed):
    defs = rad("bg", [(0, tint, 1), (1, "#020617", 1)], "50%", "40%", "80%")
    body = f'<rect width="{W}" height="{H}" fill="url(#bg)"/>{stars(seed, 120)}'
    cx, cy, r = 1200, 820, 640
    body += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="white" stroke-width="4" opacity="0.25"/>'
    for k in range(1, 6):
        rx = r * math.cos(k * math.pi / 12 * 2)
        body += f'<ellipse cx="{cx}" cy="{cy}" rx="{abs(rx):.0f}" ry="{r}" fill="none" stroke="white" stroke-width="3" opacity="0.18"/>'
    for k in range(-3, 4):
        y = cy + r * math.sin(k * math.pi / 8); rx = r * math.cos(k * math.pi / 8)
        body += f'<ellipse cx="{cx}" cy="{y:.0f}" rx="{rx:.0f}" ry="{rx * 0.12:.0f}" fill="none" stroke="white" stroke-width="3" opacity="0.18"/>'
    save(path, body, defs)

# ---------------- build everything ----------------
P = OUT
# Deserts
dunes(f"{P}/deserts/hook.svg", ("#7c2d12", "#fb923c"), ["#c2410c", "#ea580c", "#f97316", "#fdba74"], 10)
dunes(f"{P}/deserts/australian.svg", ("#0284c7", "#fed7aa"), ["#7c2d12", "#9a3412", "#b91c1c", "#c2410c"], 20, flat=True)
dunes(f"{P}/deserts/arabian.svg", ("#9a3412", "#fdba74"), ["#9a3412", "#c2410c", "#ea580c", "#fb923c"], 30)
dunes(f"{P}/deserts/sahara.svg", ("#0369a1", "#fde68a"), ["#b45309", "#d97706", "#f59e0b", "#fcd34d"], 40)
sea_ice(f"{P}/deserts/arctic.svg", 50)
ice_sheet(f"{P}/deserts/antarctic.svg", 60)
# Planets
planet(f"{P}/planets/hook.svg", ["#a16207", "#fde68a", "#b45309", "#fef3c7", "#92400e", "#fcd34d", "#78350f"], ring="#fde68a", r=430, seed=70, glow="#f59e0b")
earth(f"{P}/planets/earth.svg")
planet(f"{P}/planets/neptune.svg", ["#1d4ed8", "#2563eb", "#1e40af", "#3b82f6", "#1d4ed8"], r=520, seed=71, glow="#3b82f6")
planet(f"{P}/planets/uranus.svg", ["#67e8f9", "#a5f3fc", "#22d3ee", "#a5f3fc"], ring="#cffafe", r=480, seed=72, glow="#22d3ee")
planet(f"{P}/planets/saturn.svg", ["#ca8a04", "#fde68a", "#eab308", "#fef9c3", "#a16207", "#fde047"], ring="#fef3c7", r=440, seed=73, glow="#eab308")
planet(f"{P}/planets/jupiter.svg", ["#78350f", "#fed7aa", "#c2410c", "#fef3c7", "#9a3412", "#fdba74", "#7c2d12", "#ffedd5"], r=600, seed=74, glow="#f97316")
# Moons
moon(f"{P}/moons/hook.svg", "#9ca3af", "#4b5563", 80, host=("#7c2d12", "#fdba74"))
moon(f"{P}/moons/moon.svg", "#d1d5db", "#6b7280", 81, host=("#1e3a8a", "#38bdf8"))
moon(f"{P}/moons/io.svg", "#fde047", "#a16207", 82, host=("#7c2d12", "#fdba74"), spots="#ea580c")
moon(f"{P}/moons/callisto.svg", "#57534e", "#e7e5e4", 83, host=("#7c2d12", "#fdba74"))
moon(f"{P}/moons/titan.svg", "#d97706", "#b45309", 84, host=("#a16207", "#fde68a"), haze="#fbbf24")
moon(f"{P}/moons/ganymede.svg", "#a8a29e", "#57534e", 85, host=("#7c2d12", "#fdba74"), spots="#d6d3d1")
# Buildings
skyline(f"{P}/buildings/hook.svg", "burj", "#4c1d95", 90)
skyline(f"{P}/buildings/pingan.svg", "pingan", "#1e3a8a", 91)
skyline(f"{P}/buildings/clock.svg", "clock", "#134e4a", 92)
skyline(f"{P}/buildings/shanghai.svg", "shanghai", "#312e81", 93)
skyline(f"{P}/buildings/merdeka.svg", "merdeka", "#581c87", 94)
skyline(f"{P}/buildings/burj.svg", "burj", "#9a3412", 95)
# Islands
island(f"{P}/islands/hook.svg", "#15803d", "#fde68a", 100)
island(f"{P}/islands/baffin.svg", "#94a3b8", "#cbd5e1", 101, size=0.85, ice=True)
island(f"{P}/islands/madagascar.svg", "#b45309", "#fde68a", 102, size=0.9)
island(f"{P}/islands/borneo.svg", "#166534", "#fde68a", 103, size=0.95)
island(f"{P}/islands/newguinea.svg", "#15803d", "#fef3c7", 104, size=1.0)
island(f"{P}/islands/greenland.svg", "#cbd5e1", "#e2e8f0", 105, size=1.0, ice=True)
# Globes (flags go on top)
for i, tint in enumerate(["#1e3a8a", "#7f1d1d", "#14532d", "#4c1d95", "#9a3412", "#0e7490"]):
    globe(f"{P}/globe/globe{i}.svg", tint, 110 + i)
print("ok")

# ---------------- WEEK 2 ----------------
def sun(path):
    defs = rad("core", [(0, "#fffbeb", 1), (0.35, "#fde047", 1), (0.75, "#f97316", 1), (1, "#b91c1c", 1)])
    defs += rad("corona", [(0, "#f97316", 0.7), (0.5, "#f59e0b", 0.25), (1, "#7c2d12", 0)])
    body = f'<rect width="{W}" height="{H}" fill="#0c0a09"/>{stars(500, 200)}'
    body += f'<circle cx="1200" cy="600" r="900" fill="url(#corona)"/>'
    body += f'<circle cx="1200" cy="600" r="420" fill="url(#core)"/>'
    rnd = random.Random(501)
    for _ in range(40):  # sunspots / granules
        a = rnd.random() * 6.28; d = rnd.uniform(0, 330)
        body += f'<circle cx="{1200 + d * math.cos(a):.0f}" cy="{600 + d * math.sin(a):.0f}" r="{rnd.uniform(6, 22):.0f}" fill="#ea580c" opacity="0.35"/>'
    save(path, body, defs)

planet(f"{P}/planets/venus.svg", ["#fde68a", "#fef3c7", "#fcd34d", "#fef9c3", "#fbbf24"], r=520, seed=75, glow="#fbbf24")
planet(f"{P}/planets/mars.svg", ["#b91c1c", "#c2410c", "#9a3412", "#dc2626", "#7c2d12"], r=480, seed=76, glow="#ef4444")
moon(f"{P}/planets/mercury.svg", "#a8a29e", "#57534e", 77)
sun(f"{P}/planets/sun.svg")
print("week2 ok")
