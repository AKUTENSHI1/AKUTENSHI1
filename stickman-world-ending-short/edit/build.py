#!/usr/bin/env python3
"""Assemble the Short: Ken Burns on 7 stills + ASS captions (+ voiceover if present).
Caption timings are ESTIMATED (character-weighted) until real word timings exist.
Usage: python3 build.py [voiceover_seconds]"""
import subprocess, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = f"{ROOT}/assets"; OUT = f"{ROOT}/out"; os.makedirs(OUT, exist_ok=True)
vo = f"{A}/voiceover.mp3"
total = float(sys.argv[1]) if len(sys.argv) > 1 else 50.24
# scene share of runtime (hook, #5, #4, #3, #2, #1, close)
shares = [4.5, 8, 9, 7, 7.5, 6.5, 7.7]
scale = total / sum(shares); durs = [s * scale for s in shares]
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
cues = ["Five WAYS the world could end,","and how you'd SURVIVE each one.","Number FIVE. Asteroid.","NASA already proved","it can nudge one off course,","so your job is simple:","follow EVACUATION orders.",
"Number FOUR. Supervolcano.","ASH blocks sunlight","and crops fail.","Store TWO WEEKS of food and water,","and keep masks for the ash.",
"Number THREE. Pandemic.","Wash your hands,","stay home when sick,","and stay current on vaccines.",
"Number TWO. Solar superstorm.","It can take down POWER GRIDS.","Keep batteries, cash,","and a paper map.",
"Number ONE. Nuclear war.","Get INSIDE. Stay INSIDE. Stay TUNED.","Whatever it is, the plan is the same:","water, food, a radio, and a plan.","SAVE THIS."]
wts = [len(c)+6 for c in cues]; t = 0.0; ev = []
def ts(x): h=int(x//3600); m=int(x%3600//60); s=x%60; return f"{h}:{m:02d}:{s:05.2f}"
for c, w in zip(cues, wts):
    d = total * w / sum(wts)
    txt = " ".join(("{\\c&H00FFFF&}%s{\\c&HFFFFFF&}" % x if x.isupper() and len(x.strip('.,'))>2 else x) for x in c.split())
    ev.append(f"Dialogue: 0,{ts(t)},{ts(t+d)},Cap,,0,0,0,,{{\\fad(60,0)}}{txt}")
    t += d
hdr = f"""[Script Info]
PlayResX: {W}
PlayResY: {H}
[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Cap,DejaVu Sans,78,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,7,2,2,90,90,560,1
Style: Head,DejaVu Sans,96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,9,2,8,70,70,260,1
[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
Dialogue: 1,0:00:00.00,0:00:03.20,Head,,0,0,0,,{{\\fad(0,200)}}5 WAYS THE\\NWORLD ENDS
"""
open(f"{OUT}/captions.ass","w").write(hdr + "\n".join(ev) + "\n")
cmd = ["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",f"{OUT}/list.txt"]
if os.path.exists(vo): cmd += ["-i", vo]
cmd += ["-vf", f"ass={OUT}/captions.ass", "-c:v","libx264","-pix_fmt","yuv420p"]
if os.path.exists(vo): cmd += ["-c:a","aac","-shortest"]
cmd += [f"{OUT}/short_{'with_vo' if os.path.exists(vo) else 'silent_draft'}.mp4"]
subprocess.run(cmd, check=True); print("done", cmd[-1])
