# Platform: Windows

Used by `/anh-affiliate`, `/video-affiliate`, `/affiliate-video` when on Windows (PowerShell). Read only this file on Windows. Items marked "(unverified)" are open questions to settle in the first real Windows job.

## Clipboard

- Paste a prompt file: `Get-Content -Raw -Encoding UTF8 file | Set-Clipboard`, then `ctrl+v`.
- Read the clipboard (post link): `Get-Clipboard`.

## Image ops

- Prerequisite: the user installs ImageMagick once with `winget install ImageMagick.ImageMagick` (never install it for them). Check `magick -version`; if missing, ask the user and wait.
- Crop: `magick in.jpg -crop WxH+X+Y +repage out.jpg`.
- Size check: `magick identify -format "%wx%h" f`.
- JPEG convert: `magick in.png -quality 85 out.jpg`.

## Downloads

- Set the `<a download>` filename (e.g. `scene-<n>-aff.png`), then `Move-Item "$HOME\Downloads\scene-<n>-aff.png" scene-<n>.png`. The download may lag: loop `Test-Path` every 2 s up to ~30 s. If the name differs, take the newest file: `Get-ChildItem $HOME\Downloads | Sort-Object LastWriteTime -Desc | Select-Object -First 1`.

## Phone access

- No phone screen control on Windows. The phone is an iPhone or an Android; ask which at Setup and record it as `Phone` in `job.md`.
- Android, optional: needs Android platform-tools (`winget install Google.PlatformTools`, the user installs), USB debugging on, and the RSA prompt accepted on the phone. If `adb` is not found, or `adb devices` shows 0 devices or `unauthorized`, use Zalo.

## TikTok read

- TikTok web in Chrome, signed in by the user. On a login wall (`waf_force_login`) ask the user to sign in in Chrome (never do it for them) and wait. Read title and **current price** from the product page. Product images: read the gallery `img` URLs with `javascript_tool` and download them (`Invoke-WebRequest -Uri <url> -OutFile source-<n>.jpg`), then crop `product-1.jpg` / `product-2.jpg` from them.
- Fallback: the user screenshots the product page into chat.

## Trend scan

- TikTok web, 3 keywords in Vietnamese (product name, category, a feature). Scroll the results, open 5–10 videos that carry a product link, record caption, hashtags, view count and sentence pattern in `trend-notes.md` (search behaves like the app, views shown: unverified).
- Web blocked (login wall the user can't clear): no phone fallback on Windows. Ask the user for 3–5 caption examples from their TikTok app, or skip the scan and write captions from the product only; note it in `trend-notes.md`.

## Transfer to phone

- Stage 5 (images): only warn if any `scene-n.png` is not 9:16 (size check above); scene images stay on the PC for CapCut desktop.
- Post step (route `phone`): move `video.mp4` (exists only after Build video); never send `*-v1-*` rejected versions.
- iPhone (and Android without adb): Zalo PC → "Cloud của tôi", send the file, tell the user to open Zalo on the phone and save it to Photos.
- Android: `adb push video.mp4 /sdcard/DCIM/Camera/`, then `adb shell am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d file:///sdcard/DCIM/Camera/video.mp4`. If adb is not usable (see Phone access), use the Zalo steps above and tell the user.
- Note the method used in `job.md`.

## Build video

- Sound first: pick a commercial track in TikTok "Âm thanh thương mại"; note its name and ask the user to check it on phone/web.
- Drive CapCut desktop with Claude desktop computer use (load computer-use if available; available on this Windows machine: unverified).
- Templates: if a free template takes exactly 4 photos with no baked-in text and no stickers, use it (Templates tab on CapCut desktop VN: unverified). Otherwise build on the timeline: the 4 photos in order, cuts on the track's beats (CapCut beat marks if the track exists in CapCut: unverified; otherwise even cuts and note it), light transitions only, no stickers/text.
- Export the mp4 WITHOUT audio (mute / turn off audio in the export settings). Check with `ffprobe` if present (no audio stream). Save as `video.mp4` in the job folder.
- No computer use: print step-by-step instructions (photo order, cut times in seconds, export without audio) and wait for the user.
- Checkpoint B: state the track name to add when posting; the user watches the mp4.

## Post

- The user chooses per job: "phone" or "web" (TikTok Studio); record as `Post route` in `job.md`.
- phone: transfer the mp4 (see Transfer to phone). Give the caption, product link and track name as copy-ready text. The user adds the commercial track (the only audio, so no double sound), attaches the product (banned-word display name or price mismatch: tell the user to use a shorter factual name and compare prices), and posts.
- web: upload the mp4 in TikTok Studio, paste the caption. If it can't pick the commercial sound or attach the product (unverified), switch to phone and note it in `job.md`.
- Claude never clicks Đăng/Post on Windows; the user does, after Checkpoint D. Ask the user to paste the post link back and save it to `post.md` / `job.md`.
- If the posted video is wrong: report and ask the user; deleting is theirs to do.
