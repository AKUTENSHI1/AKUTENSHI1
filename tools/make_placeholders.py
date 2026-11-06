"""Draws simple panoramic mountain pictures (SVG) to use until real photos are added."""
import math, random, sys

def ridge(w, base, amp, rough, seed, peak_x=None, peak_h=0, points=90):
    r = random.Random(seed)
    pts = []
    phase = [r.random() * 6.28 for _ in range(4)]
    for i in range(points + 1):
        x = w * i / points
        y = base
        for k, f in enumerate((1, 2.3, 5.1, 11.7)):
            y -= amp / (k + 1) ** rough * math.sin(x / w * f * 6.28 + phase[k])
        y -= r.uniform(-amp * 0.06, amp * 0.06)
        if peak_x is not None:
            y -= peak_h * max(0, 1 - abs(x - peak_x) / (w * 0.22)) ** 1.6
        pts.append((x, y))
    return pts

def poly(pts, w, h):
    return " ".join(f"{x:.0f},{y:.0f}" for x, y in pts) + f" {w},{h} 0,{h}"

def scene(path, w, h, sky, sun, layers, peak_x, peak_h, seed):
    far = ridge(w, h * 0.62, h * 0.08, 1.0, seed)
    main = ridge(w, h * 0.78, h * 0.1, 0.9, seed + 1, peak_x, peak_h)
    near = ridge(w, h * 0.92, h * 0.05, 1.2, seed + 2)
    snow_line = min(y for _, y in main) + peak_h * 0.35
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
<defs>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{sky[0]}"/><stop offset="1" stop-color="{sky[1]}"/></linearGradient>
 <radialGradient id="sun"><stop offset="0" stop-color="{sun}" stop-opacity="1"/><stop offset="1" stop-color="{sun}" stop-opacity="0"/></radialGradient>
 <linearGradient id="rock" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{layers[1]}"/><stop offset="{peak_x / w:.2f}" stop-color="{layers[1]}"/><stop offset="1" stop-color="{layers[2]}"/></linearGradient>
 <clipPath id="snow"><rect x="0" y="0" width="{w}" height="{snow_line:.0f}"/></clipPath>
</defs>
<rect width="{w}" height="{h}" fill="url(#sky)"/>
<circle cx="{w * 0.78:.0f}" cy="{h * 0.22:.0f}" r="{h * 0.35:.0f}" fill="url(#sun)" opacity="0.55"/>
<circle cx="{w * 0.78:.0f}" cy="{h * 0.22:.0f}" r="{h * 0.06:.0f}" fill="{sun}"/>
<polygon points="{poly(far, w, h)}" fill="{layers[0]}" opacity="0.85"/>
<polygon points="{poly(main, w, h)}" fill="url(#rock)"/>
<polygon points="{poly(main, w, h)}" fill="white" opacity="0.92" clip-path="url(#snow)"/>
<polygon points="{poly(near, w, h)}" fill="{layers[3]}"/>
</svg>'''
    open(path, "w").write(svg)

out = sys.argv[1] if len(sys.argv) > 1 else "public/images"
W, H = 2400, 1600
scene(f"{out}/hook.svg", 3200, 1600, ("#0f172a", "#f97316"), "#fde68a", ("#475569", "#334155", "#1e293b", "#020617"), 1700, 520, 1)
scene(f"{out}/makalu.svg", W, H, ("#1e3a8a", "#93c5fd"), "#ffffff", ("#64748b", "#475569", "#334155", "#0f172a"), 1000, 480, 11)
scene(f"{out}/lhotse.svg", W, H, ("#4c1d95", "#f0abfc"), "#fef3c7", ("#6b21a8", "#581c87", "#3b0764", "#1e1b4b"), 1300, 500, 21)
scene(f"{out}/kangchenjunga.svg", W, H, ("#7c2d12", "#fdba74"), "#fff7ed", ("#9a3412", "#7c2d12", "#431407", "#1c0a03"), 900, 520, 31)
scene(f"{out}/k2.svg", W, H, ("#042f2e", "#5eead4"), "#f0fdfa", ("#115e59", "#134e4a", "#042f2e", "#020617"), 1200, 620, 41)
scene(f"{out}/everest.svg", W, H, ("#020617", "#f59e0b"), "#fef9c3", ("#78350f", "#451a03", "#292524", "#0c0a09"), 1150, 680, 51)
print("ok")
