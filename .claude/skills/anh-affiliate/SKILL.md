---
name: anh-affiliate
description: Turn a TikTok Shop product link into 4 Model 02 lifestyle photos for TikTok Affiliate — read the product (TikTok web in Chrome, phone app as fallback on Mac), pick Vietnamese Pinterest scene references, and generate scene-locked images on ChatGPT web, saved under outputs/. Stops once the images are saved (no captions, no sending, no posting). Use when the user runs /anh-affiliate, pastes a TikTok Shop link and asks for affiliate images, or asks to "tạo ảnh affiliate" for a product.
argument-hint: <link TikTok Shop> [ghi chú]
---

# /anh-affiliate — link TikTok Shop → 4 ảnh Model 02

No API keys, no deploy. Runs in the user's own Chrome (Claude in Chrome) with their own ChatGPT login, plus the platform file's phone fallback when TikTok web blocks. Talk to the user in Vietnamese, tersely. **The workflow ends when the images are saved and reported** — do not write captions, message anyone or post anything unless the user asks separately.

When invoked from `/affiliate-video`, follow that file's checkpoints and `job.md` state file, and skip this skill's Finish/stop.

## Hard rules

- Never solve a CAPTCHA, log in, sign up or accept terms for the user. On a captcha or login wall: stop, say what you see, wait. On a ChatGPT usage limit: see Step 3.
- Pinterest scene references are uploaded to ChatGPT only to lock scene and pose; the person is always fully replaced by Model 02, and readable text/logos/watermarks are removed. Tell the user once per job that results closely follow someone else's photo (copyright risk on very viral pins) and that their own location photos are the safest source.
- Ask only at Checkpoint A and B. After B, run to the end without questions unless blocked.

## Setup

0. OS check: run `uname -s` (Darwin → `mac`; MINGW/MSYS/CYGWIN, or PowerShell `$env:OS -eq 'Windows_NT'` → `windows`; Linux or other → say "chưa hỗ trợ" and stop). Read only `.claude/skills/affiliate-video/platform/<os>.md`.
1. Load Chrome tools in ONE ToolSearch call: `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__find,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__file_upload,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__list_connected_browsers,mcp__claude-in-chrome__select_browser,mcp__claude-in-chrome__switch_browser`. Read `anthropic-skills:chrome-browser` if not loaded. Work in new tabs.
2. Phone/computer-use access: → platform file, `## Phone access`.
3. Job folder: `outputs/<YYYYMMDD>-<slug>/` (gitignored), slug = short ASCII kebab-case product name. The Model 02 pack lives at `outputs/model-02-reference-pack/` under the main repo root; inside a git worktree find the root with `git rev-parse --path-format=absolute --git-common-dir` (its parent). Copy `upload/*.jpg` into `<job>/model-02/` and upload from there (`file_upload` only accepts files inside the working directory).

## Step 1 — Product (Checkpoint A)

- Open the link in Chrome. TikTok web usually bounces to a login wall (`waf_force_login`); then ask the user to sign in in Chrome (Windows) or use the fallback in → platform file, `## TikTok read`. Read title and **current price** from the product page (prices shown on cards may be voucher prices).
- Crop (→ platform file, `## Image ops`): `product-1.jpg` = cleanest garment-only shot (last upload = exact product), `product-2.jpg` = worn shot without the face (fit reference).
- **Checkpoint A:** show title, price, colours, the two crops you plan; ask which colour and OK to save.

## Step 2 — Vietnamese scene references (Checkpoint B)

- Pinterest search in Chrome with Vietnamese queries that include Vietnamese people and local scenes, e.g. `gái việt ootd <sản phẩm> đi cafe sống ảo`. English lookbook queries return dry Western editorial shots — avoid.
- Most reliable on any OS: read the pin image URLs from the page with `javascript_tool` (`img[src*="i.pinimg.com"]`, upgrade the size segment to `736x`) and download them into the job folder (curl / `Invoke-WebRequest`), then `Read` each. On Mac, alternatively: the extension often cannot screenshot Pinterest; use read-tier `app_screenshot` of the Chrome window (the Pinterest tab must be the frontmost tab — navigate the front tab if needed) and `app_zoom` each candidate pin **at scale 1 in the same turn as the screenshot** (the masonry grid reflows on lazy load; re-zooms later hit other pins).
- Pick 6 candid photos with real foreground/background depth, Vietnamese people, product-like outfit, no text overlays. List them with one Vietnamese line each and recommend 4 different scenes (standing full-body hero, sitting café, street walk/hold drink, sidewalk café…).
- **Checkpoint B:** user picks 4 pins + styling (default: light-wash wide-leg jeans, white sneakers). Save the chosen images (downloads or zooms) as `refs/vn-<n>-<scene>.jpg`; crop off watermarks/usernames.

## Step 3 — Generate 4 images on ChatGPT

- Fill `prompts/scene-lock-first.txt` (this skill's folder): `{{COLOR_LINE}}` (e.g. `: use ONLY the WHITE shirt`), `{{PRODUCT_NOTE}}` (≤40 words, factual: fabric, collar, sleeves, fit), `{{STYLING}}`. Save as `prompt-scene-lock-1.txt` in the job folder; fill `prompts/scene-lock-next.txt` the same way as `prompt-scene-lock-next.txt`.
- New chat at `https://chatgpt.com/`. `file_upload` to the "Attach photos" input, in order (under 10 MB): `<job>/model-02/{turnaround,face,angles-000-045,angles-050-090,angles-140-180,head-pose,camera-angles}.jpg` (copied from the pack, Setup step 3; recreate from `public/model-02/*.png` as JPEG (→ platform file, `## Image ops`) if missing), then `product-2.jpg`, `product-1.jpg`, `refs/vn-1-*.jpg` — 10 files. `file_upload` keeps only one file per call: upload each file in its own call, in order, then verify the attachment count is 10.
- If ChatGPT shows "limit for file attachments" or another usage limit: first try another Chrome profile signed in to ChatGPT (`list_connected_browsers` / `select_browser` / `switch_browser`) before telling the user to wait. Record the profile used in `job.md` (orchestrator) and the report.
- Paste the prompt via clipboard (→ platform file, `## Clipboard`; UTF-8 or Vietnamese/dashes get garbled), clear the composer (`[contenteditable="true"]` → `execCommand('selectAll')` + `delete`), paste, then verify length, first words and attachment count before clicking `[data-testid="send-button"]`.
- Poll in `javascript_tool` calls that each return within ~35 s (CDP times out at 45 s): remember all `main img` srcs before sending; done when a new `img` with `naturalWidth > 800`, not a user attachment, appears and no `[data-testid="stop-button"]`. Save via `fetch(src)` → blob → temporary `<a download>`; move the download to `scene-<n>.png` (→ platform file, `## Downloads`); check md5 differs from previous images; `Read` it (Model 02 face, exact product, scene matches ref; garment type, straps and neckline match the product, not the reference's top). If ChatGPT offers two options, save both, do not vote.
- Images 2–4: same chat, upload only `refs/vn-<n>-*.jpg`, paste `prompt-scene-lock-next.txt`, send, save. One correction retry per image at most.
- Keep the job's text-only fallback (`node scripts/build-prompt.ts` with `"model": "02"`) for products with no usable reference photos.

## Finish

Report in Vietnamese, short: job folder, the 4 saved images (note any aspect ratio other than 9:16 or visible issues), ChatGPT chat link, and the next step: run `/video-affiliate` on the job folder for caption, template, sound and posting (or `/affiliate-video` for the one-shot flow). Then stop.
