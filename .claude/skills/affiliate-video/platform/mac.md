# Platform: macOS

Used by `/anh-affiliate`, `/video-affiliate`, `/affiliate-video` when `uname -s` = Darwin. Read only this file on Mac.

## Clipboard

- Paste a prompt file: `LANG=en_US.UTF-8 pbcopy < file` (without the UTF-8 locale Vietnamese/dashes get garbled), then `cmd+v`.
- Read the phone's clipboard (post link) with `pbpaste`, retrying a few times over ~10 s (Universal Clipboard is slow).

## Image ops

- Crop: `sips -c <h> <w> --cropOffset <y> <x>` (offset x must be ≥1).
- Size check: `sips -g pixelWidth -g pixelHeight`.
- JPEG convert: `sips -s format jpeg -s formatOptions 85` (e.g. recreate pack files from `public/model-02/*.png`).

## Downloads

- Move the saved file from `~/Downloads` to `scene-<n>.png` in the job folder.

## Phone access

- Load computer-use tools with ToolSearch `computer-use` (max 30) and `request_access` for `iPhone Mirroring`, `Finder` and (read tier) `Google Chrome` in one call. Prefer background `app_*` tools.
- iPhone Mirroring (`com.apple.ScreenContinuity`) quirks:
  - Locked phone: ask the user to unlock (needs the Mac password; never type it).
  - The screen lags ~5 s: wait 5–8 s after each action and re-screenshot before the next tap. A lagged tap can become a long-press (home screen jiggle mode): exit it, nothing is deleted.
  - Swipes/scroll often don't register in background `app_*` mode: use thumbnail rows / tabs instead.
  - Typing needs full control (`request_full_control`); release it right after. Other apps (e.g. Slack) can jump in front then: switch back to background taps.
  - Vietnamese diacritics don't type: type the keyword without diacritics.
  - Close upsell popups (CapCut Ultra etc.) without buying.

## TikTok read

- TikTok web in Chrome first. Only when web is blocked (login wall `waf_force_login`, user can't sign in) use the **TikTok app via iPhone Mirroring**: tap the product, open the gallery, `app_zoom` the image region at scale 1. The zoom result is a JPEG under the session's `tool-results/` folder — copy it to `source-collage.jpg` in the job folder. Read title and **current price** from the product page (prices shown on cards may be voucher prices).

## Trend scan

- TikTok web first (3 keywords, 5–10 videos with product link, record views). Fallback via mirroring: search in the TikTok app; you usually can't scroll or open individual videos: read ~4 top videos per keyword from the result grid (captions truncated, likes only, no views). Note the grid-only limitation in `trend-notes.md`.

## Transfer to phone

- Warn if any `scene-n.png` is not 9:16 (size check above). Import into the Mac Photos app, one file at a time in order, into an album named after the slug:
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
- The first run triggers a macOS "allow Terminal to control Photos" prompt — the user clicks it; do not change privacy settings. This relies on iCloud Photos sync. Right after import, open Photos on the phone (iPhone Mirroring). If it shows "Syncing with iCloud Paused" (Low Power / Low Data mode), don't wait: tell the user (they can turn off Low Power Mode) or go straight to the Zalo fallback; never change phone settings yourself. Otherwise check the 4 images appear in order, re-checking for up to ~3 minutes.
- Zalo fallback: `open -R scene-1.png` to reveal the folder, tell the user to send only scene-1..4 (not `*-v1-*` rejected versions) and save them in order 1→4. Note the fallback in `job.md`.
- If the 4 scene images are not in the phone's Photos, say so and ask the user to send them to the phone (e.g. via Zalo, then save each to Photos). Wait until they are there.

## Build video

- In CapCut (phone, via mirroring) open Templates and search keywords in order: `ootd`, `outfit`, `4 ảnh`, then the product category. Collect 3 candidates that take exactly 4 photos, highest usage count first. Free templates only: reject any template whose Export or card shows the "Standard"/paid label or an "Unlock for …đ" prompt (never pay); the Type filter can't filter free. If a paid template was already filled, Save it as draft.
- Reject immediately any template with stickers/hearts/sparkle overlays or with fixed baked-in text. Template sounds are often "Unknown"; don't require them to exist in the commercial library. Always replace the sound with a commercial one in TikTok.
- Static previews can't show baked-in text: fill the 4 photos and inspect the rendered preview (sample 3–4 frames). If no candidate passes, search the next keyword. After all keywords fail, stop and report — do not fall back to AutoCut. Record candidates, verdicts and slot durations in `template-notes.md` (they can be very uneven, e.g. 1.9/1.7/1.7/13.6 s).
- Use the first passing template. Select `scene-1..4` in order and verify exactly these 4 are selected (a previous run picked a stray photo).
- Export via "Save and share to TikTok" (no watermark). In TikTok replace the auto-selected sound with a commercial sound ("Âm thanh thương mại"; the auto-picked one is usually not commercial, and the product link ("Sản phẩm") stays locked until a commercial sound is chosen). Check the cuts still land on the beat.
- Then open Volume ("Âm lượng"): set original sound ("Gốc") to 0, keep the added sound at 100. Play the preview and confirm only one music track (a real run was posted with double sound). Checkpoint B line: "Gốc = 0 verified".
- The user watches the preview on the mirrored phone.

## Post

- Paste the caption via clipboard and verify Vietnamese diacritics after pasting.
- Attach the product: "Thêm liên kết" → product. In the showcase search use the exact product name and pick the result matching shop + price. If search doesn't accept typing through iPhone Mirroring, use "Thêm sản phẩm khác" and paste the product link instead.
- TikTok requires a display name; if it flags a banned word, use a shorter factual name (e.g. "Áo 2 dây hở lưng") and tell the user. If the price on the rename page differs from the search/product page price, report both to the user.
- Attaching the product before pasting the caption is fine. Before tapping Đăng re-check the product is still attached, the visibility, and "Gốc = 0".
- Post, then Share → Copy link and read the Mac clipboard with `pbpaste` (see Clipboard). Save the post link to `post.md` in the job folder (and `job.md`).
- If the posted video is wrong (e.g. double sound): TikTok can't edit audio after posting. Report and ask the user before deleting (irreversible): options are delete + repost, or set "Chỉ mình tôi". Never delete without explicit approval. Record the outcome in `post.md` / `job.md`.
