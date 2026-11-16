# Plan (lite): affiliate skills run on Windows as well as Mac

Mode: lite
Status: done (pending Windows test run, R11)
Approved: 2026-11-16
Branch: claude/skill-update-product-video-workflow-83a8db
Priority: medium (lite chosen by the user on 2026-11-16: docs-only change, decisions already grilled in `analysis.md`)

## Goal

`/affiliate-video` can take one TikTok Shop link to a posted video on a Windows PC (iPhone or Android) without any Mac-only tool. Done when: a fresh reader following only the skill files on Windows hits zero `osascript` / `sips` / `pbcopy` / `pbpaste` / iPhone Mirroring steps, and one real Windows job reaches a posted video with product link (R11 in `analysis.md`, run after this MR).

## Requirements

- R1. Each skill detects the OS at Setup and loads exactly one platform file.
  - Given Windows, when Setup runs, then it reads `platform/windows.md` and never `platform/mac.md`; given macOS, the reverse.
  - Boundary: OS unknown (Linux) -> say "chưa hỗ trợ" and stop before Stage 1.
- R2. No Mac-only command appears in the shared SKILL.md bodies; every one lives in `platform/mac.md` with its Windows equivalent in `platform/windows.md`.
  - Given the three SKILL.md files, when grepping for `osascript|sips|pbcopy|pbpaste|iPhone Mirroring|ScreenContinuity`, then 0 hits outside a "see platform file" pointer.
  - Windows equivalents: `Set-Clipboard`/`Get-Clipboard` (UTF-8), `magick` for crop/size/jpeg, PowerShell `Move-Item` from `$HOME\Downloads`.
- R3. Product read and trend scan use TikTok web in Chrome first on both OSes; iPhone Mirroring is the Mac-only fallback when web is blocked.
  - Given a signed-in TikTok in Chrome, when Step 1 runs, then title + current price come from the web page; given `waf_force_login` on Windows, then ask the user to sign in in Chrome (never do it for them) and wait.
  - Trend scan: 3 keywords, 5–10 videos with product link, scroll and open videos on web; record views when shown.
- R4. Windows video build uses CapCut desktop via computer use; no free 4-photo template -> build on the timeline to the beat.
  - Given a free template that takes exactly 4 photos with no baked-in text, when Step 3 runs on Windows, then use it; given none after all keywords, then build: 4 photos in order, cuts on the chosen track's beats, light transitions only, no stickers/text.
  - Given computer use is not available, then print step-by-step instructions (photo order, cut times in seconds) and wait for the user.
- R5. Windows export is silent; the commercial sound is added when posting.
  - Given the chosen track from "Âm thanh thương mại", when exporting from CapCut desktop, then the mp4 has no audio stream (check with the export setting or `ffprobe` if present), and Checkpoint B states the track name to add.
- R6. Windows posting is manual and chosen per job: phone app or TikTok Studio web.
  - Given "phone", then move the mp4 to the phone (R7) and give the caption + product link as copy-ready text; given "web", then upload in TikTok Studio; if it can't pick a commercial sound or attach the product, then switch to "phone" and note it in `job.md`.
  - Claude never clicks "Đăng"/"Post" on Windows; the user does, after Checkpoint D.
- R7. File transfer on Windows: iPhone -> Zalo PC "Cloud của tôi"; Android -> `adb push` to `/sdcard/DCIM/Camera/` then media scan, fallback Zalo.
  - Given Android with `adb devices` listing one device, then push `scene-1..4.png` (or the mp4) in order; given 0 devices or `unauthorized`, then fall back to Zalo and tell the user.
- R8. Mac behaviour is unchanged except R3 (web first); CapCut mobile templates via iPhone Mirroring stay the Mac default.
  - Given macOS, when running Stages 5–8, then the steps match the current `video-affiliate` Steps 3–5 (incl. "Gốc = 0").
- R9. `job.md` records the platform, posting route and transfer method.
  - Given a Windows job, then `job.md` has `Platform: windows`, `Phone: iphone|android`, `Post route: phone|web`.

## Approach

Add two shared platform files under `.claude/skills/affiliate-video/platform/` (`mac.md`, `windows.md`) holding every OS-specific command and phone/video step, keyed by the same section names (Clipboard, Image ops, Downloads, TikTok read, Trend scan, Transfer, Build video, Post). The three SKILL.md files keep the shared flow and point to "the platform file's <section>". Why: one place per OS, shared steps edited once (R1 in `analysis.md`), and Mac stays as proven.

Rollback: revert the commit; skills are markdown only, no data or config.

## Scope

Do not touch: `.claude/kit.yml`, `scripts/`, `public/`, `src/`, `outputs/`, prompts other than the files listed below.
Review budget per MR: 10 files / 400 lines. Estimate: 6 files / ~330 lines.

## Tasks

Test-first here means: write the grep/read-through check, see it fail on the current files, then edit.

- [x] T1 Create `platform/mac.md` by moving the Mac-only parts out of the three skills (R2, R8)
  - Acceptance: every Mac-only step from current skills exists in `mac.md`, wording unchanged except R3.
  - Tests: grep from R2 fails on current SKILL.md files (expected hits > 0).
  - Files: `.claude/skills/affiliate-video/platform/mac.md`
  - Lines (est.): 90
- [x] T2 Create `platform/windows.md` with the same sections (R2, R4, R5, R6, R7)
  - Acceptance: each section of `mac.md` has a Windows counterpart; PowerShell commands use UTF-8 clipboard; `magick` replaces every `sips` use; no `Đăng` click by Claude.
  - Tests: section-name diff between `mac.md` and `windows.md` is empty.
  - Files: `.claude/skills/affiliate-video/platform/windows.md`
  - Lines (est.): 110
- [x] T3 Rewire `anh-affiliate` to the platform files; TikTok web first for Step 1 (R1, R2, R3)
  - Acceptance: Setup has the OS check + Linux stop; Step 1/3 shell commands point to platform sections.
  - Tests: R2 grep on this file returns 0.
  - Files: `.claude/skills/anh-affiliate/SKILL.md`
  - Lines (est.): 40
- [x] T4 Rewire `video-affiliate`: web trend scan, platform pointers for template/build/post (R1, R2, R3, R4, R5, R6)
  - Acceptance: Steps 3–5 say "see platform file"; Mac path still contains "Gốc = 0"; Checkpoint B lists track to add on Windows.
  - Tests: R2 grep returns 0; `grep "Gốc = 0" platform/mac.md` hits.
  - Files: `.claude/skills/video-affiliate/SKILL.md`
  - Lines (est.): 50
- [x] T5 Rewire `affiliate-video`: OS detect, Stage 5 transfer via platform file, `job.md` fields (R1, R7, R9)
  - Acceptance: Stage 5 no longer embeds the AppleScript; `job.md` field list has Platform / Phone / Post route.
  - Tests: R2 grep returns 0.
  - Files: `.claude/skills/affiliate-video/SKILL.md`
  - Lines (est.): 30
- [x] T6 README: one line on Windows support and the prerequisites (ImageMagick via winget, adb optional, Zalo PC) (R1)
  - Files: `README.md`
  - Lines (est.): 8
- [x] T7 Read-through check (all R)
  - Acceptance: a fresh Haiku agent, told "you are on Windows with an Android phone" and then "Windows + iPhone", walks the skills and lists every step it can't execute; result is empty except the open questions in `analysis.md`.

After merge: real Windows job (R11 in `analysis.md`) answers the open questions and feeds fixes back.

## Test design

| R-id | Test name | Given | When | Then (expected) | Level | Task |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| R2 | `R2 no mac-only cmds in skills` | 3 SKILL.md | grep pattern | 0 hits | static | T3–T5 |
| R1/R2 | `R2 platform sections match` | mac.md, windows.md | diff `##` headings | identical | static | T2 |
| R8 | `R8 mac keeps Gốc=0` | mac.md | grep | ≥1 hit | static | T4 |
| all | `read-through windows+android / windows+iphone` | fresh agent | walk skills | no blocked step | manual | T7 |
