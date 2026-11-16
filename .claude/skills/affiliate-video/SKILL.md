---
name: affiliate-video
description: Full TikTok Affiliate pipeline in one go — TikTok Shop product link → 4 Model 02 photos (/anh-affiliate) → trend captions, CapCut template, commercial sound and posted video with product link (/video-affiliate). Resumable via a job.md state file. Use when the user runs /affiliate-video, asks "từ sản phẩm đến video", or "làm trọn gói affiliate".
argument-hint: <link TikTok Shop | thư mục job> [ghi chú]
---

# /affiliate-video — link TikTok Shop → video TikTok đã đăng

Orchestrates `.claude/skills/anh-affiliate/SKILL.md` and `.claude/skills/video-affiliate/SKILL.md` end to end. Do not duplicate their detail: open the referenced step and follow it. Talk to the user in Vietnamese, tersely.

## Hard rules

- Inherit the hard rules of both sub-skills. Key ones:
  - Never solve a CAPTCHA, log in, sign up or accept terms for the user; stop, say what you see, wait.
  - Never post before Checkpoint D is approved.
  - Commercial sounds only (TikTok "Âm thanh thương mại" library).
  - No invented price, discount, material, sizing or performance claims.
  - Leave the "nội dung do AI tạo" label to the user; mention it once at Checkpoint D.
  - Pinterest refs: tell the user the copyright note once per job.
  - Never fall back to CapCut AutoCut.
- Ask only at Checkpoints A–D or when blocked. Between checkpoints run without questions.

## Setup

1. Load Chrome tools in ONE ToolSearch call: `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__find,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__file_upload,mcp__claude-in-chrome__browser_batch`. Read `anthropic-skills:chrome-browser` if not loaded.
2. Load computer-use tools with ToolSearch `computer-use` (max 30) and `request_access` in ONE call for `iPhone Mirroring`, `Finder` and (read tier) `Google Chrome`.
3. Read both sub-skill files fully before starting. Inside this orchestrator, this file overrides their "Finish"/stop sections and their own checkpoint numbering (A–D here).

## State file — `job.md`

Job folder `outputs/<YYYYMMDD>-<slug>/` (slug = short ASCII kebab-case product name). Keep `job.md` there and update it after every stage:

- Fields: product link, title, current price, colour, styling, chosen pins, ChatGPT chat link, chosen caption, template, sound, post link.
- Checklist of stages 1–8 with status `todo` / `done` / `blocked: <reason>`.

Resume: if the argument is a job folder, or the link matches an existing `job.md`, read it and continue from the first non-done stage. Before skipping a done stage, verify the files it claims exist (e.g. `scene-1..4.png`, `captions.md`); if missing, redo it.

## Stages

1. **Product** — Step 1 of `.claude/skills/anh-affiliate/SKILL.md`. **Checkpoint A:** colour + crops.
2. **Scene refs** — Step 2 of anh-affiliate. **Checkpoint B:** 4 pins + styling.
3. **Images** — Step 3 of anh-affiliate. After sending each ChatGPT prompt, while waiting, do Step 1 of `.claude/skills/video-affiliate/SKILL.md` (trend scan in the TikTok app via iPhone Mirroring) between polls. Keep each Chrome poll call under ~35 s as anh-affiliate says. If interleaving causes trouble (missed image, focus conflicts), finish all images first, then scan. Output of the scan: `trend-notes.md`. Save the ChatGPT chat link to `job.md`.
4. **Captions** — Step 2 of video-affiliate. **Checkpoint C:** user picks a caption.
5. **Transfer to phone** — warn if any `scene-n.png` is not 9:16 (`sips -g pixelWidth -g pixelHeight`). Import into the Mac Photos app, one file at a time in order, into an album named after the slug:
   ```
   osascript <<'OSA'
   tell application "Photos"
     if exists album "<slug>" then
       set a to album "<slug>"
     else
       set a to make new album named "<slug>"
     end if
     repeat with p in {"/abs/job/scene-1.png", "/abs/job/scene-2.png", "/abs/job/scene-3.png", "/abs/job/scene-4.png"}
       import {(POSIX file (contents of p)) as alias} into a skip check duplicates true
       delay 1
     end repeat
   end tell
   OSA
   ```
   The first run triggers a macOS "allow Terminal to control Photos" prompt — the user clicks it; do not change privacy settings. This relies on iCloud Photos sync. On the phone (iPhone Mirroring) open Photos and check the 4 images appear in order; re-check periodically for up to ~3 minutes. If they do not (iCloud Photos off, slow sync), fall back to Setup step 3 of video-affiliate (ask the user to send them via Zalo and save to Photos) and note the fallback in `job.md`.
6. **Template + sound** — Step 3 of video-affiliate.
7. **Build + preview** — Step 4 of video-affiliate. **Checkpoint D** (= that step's Checkpoint B): user watches the preview; state template, sound, duration, caption, AI-label reminder.
8. **Post** — Step 5 of video-affiliate. Save the post link to `post.md` and `job.md`.

## Finish

Report in Vietnamese, short: job folder, post link, caption, template + sound, ChatGPT chat link, anything skipped or fallback used. Then stop.
