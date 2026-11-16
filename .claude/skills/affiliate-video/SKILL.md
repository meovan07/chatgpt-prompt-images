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

1. Load Chrome tools in ONE ToolSearch call: `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__find,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__file_upload,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__list_connected_browsers,mcp__claude-in-chrome__select_browser,mcp__claude-in-chrome__switch_browser`. Read `anthropic-skills:chrome-browser` if not loaded.
2. OS check: run `uname -s` (Darwin → `mac`; MINGW/MSYS/CYGWIN, or PowerShell `$env:OS -eq 'Windows_NT'` → `windows`; Linux or other → say "chưa hỗ trợ" and stop). Read only `.claude/skills/affiliate-video/platform/<os>.md`. Mac: computer-use access → platform file, `## Phone access`. Windows: load computer-use (ToolSearch `computer-use`, max 30) if available, for CapCut desktop. Ask the user once: phone `iphone|android` (Windows) and post route `phone|web` (Windows).
3. Read both sub-skill files fully before starting. If the skill isn't found in a worktree session, read skills from the main repo root's `.claude/skills/`. Inside this orchestrator, this file overrides their "Finish"/stop sections and their own checkpoint numbering (A–D here).

## State file — `job.md`

Job folder `outputs/<YYYYMMDD>-<slug>/` (slug = short ASCII kebab-case product name). Keep `job.md` there and update it after every stage:

- Fields: platform (`mac|windows`), phone (`iphone|android`), post route (`phone|web`), product link, title, current price, colour, styling, chosen pins, ChatGPT chat link, Chrome profile used for ChatGPT, chosen caption, template, sound, transfer method, post link. Record as `Platform`, `Phone`, `Post route`.
- Checklist of stages 1–8 with status `todo` / `done` / `blocked: <reason>`.

Resume: if the argument is a job folder, or the link matches an existing `job.md`, read it and continue from the first non-done stage. Before skipping a done stage, verify the files it claims exist (e.g. `scene-1..4.png`, `captions.md`); if missing, redo it.

## Stages

1. **Product** — Step 1 of `.claude/skills/anh-affiliate/SKILL.md`. **Checkpoint A:** colour + crops.
2. **Scene refs** — Step 2 of anh-affiliate. **Checkpoint B:** 4 pins + styling.
3. **Images** — Step 3 of anh-affiliate. After sending each ChatGPT prompt, while waiting, do Step 1 of `.claude/skills/video-affiliate/SKILL.md` (trend scan on TikTok web) between polls. Keep each Chrome poll call under ~35 s as anh-affiliate says. If interleaving causes trouble (missed image, focus conflicts), finish all images first, then scan. Output of the scan: `trend-notes.md`. Save the ChatGPT chat link to `job.md`.
4. **Captions** — Step 2 of video-affiliate. **Checkpoint C:** user picks a caption.
5. **Transfer to phone** — → platform file, `## Transfer to phone` (9:16 check, import/transfer, fallbacks). Windows: only the 9:16 check here; the mp4 moves at Stage 8 (Post section) if the post route is `phone`. Note the method and any fallback in `job.md`.
6. **Template + sound** — Step 3 of video-affiliate.
7. **Build + preview** — Step 4 of video-affiliate. **Checkpoint D** (= that step's Checkpoint B): user watches the preview; state template, sound, duration, slot durations, caption, the platform sound check (Mac: "Gốc = 0 verified"; Windows: track to add), AI-label reminder.
8. **Post** — Step 5 of video-affiliate. Save the post link to `post.md` and `job.md`.

## Finish

Report in Vietnamese, short: job folder, post link, caption, template + sound, ChatGPT chat link, anything skipped or fallback used. Then stop.
