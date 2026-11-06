"""Composes an original, copyright-free background track for the Top 5 template.

Everything is synthesized from scratch with math, so you own it completely.
Timing matches src/top5/Top5Video.tsx: 2.5 s hook (build-up), then a beat drop
when #5 appears, a whoosh on every swipe (every 4 s), and an outro.

Run:  python3 tools/make_music.py  (needs numpy and ffmpeg)
"""
import subprocess, sys, wave
import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
HOOK = 2.5          # seconds of build-up before the drop
ITEMS = 5
ITEM_LEN = 4.0      # seconds per item (= 2 bars)
OUTRO = 2.0
TOTAL = HOOK + ITEMS * ITEM_LEN + OUTRO + 1.5
N = int(TOTAL * SR)
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def note(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)

def filt(x, lo=None, hi=None):
    """Static band filter in the frequency domain."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if hi: m *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if lo: m *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-6)) ** 4)
    return np.fft.irfft(X * m, len(x))

def place(buf, sig, start):
    i = int(start * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(sig))
    buf[i:j] += sig[: j - i]

def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / decay)

def saw(freq, dur, harmonics=24, detune=(0,)):
    t = np.arange(int(dur * SR)) / SR
    out = np.zeros_like(t)
    for d in detune:
        f = freq * 2 ** (d / 1200)
        ph = rng.random() * 2 * np.pi
        for k in range(1, harmonics + 1):
            if f * k > 16000: break
            out += np.sin(2 * np.pi * f * k * t + ph * k) / k
    return out / len(detune)

# ---------- drum sounds ----------
def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 1.0

def clap():
    n = int(0.25 * SR)
    return filt(rng.standard_normal(n), lo=900, hi=6000) * env(n, 0.001, 0.07) * 0.5

def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    return filt(rng.standard_normal(n), lo=7000) * env(n, 0.001, 0.06 if open_ else 0.015) * 0.25

def crash():
    n = int(1.6 * SR)
    return filt(rng.standard_normal(n), lo=4000) * env(n, 0.002, 0.5) * 0.25

def boom():
    n = int(1.4 * SR); t = np.arange(n) / SR
    f = 35 + 80 * np.exp(-t * 6)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.5) * 1.1

def whoosh(dur=0.45):
    n = int(dur * SR); out = np.zeros(n)
    noise = rng.standard_normal(n)
    chunks = 12
    for c in range(chunks):  # rising filter sweep
        a, b = c * n // chunks, (c + 1) * n // chunks
        out[a:b] = filt(noise, lo=300 + 5000 * c / chunks, hi=1500 + 9000 * c / chunks)[a:b]
    shape = np.sin(np.linspace(0, np.pi, n)) ** 2
    return out * shape * 0.6

# ---------- music ----------
drums = np.zeros(N); bass = np.zeros(N); pad = np.zeros(N); lead = np.zeros(N); fx = np.zeros(N)
side = np.ones(N)  # sidechain "pump" envelope, ducks on every kick

# Chord progression (one chord per bar): Am - F - C - G
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOTS = [45, 41, 36, 43]
BAR = 4 * BEAT
drop = HOOK
end = HOOK + ITEMS * ITEM_LEN

# Build-up during the hook: riser + snare roll that speeds up
riser_n = int(HOOK * SR)
noise = rng.standard_normal(riser_n); riser = np.zeros(riser_n)
for c in range(20):
    a, b = c * riser_n // 20, (c + 1) * riser_n // 20
    riser[a:b] = filt(noise, lo=200 + 4000 * c / 20, hi=800 + 12000 * c / 20)[a:b]
riser *= np.linspace(0.05, 0.7, riser_n) ** 2
t = np.arange(riser_n) / SR
sweep = np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / HOOK) ** 2) / SR) * 0.12 * (t / HOOK)
place(fx, riser + sweep, 0)
# chord stab at the very start to grab attention
place(fx, boom() * 0.7, 0); place(fx, crash(), 0)
roll_t = 0.6
step = BEAT / 2
while roll_t < HOOK - 0.02:
    place(drums, clap() * (0.3 + 0.7 * roll_t / HOOK), roll_t)
    roll_t += step
    if roll_t > HOOK * 0.5: step = BEAT / 4
    if roll_t > HOOK * 0.8: step = BEAT / 8
# Hook pad (filtered, quiet)
for bi in range(2):
    s = bi * BAR * 0.5
    ch = CHORDS[0]
    sig = sum(saw(note(m), HOOK - s, harmonics=10, detune=(-8, 8)) for m in ch)
    place(pad, filt(sig, hi=900) * 0.05 * np.linspace(0.3, 1, len(sig)), s); break

# Impact on the drop
place(fx, boom(), drop); place(fx, crash(), drop)

# Main groove
bar_i = 0
t0 = drop
while t0 < end - 1e-6:
    ch = CHORDS[bar_i % 4]; root = ROOTS[bar_i % 4]
    item = int((t0 - drop) // ITEM_LEN)
    last_item = item == ITEMS - 1
    for b in range(4):
        bt = t0 + b * BEAT
        place(drums, kick(), bt)
        i = int(bt * SR); k = min(N, i + int(0.3 * SR))
        side[i:k] = np.minimum(side[i:k], 0.25 + 0.75 * (np.arange(k - i) / (0.3 * SR)) ** 0.7)
        if b in (1, 3): place(drums, clap(), bt)
        place(drums, hat(open_=True), bt + BEAT / 2)
        place(drums, hat() * 0.6, bt + BEAT / 4)
        place(drums, hat() * 0.6, bt + 3 * BEAT / 4)
        # bass: off-beat 8ths
        bn = saw(note(root), BEAT / 2 * 0.9, harmonics=12)
        place(bass, filt(bn, hi=500) * env(len(bn), 0.003, 0.18) * 0.45, bt + BEAT / 2)
        bn2 = saw(note(root), BEAT / 2 * 0.9, harmonics=12)
        place(bass, filt(bn2, hi=400) * env(len(bn2), 0.003, 0.12) * 0.3, bt)
    # pad chord for the whole bar
    sig = sum(saw(note(m), BAR, harmonics=14, detune=(-12, 0, 12)) for m in ch)
    place(pad, filt(sig, hi=2200 if last_item else 1600) * 0.07, t0)
    # lead arpeggio (16th notes), brighter on #1
    arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12]
    if item >= 2:
        for s16 in range(16):
            m = arp[s16 % 4] + (12 if last_item and s16 % 8 == 7 else 0)
            n = int(BEAT / 4 * SR); tt = np.arange(n) / SR
            tone = np.sign(np.sin(2 * np.pi * note(m) * tt)) * 0.5 + np.sin(2 * np.pi * note(m) * tt)
            vol = 0.06 if last_item else 0.035
            place(lead, filt(tone, hi=3500) * env(n, 0.002, 0.07) * vol, t0 + s16 * BEAT / 4)
    t0 += BAR; bar_i += 1

# Whoosh + crash on every swipe between items, and into the outro
for k in range(1, ITEMS + 1):
    st = drop + k * ITEM_LEN
    place(fx, whoosh(), st - 0.38)
    place(fx, crash() * 0.6, st)
# Outro: sustained chord + final hit
place(fx, boom() * 0.8, end)
sig = sum(saw(note(m), OUTRO + 1.5, harmonics=14, detune=(-12, 0, 12)) for m in CHORDS[0])
place(pad, filt(sig, hi=1800) * 0.08 * env(len(sig), 0.01, 1.2), end)

mix = drums * 0.9 + bass * side + pad * side + lead * (0.6 + 0.4 * side) + fx
# gentle master fade-out at the very end
fade = np.ones(N); fl = int(1.2 * SR); fade[-fl:] = np.linspace(1, 0, fl)
mix *= fade
mix = np.tanh(mix * 1.3)  # soft limiter
mix /= np.max(np.abs(mix)) * 1.05
stereo = np.stack([mix, np.roll(mix, int(0.0004 * SR))], axis=1)

out = sys.argv[1] if len(sys.argv) > 1 else "public/music/intro-track.mp3"
wav = out.rsplit(".", 1)[0] + ".wav"
with wave.open(wav, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((stereo * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-b:a", "192k", out], check=True)
import os; os.remove(wav)
print("wrote", out, f"{TOTAL:.1f}s")
