"""Original, copyright-free soundtrack for Style 2.0 videos (16 s).

Timing matches src/top5/v2/Top5V2.tsx (V2 constants, 30 fps):
hook 1.5 s riser -> drop at #5 -> pop on each reveal (every 2.5 s)
-> drumroll during "Guess #1?" -> big hit on #1 -> fade.
Run:  python3 tools/make_music_v2.py   (needs numpy + ffmpeg)
"""
import os, subprocess, sys, wave
import numpy as np

SR, BPM = 44100, 120
BEAT = 60 / BPM
FPS = 30
HOOK, ITEM, GUESS, FINAL, TAIL = 45 / FPS, 75 / FPS, 30 / FPS, 90 / FPS, 15 / FPS
N_ITEMS = 4  # #5..#2
T_ITEMS = HOOK
T_GUESS = HOOK + N_ITEMS * ITEM
T_FINAL = T_GUESS + GUESS
TOTAL = T_FINAL + FINAL + TAIL
N = int(TOTAL * SR)
rng = np.random.default_rng(11)

def note(m): return 440.0 * 2 ** ((m - 69) / 12)
def filt(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.ones_like(f)
    if hi: m *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if lo: m *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-6)) ** 4)
    return np.fft.irfft(X * m, len(x))
def env(n, a, d):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def place(buf, sig, start):
    i = int(start * SR)
    if i >= len(buf) or i < 0: return
    j = min(len(buf), i + len(sig)); buf[i:j] += sig[: j - i]
def saw(freq, dur, h=14, detune=(0,)):
    t = np.arange(int(dur * SR)) / SR; out = np.zeros_like(t)
    for d in detune:
        f = freq * 2 ** (d / 1200)
        for k in range(1, h + 1):
            if f * k > 15000: break
            out += np.sin(2 * np.pi * f * k * t) / k
    return out / len(detune)
def kick():
    n = int(0.3 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(45 + 120 * np.exp(-t * 32)) / SR) * np.exp(-t * 10)
def snare(v=0.5):
    n = int(0.2 * SR); return filt(rng.standard_normal(n), lo=1200, hi=7000) * env(n, 0.001, 0.06) * v
def hat():
    n = int(0.05 * SR); return filt(rng.standard_normal(n), lo=7000) * env(n, 0.001, 0.015) * 0.22
def boom(v=1.0):
    n = int(1.4 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(32 + 90 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.5) * v
def crash(v=0.25):
    n = int(1.5 * SR); return filt(rng.standard_normal(n), lo=4000) * env(n, 0.002, 0.5) * v
def pop():
    n = int(0.12 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(900 + 1400 * np.exp(-t * 40)) / SR) * env(n, 0.001, 0.04) * 0.5
def whoosh(dur=0.35):
    n = int(dur * SR); out = np.zeros(n); noise = rng.standard_normal(n)
    for c in range(10):
        a, b = c * n // 10, (c + 1) * n // 10
        out[a:b] = filt(noise, lo=300 + 5000 * c / 10, hi=1500 + 9000 * c / 10)[a:b]
    return out * np.sin(np.linspace(0, np.pi, n)) ** 2 * 0.55

drums, bass, pad, lead, fx = (np.zeros(N) for _ in range(5))
side = np.ones(N)
CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
ROOTS = [45, 41, 36, 43]

# Hook: stab + riser
place(fx, boom(0.7), 0); place(fx, crash(), 0)
n = int(HOOK * SR); noise = rng.standard_normal(n); riser = np.zeros(n)
for c in range(16):
    a, b = c * n // 16, (c + 1) * n // 16
    riser[a:b] = filt(noise, lo=200 + 4000 * c / 16, hi=900 + 11000 * c / 16)[a:b]
place(fx, riser * np.linspace(0.05, 0.6, n) ** 2, 0)

def groove(t0, t1, bright=False):
    t, beat_i = t0, 0
    while t < t1 - 1e-6:
        bar = int((t - T_ITEMS) // (4 * BEAT)) % 4
        place(drums, kick(), t)
        i = int(t * SR); k = min(N, i + int(0.28 * SR))
        side[i:k] = np.minimum(side[i:k], 0.3 + 0.7 * (np.arange(k - i) / (0.28 * SR)) ** 0.7)
        if beat_i % 2 == 1: place(drums, snare(), t)
        place(drums, hat(), t + BEAT / 2)
        b = saw(note(ROOTS[bar]), BEAT / 2 * 0.9, h=10)
        place(bass, filt(b, hi=480) * env(len(b), 0.003, 0.15) * 0.45, t + BEAT / 2)
        if beat_i % 4 == 0:
            p = sum(saw(note(m), 4 * BEAT, h=12, detune=(-12, 0, 12)) for m in CH[bar])
            place(pad, filt(p, hi=2400 if bright else 1600) * 0.06, t)
        if bright:
            for s in range(4):
                m = CH[bar][s % 3] + 12; nn = int(BEAT / 4 * SR); tt = np.arange(nn) / SR
                tone = np.sign(np.sin(2 * np.pi * note(m) * tt)) * 0.5 + np.sin(2 * np.pi * note(m) * tt)
                place(lead, filt(tone, hi=3500) * env(nn, 0.002, 0.07) * 0.05, t + s * BEAT / 4)
        t += BEAT; beat_i += 1

# Drop at #5, groove through #2
place(fx, boom(), T_ITEMS); place(fx, crash(), T_ITEMS)
groove(T_ITEMS, T_GUESS)
for k in range(N_ITEMS):
    st = T_ITEMS + k * ITEM
    if k: place(fx, whoosh(), st - 0.3)
    place(fx, pop(), st + 2 / FPS)      # number pops in
    place(fx, pop() * 0.6, st + 13 / FPS)  # detail pops in

# Guess: music drops out, accelerating drumroll + rising tone
place(fx, whoosh(), T_GUESS - 0.3)
t, step = T_GUESS, 0.12
while t < T_FINAL - 0.02:
    place(drums, snare(0.25 + 0.6 * (t - T_GUESS) / GUESS), t)
    t += step; step = max(0.035, step * 0.85)
n = int(GUESS * SR); tt = np.arange(n) / SR
place(fx, np.sin(2 * np.pi * np.cumsum(220 + 660 * (tt / GUESS) ** 2) / SR) * 0.12 * (tt / GUESS), T_GUESS)

# #1: big hit, brighter groove, then fade
place(fx, boom(1.2), T_FINAL); place(fx, crash(0.35), T_FINAL); place(fx, pop(), T_FINAL + 0.05)
groove(T_FINAL, TOTAL, bright=True)

mix = drums * 0.9 + bass * side + pad * side + lead + fx
fl = int(0.6 * SR); mix[-fl:] *= np.linspace(1, 0, fl)
mix = np.tanh(mix * 1.3); mix /= np.max(np.abs(mix)) * 1.05
stereo = np.stack([mix, np.roll(mix, int(0.0004 * SR))], axis=1)

out = sys.argv[1] if len(sys.argv) > 1 else "public/music/v2-track.mp3"
wav = out.rsplit(".", 1)[0] + ".wav"
with wave.open(wav, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((stereo * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-b:a", "192k", out], check=True)
os.remove(wav)
print("wrote", out, f"{TOTAL:.2f}s")
