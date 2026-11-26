#!/usr/bin/env python3
"""Assemble the Short: Ken Burns on 7 stills + ASS captions (+ voiceover if present).
Caption timings are ESTIMATED (character-weighted) until real word timings exist.
Usage: python3 build.py [voiceover_seconds]"""
import subprocess, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = f"{ROOT}/assets"; OUT = f"{ROOT}/out"; os.makedirs(OUT, exist_ok=True)
vo = f"{A}/voiceover.mp3"
total = float(sys.argv[1]) if len(sys.argv) > 1 else 50.24
# scene boundaries (s) taken from pauses detected in the real voiceover (ffmpeg silencedetect)
bounds = [0, 4.4, 13.5, 22.6, 29.4, 37.1, 43.3, total]
durs = [bounds[i+1]-bounds[i] for i in range(7)]
W, H, FPS = 1080, 1920, 30
clips = []
for i, d in enumerate(durs):
    n = int(d * FPS) + 1
    zoom = "min(zoom+0.0006,1.12)" if i % 2 == 0 else "if(eq(on,1),1.12,max(zoom-0.0006,1.0))"
    f = f"{OUT}/c{i}.mp4"
    subprocess.run(["ffmpeg","-y","-loglevel","error","-loop","1","-i",f"{A}/scene_{i}.png",
        "-vf",f"scale=2160:-1,zoompan=z='{zoom}':x='iw/2-(iw/zoom/2)':y='ih*0.3-(ih/zoom*0.3)':d={n}:s={W}x{H}:fps={FPS}",
        "-t",f"{d:.3f}","-c:v","libx264","-pix_fmt","yuv420p",f],check=True)
    clips.append(f)
open(f"{OUT}/list.txt","w").write("".join(f"file '{c}'\n" for c in clips))
# cues: (text, highlight word or None)
cues = [
("Five WAYS the world could end,",0.0,1.82),("and how you'd SURVIVE each one.",2.07,3.72),
("Number FIVE. Asteroid.",4.46,6.32),("NASA already proved",6.84,8.0),("it can nudge one off course,",8.0,9.6),
("so your job is simple:",9.84,11.03),("follow EVACUATION orders.",11.47,13.13),
("Number FOUR. Supervolcano.",13.75,15.74),("ASH blocks sunlight",16.26,17.45),("and crops fail.",17.45,18.48),
("Store TWO WEEKS of food and water,",18.88,20.47),("and keep masks for the ash.",20.70,22.27),
("Number THREE. Pandemic.",22.86,24.6),("Wash your hands,",25.06,26.1),("stay home when sick,",26.1,27.1),("and stay current on vaccines.",27.35,29.05),
("Number TWO. Solar superstorm.",29.66,31.97),("It can take down POWER GRIDS.",32.45,34.04),("Keep batteries, cash,",34.36,35.76),("and a paper map.",35.95,36.75),
("Number ONE. Nuclear war.",37.36,39.31),("Get INSIDE. Stay INSIDE. Stay TUNED.",39.78,42.95),
("Whatever it is, the plan is the same:",43.54,45.73),("water, food, a radio, and a plan.",46.12,48.95),("SAVE THIS.",49.39,total)]
ev = []
def ts(x): h=int(x//3600); m=int(x%3600//60); s=x%60; return f"{h}:{m:02d}:{s:05.2f}"
for c, t0, t1 in cues:
    txt = " ".join(("{\\c&H00FFFF&}%s{\\c&HFFFFFF&}" % x if x.isupper() and len(x.strip('.,'))>2 else x) for x in c.split())
    ev.append(f"Dialogue: 0,{ts(t0)},{ts(t1)},Cap,,0,0,0,,{{\\fad(60,0)}}{txt}")
hdr = f"""[Script Info]
PlayResX: {W}
PlayResY: {H}
[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Cap,DejaVu Sans,78,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,7,2,2,90,90,560,1
Style: Head,DejaVu Sans,96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,9,2,8,70,70,260,1
[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
Dialogue: 1,0:00:00.00,0:00:03.60,Head,,0,0,0,,{{\\fad(0,200)}}5 WAYS THE\\NWORLD ENDS
"""
open(f"{OUT}/captions.ass","w").write(hdr + "\n".join(ev) + "\n")
cmd = ["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",f"{OUT}/list.txt"]
if os.path.exists(vo): cmd += ["-i", vo]
cmd += ["-vf", f"ass={OUT}/captions.ass", "-c:v","libx264","-pix_fmt","yuv420p"]
if os.path.exists(vo): cmd += ["-c:a","aac","-shortest"]
cmd += [f"{OUT}/short_{'with_vo' if os.path.exists(vo) else 'silent_draft'}.mp4"]
subprocess.run(cmd, check=True); print("done", cmd[-1])
