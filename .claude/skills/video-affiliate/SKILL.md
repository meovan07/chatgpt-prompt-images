---
name: video-affiliate
description: Turn a finished /anh-affiliate job folder (4 scene images + TikTok Shop link) into a posted TikTok affiliate video — scan trending videos for caption patterns, write 3 trend-based captions, build with a free 4-photo CapCut template (phone on Mac, CapCut desktop on Windows) and a commercial sound, preview, then post with the product link. Replaces the old CapCut AutoCut flow. Use when the user runs /video-affiliate, asks to "dựng video affiliate", or wants to post the images from /anh-affiliate.
argument-hint: <thư mục job hoặc link TikTok Shop> [ghi chú]
---

# /video-affiliate — 4 ảnh Model 02 → video TikTok có caption trend + link sản phẩm

No API keys, no deploy. Runs on TikTok + CapCut: phone via the platform file on Mac, CapCut desktop on Windows. Talk to the user in Vietnamese, tersely. The old AutoCut flow looked like a slideshow, had cheesy effects and was off-beat — never fall back to it.

When invoked from `/affiliate-video`, follow that file's checkpoints and `job.md` state file, and skip this skill's Finish/stop.

## Hard rules

- Never solve a CAPTCHA, log in, sign up or accept terms for the user. On any of these: stop, say what you see, wait.
- Never post before Checkpoint B is approved. Ask only at Checkpoint A and B, or when blocked (missing images, login wall, no passing template).
- Only commercial sounds (TikTok "Âm thanh thương mại" library), because the post carries a product link.
- Do not invent price, discount, material, sizing or performance claims in captions.
- Leave the "AI-generated content" label toggle on the post screen exactly as the user has it; never add steps to hide or avoid the label. Mention it once at Checkpoint B so the user can set it themself.
- Do not copy another creator's caption verbatim; borrow the sentence pattern only.

## Setup

0. OS check: run `uname -s` (Darwin → `mac`; MINGW/MSYS/CYGWIN, or PowerShell `$env:OS -eq 'Windows_NT'` → `windows`; Linux or other → say "chưa hỗ trợ" and stop). Read only `.claude/skills/affiliate-video/platform/<os>.md`.
1. Load computer-use tools with ToolSearch `computer-use` (max 30) if available (needed for CapCut desktop on Windows). Phone access and quirks: → platform file, `## Phone access`.
2. Job folder: argument if given, else the newest folder under `outputs/` — confirm the name in one line. It must hold `scene-1..4.png`, the product title and the TikTok Shop link.
3. Mac: the 4 scene images must be in the phone's Photos (→ platform file, `## Transfer to phone`); wait until they are. Windows: images stay on the PC for CapCut desktop; only the final mp4 moves, at Step 5 if the post route is `phone`.

## Step 1 — Trend scan

- On TikTok web (Chrome) search 3 keywords in Vietnamese: product name, category (e.g. `áo sơ mi nữ`), and a feature (e.g. `hở lưng`). Scroll and open the 5–10 most-viewed recent videos that carry a product link. Web blocked: → platform file, `## Trend scan`.
- Record for each: caption text, hashtags, view count (or likes), sentence pattern (meme line, POV, complaint, question…).
- Save to `trend-notes.md` in the job folder. End the file with the 2–3 patterns that repeat.

## Step 2 — Captions (Checkpoint A)

- Fill `prompts/caption-trend.txt` (this skill's folder) from the job and `trend-notes.md`, then write 3 captions yourself from it. Each uses a different repeating trend/meme pattern with the product worked in.
- Lowercase everyday Vietnamese, one short line, no call-to-action, no ad voice, 0–1 emoji, 3–5 hashtags taken from the scanned videos (no generic viral stuffing). Save as `captions.md`.
- **Checkpoint A:** show the 3 captions with the trend each one borrows; user picks one (or edits).

## Step 3 — Template

- Template or timeline build, free-only and reject rules, sound replacement: → platform file, `## Build video`.
- If no candidate passes after all keywords, stop and report — do not fall back to AutoCut. Record candidates, verdicts and slot durations in `template-notes.md`.

## Step 4 — Build and preview (Checkpoint B)

- Build, export and sound/volume handling: → platform file, `## Build video`. Confirm exactly one music track (a real run was posted with double sound); on Windows the mp4 must have no audio at all.
- **Checkpoint B:** user watches the preview. State template name, sound, duration, slot durations if uneven, chosen caption, the platform's sound check (Mac: "Gốc = 0 verified" per platform file; Windows: the track to add when posting), and remind once that the "nội dung do AI tạo" label is theirs to set on the post screen. If rejected, try the next passing template — at most 3 attempts, then stop and ask.

## Step 5 — Post

- Caption, product attach, display-name and price checks, copy link, re-check before Đăng, wrong-video delete rule: → platform file, `## Post`. On Windows the user clicks Đăng, never Claude.
- Save the post link to `post.md` in the job folder (and `job.md`). If the posted video is wrong, ask the user before any deletion (irreversible); never delete without explicit approval.

## Finish

Report in Vietnamese, short: post link, caption used, template + sound, anything skipped. Then stop.
