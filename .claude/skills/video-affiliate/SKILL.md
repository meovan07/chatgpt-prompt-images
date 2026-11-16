---
name: video-affiliate
description: Turn a finished /anh-affiliate job folder (4 scene images + TikTok Shop link) into a posted TikTok affiliate video — scan trending videos for caption patterns, write 3 trend-based captions, pick a hand-chosen CapCut template that takes 4 photos with a commercial sound, preview on the phone, then post with the product link. Replaces the old CapCut AutoCut flow. Use when the user runs /video-affiliate, asks to "dựng video affiliate", or wants to post the images from /anh-affiliate.
argument-hint: <thư mục job hoặc link TikTok Shop> [ghi chú]
---

# /video-affiliate — 4 ảnh Model 02 → video TikTok có caption trend + link sản phẩm

No API keys, no deploy. Runs on the user's phone (TikTok + CapCut) through iPhone Mirroring. Talk to the user in Vietnamese, tersely. The old AutoCut flow looked like a slideshow, had cheesy effects and was off-beat — never fall back to it.

When invoked from `/affiliate-video`, follow that file's checkpoints and `job.md` state file, and skip this skill's Finish/stop.

## Hard rules

- Never solve a CAPTCHA, log in, sign up or accept terms for the user. On any of these: stop, say what you see, wait.
- Never post before Checkpoint B is approved. Ask only at Checkpoint A and B, or when blocked (missing images, login wall, no passing template).
- Only commercial sounds (TikTok "Âm thanh thương mại" library), because the post carries a product link.
- Do not invent price, discount, material, sizing or performance claims in captions.
- Leave the "AI-generated content" label toggle on the post screen exactly as the user has it; never add steps to hide or avoid the label. Mention it once at Checkpoint B so the user can set it themself.
- Do not copy another creator's caption verbatim; borrow the sentence pattern only.

## Setup

1. Load computer-use tools with ToolSearch `computer-use` (max 30) and `request_access` for `iPhone Mirroring` (and `Finder`) in one call. Prefer background `app_*` tools.
2. Job folder: argument if given, else the newest folder under `outputs/` — confirm the name in one line. It must hold `scene-1..4.png`, the product title and the TikTok Shop link.
3. If the 4 scene images are not in the phone's Photos, say so and ask the user to send them to the phone (e.g. via Zalo, then save each to Photos). Wait until they are there.

## Step 1 — Trend scan

- In the TikTok app search the product category in Vietnamese (e.g. `áo sơ mi nữ`). Open the 5–10 most-viewed recent videos that carry a product link.
- Record for each: caption text, hashtags, view count, sentence pattern (meme line, POV, complaint, question…).
- Save to `trend-notes.md` in the job folder. End the file with the 2–3 patterns that repeat.

## Step 2 — Captions (Checkpoint A)

- Fill `prompts/caption-trend.txt` (this skill's folder) from the job and `trend-notes.md`, then write 3 captions yourself from it. Each uses a different repeating trend/meme pattern with the product worked in.
- Lowercase everyday Vietnamese, one short line, no call-to-action, no ad voice, 0–1 emoji, 3–5 hashtags taken from the scanned videos (no generic viral stuffing). Save as `captions.md`.
- **Checkpoint A:** show the 3 captions with the trend each one borrows; user picks one (or edits).

## Step 3 — Template

- In CapCut open Templates and search keywords in order: `ootd`, `outfit`, `4 ảnh`, then the product category. Collect 3 candidates that take exactly 4 photos, highest usage count first.
- Reject immediately any template with stickers/hearts/sparkle overlays or with fixed baked-in text.
- For each candidate note the sound name and check it exists in TikTok's commercial sound library (TikTok editor → sound → switch the "Âm thanh ▾" dropdown to commercial → search the name). If not found, drop the template.
- If no candidate passes, search the next keyword. After all keywords fail, stop and report — do not fall back to AutoCut.
- Record candidates and verdicts in `template-notes.md`.

## Step 4 — Build and preview (Checkpoint B)

- Use the first passing template. Select `scene-1..4` in order and verify exactly these 4 are selected (a previous run picked a stray photo).
- Export to TikTok, replace the auto-selected user sound with the matching commercial sound, check the cuts still land on the beat.
- **Checkpoint B:** user watches the preview on the mirrored phone. State template name, sound, duration, chosen caption, and remind once that the "nội dung do AI tạo" label is theirs to set on the post screen. If rejected, try the next passing template — at most 3 attempts, then stop and ask.

## Step 5 — Post

- Paste the caption via clipboard and verify Vietnamese diacritics after pasting.
- Attach the product: "Thêm liên kết" → product. The showcase search box may not accept typing through iPhone Mirroring; then use "Thêm sản phẩm khác" and paste the product link instead.
- Post, then save the post link to `post.md` in the job folder.

## Finish

Report in Vietnamese, short: post link, caption used, template + sound, anything skipped. Then stop.
