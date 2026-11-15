---
name: shorts-council
description: Review a YouTube Short (or a plan/script for one) with a "council" of independent expert reviewers — video editor, Shorts strategist, typical viewer, and script/voice coach — then merge their feedback into one ranked list of fixes. Use when the user asks to review, critique, improve, or "run the council" on a video, script, title, or thumbnail for the Top Five Facts channel.
---

# Shorts Council

Inspired by Karpathy's "LLM Council": several reviewers answer independently, then
a chair combines them. Here the reviewers are roles, not different models.

## Inputs to gather first
1. **Frames**: a timestamped contact sheet of the video. Build one with ffmpeg, e.g.
   one frame every ~2–3 s, each labelled with its timestamp
   (`drawtext=text='<t>s'`), saved in `strategy/`.
2. **Script / voiceover text** and its timing (e.g. `src/series/<ep>.script.json`,
   `src/series/<ep>.timing.json`), plus video length.
3. **Title, description, thumbnail** if they exist.
4. **Research**: `strategy/RESEARCH.md` (what breakout Shorts in our niche do).
   Refresh it with vidIQ outliers when it is more than ~1 month old, and say what it costs.
5. **Channel results**: any analytics the user shared (views per video, viewed vs swiped).

## The council (run each reviewer independently, in parallel when possible)
Give every reviewer the same inputs and ask for: top 3 problems (with timestamps),
top 3 fixes, and a 1–10 score for their area. Reviewers must not see each other's answers.

1. **Video editor**: pacing, cuts and transitions, camera movement, text size/position,
   readability on a phone, colour, visual consistency, first frame.
2. **Shorts strategist**: hook in the first 1–2 s, retention risks (where people swipe),
   length vs. what breakout Shorts in `RESEARCH.md` do, loop ending, title/thumbnail,
   series hooks, call to action placement.
3. **Typical viewer** (scrolling on a phone, not a creator): honest gut reaction — would
   I stop scrolling? where did I get bored? would I like, comment, subscribe? why?
4. **Script & voice coach**: hook sentence, word count vs. length, wording energy,
   facts accuracy, pauses, whether visuals match what is said.

## Chair (you): merge and rank
- Combine duplicate points; note where reviewers **agree** (strong signal) or **disagree**.
- Produce **one ranked list of changes**, highest expected impact first, each with:
  what to change, why (which reviewer + evidence), and effort (quick / medium / big).
- End with a **"formula" section**: the rules this review adds to the channel's standard
  (append agreed rules to `strategy/FORMULA.md` once the user approves them).
- Keep it plain-language: the user is not a developer.

## Rules
- Check facts; never invent numbers or analytics.
- Do not change the video until the user approves the list.
