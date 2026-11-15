"""Original, copyright-free sound bed for a Country Series episode.

Reads the episode's voice timing (src/series/<ep>.timing.json) and makes:
- a soft, warm music bed (pads + gentle pulse) meant to sit far under the voice
- a whoosh into every "Number X" line, a riser during "guess", a hit on #1
Run:  python3 tools/make_series_music.py japan   (needs numpy + ffmpeg)
"""
import json, os, subprocess, sys, wave
import numpy as np

SR = 44100
ep = sys.argv[1]
t = json.load(open(f"src/series/{ep}.timing.json"))
starts, total = t["lineStarts"], t["duration"] + 1.0
N = int(total * SR)
rng = np.random.default_rng(21)

def note(m): return 440.0 * 2 ** ((m - 69) / 12)
def filt(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.ones_like(f)
    if hi: m *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if lo: m *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-6)) ** 4)
    return np.fft.irfft(X * m, len(x))
def env(n, a, d):
    tt = np.arange(n) / SR; return np.minimum(1, tt / max(a, 1e-4)) * np.exp(-tt / d)
def place(buf, sig, at):
    i = int(at * SR)
    if i < 0 or i >= len(buf): return
    j = min(len(buf), i + len(sig)); buf[i:j] += sig[: j - i]
def tone(freq, dur, h=8):
    tt = np.arange(int(dur * SR)) / SR
    return sum(np.sin(2 * np.pi * freq * k * tt) / k ** 1.5 for k in range(1, h + 1))

bed = np.zeros(N); fx = np.zeros(N)
# warm chord pads, 4 s each (Cmaj7 - Am7 - Fmaj7 - G6)
CH = [[48, 55, 59, 64], [45, 52, 55, 60], [41, 48, 52, 57], [43, 50, 55, 59]]
bar = 4.0
for k in range(int(total / bar) + 1):
    ch = CH[k % 4]
    sig = sum(tone(note(m), bar + 0.5) for m in ch)
    n = len(sig); a = np.minimum(1, np.arange(n) / (0.8 * SR)) * np.minimum(1, (n - np.arange(n)) / (0.8 * SR))
    place(bed, filt(sig, hi=1400) * a * 0.05, k * bar)
    # soft plucked pulse on 8th notes
    for s in range(8):
        m = ch[(s * 3) % 4] + 12; pl = tone(note(m), 0.25, h=4)
        place(bed, filt(pl, hi=2500) * env(len(pl), 0.003, 0.08) * 0.03, k * bar + s * 0.5)
    # gentle kick on beats
    for b in range(4):
        n2 = int(0.25 * SR); tt = np.arange(n2) / SR
        place(bed, np.sin(2 * np.pi * np.cumsum(50 + 70 * np.exp(-tt * 30)) / SR) * np.exp(-tt * 12) * 0.25, k * bar + b)

def whoosh(dur=0.4):
    n = int(dur * SR); out = np.zeros(n); noise = rng.standard_normal(n)
    for c in range(10):
        a, b = c * n // 10, (c + 1) * n // 10
        out[a:b] = filt(noise, lo=400 + 4000 * c / 10, hi=1500 + 8000 * c / 10)[a:b]
    return out * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.5
def hit():
    n = int(1.2 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(35 + 80 * np.exp(-tt * 7)) / SR) * np.exp(-tt * 3) * 0.9 + \
        filt(rng.standard_normal(n), lo=4000) * env(n, 0.002, 0.4) * 0.2

for i in (1, 2, 3, 4, 5):
    place(fx, whoosh(), starts[i] - 0.3)
# riser during the guess line, hit on #1
g0, g1 = starts[5], starts[6]
n = int((g1 - g0) * SR); tt = np.arange(n) / SR
place(fx, np.sin(2 * np.pi * np.cumsum(200 + 700 * (tt / max(tt[-1], 1e-3)) ** 2) / SR) * 0.08 * (tt / max(tt[-1], 1e-3)), g0)
place(fx, hit(), g1)
place(fx, whoosh(0.5) * 0.6, starts[7] - 0.3)

mix = bed + fx
fade = int(1.0 * SR); mix[-fade:] *= np.linspace(1, 0, fade)
mix = np.tanh(mix * 1.2); mix /= np.max(np.abs(mix)) * 1.05
st = np.stack([mix, np.roll(mix, int(0.0005 * SR))], axis=1)
out = f"public/music/{ep}-bed.mp3"; wav = out[:-4] + ".wav"
with wave.open(wav, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-b:a", "192k", out], check=True); os.remove(wav)
print("wrote", out, f"{total:.1f}s")
