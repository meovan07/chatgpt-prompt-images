# Analysis: Run the affiliate workflow on Windows

Ticket: user request in chat. Analyzed: 2026-11-16. Status: grilled.

## Ticket

"nếu đây là trên máy mac và có iphone mirroring, thế còn windows thì chúng ta sẽ làm gì nhỉ"

## What it asks

Decide how `/anh-affiliate`, `/video-affiliate` and `/affiliate-video` run on a Windows PC, where iPhone Mirroring, `osascript`/Photos, `sips`, `pbcopy`/`pbpaste` and Universal Clipboard do not exist.

## Mac-only dependencies today

- Phone control: iPhone Mirroring (product read in TikTok app, trend scan, CapCut template, TikTok post with commercial sound + product link).
- Image transfer: `osascript` → Photos → iCloud; fallback Zalo.
- Image tools: `sips` (crop, size check, jpeg convert).
- Clipboard: `pbcopy` (prompt paste in ChatGPT), `pbpaste` (post link via Universal Clipboard).
- Browser steps (Chrome + Claude in Chrome: TikTok web, Pinterest, ChatGPT) are cross-platform.

## What's ambiguous

- Which phone (iPhone or Android) the Windows user has. → both (R2).
- Whether phone steps should be automated at all on Windows. → no; build on CapCut desktop, post manually (R5, R8).

## Decisions

- R1 One skill set (3 skills). OS-specific parts live in `platform/mac.md` and `platform/windows.md`; the skill branches on OS at Setup.
- R2 Windows supports iPhone and Android. No phone screen control on Windows.
- R3 Windows shell: PowerShell (`Set-Clipboard`/`Get-Clipboard`). Image ops: ImageMagick `magick` (user installs once: `winget install ImageMagick.ImageMagick`).
- R4 Product read + trend scan: TikTok web in Chrome, signed in by the user, on both Mac and Windows. Mac falls back to iPhone Mirroring only when web is blocked.
- R5 Windows build: CapCut desktop, driven with Claude desktop computer use. If computer use is unavailable, Claude gives step-by-step instructions (photo order, cut timings) and the user clicks.
- R6 No passing free 4-photo template on CapCut desktop → Claude builds it on the timeline: 4 photos cut to the beat, light transitions only, no stickers or baked-in text.
- R7 Sound: pick a track from TikTok "Âm thanh thương mại" first, cut to its beat, export the mp4 **without audio**; add that same track when posting. Double sound is impossible; the product link unlocks.
- R8 Posting is manual, chosen per job: (a) phone app — move the mp4 to the phone and hand over caption + product link to paste; (b) TikTok Studio web. If web can't pick a commercial sound or attach the product, switch to (a) and record it in `job.md`.
- R9 File to phone: iPhone → Zalo PC ("Cloud của tôi") then save to Photos; Android → `adb push` to the camera folder (fallback Zalo).
- R10 Mac keeps CapCut mobile templates via iPhone Mirroring (proven in a real run); CapCut desktop is the Mac fallback.
- R11 Done = one real job run end to end on a Windows machine, issues logged and folded back into the skills.

## Assumptions

none

## Priority

medium. Reason: workflow works on Mac today; Windows is an expansion.

## First step

Write `platform/windows.md` + `platform/mac.md` and switch product read / trend scan to TikTok web first (R4), then do the Windows test run (R11).

## Grill log

Max rounds: 5.

| Round | Area | Question | Answer | Decision |
| :-- | :-- | :-- | :-- | :-- |
| 1 | scope | Which phone on Windows? | "Cả hai" | R2: support iPhone and Android |
| 1 | scope | How do phone steps run on Windows? | "dựng video capcut desktop nhưng đến lúc đăng có thể manual" | R5, R8: CapCut desktop build, manual post |
| 1 | data | Skill structure? | one skill, branch by OS | R1 |
| 1 | data | Windows shell? | PowerShell | R3 |
| 2 | rules | Where is the manual post made? | "Tuỳ lần" | R8: phone app or Studio web, per job |
| 2 | edge cases | No free 4-photo template on desktop? | build to the beat | R6 |
| 2 | scope | Product read + trend scan on Windows? | TikTok web, signed in | R4 |
| 2 | scope | Extra Android automation? | adb push only | R9 |
| 3 | rules | When is the commercial sound added? | export silent, add on TikTok | R7 |
| 3 | scope | Move Mac to TikTok web first too? | yes, web first, phone fallback | R4 |
| 3 | permissions | How is CapCut desktop driven? | Claude desktop computer use | R5 |
| 3 | acceptance | How do we know Windows works? | one real job on Windows | R11 |
| 4 | failures | Studio web can't add sound/product? | switch to phone posting | R8 |
| 4 | data | File transfer to iPhone on Windows? | Zalo PC | R9 |
| 4 | scope | Mac also on CapCut desktop? | keep phone CapCut on Mac | R10 |
| 4 | data | Image tool on Windows? | ImageMagick via winget | R3 |

## Open questions

- Is Claude desktop computer use available on the user's Windows machine? — user, at the test run.
- Does CapCut desktop have the chosen TikTok commercial track (needed for beat cuts)? If not, how to get beat timings (CapCut auto-beat on a similar track, or even cuts)? — test run.
- Does TikTok Studio web offer the commercial sound library and affiliate product linking for this account? — test run.
- Does CapCut desktop (VN) have a Templates tab that takes 4 photos? — test run.
- Does TikTok web search behave like the app (product link videos, view counts) when signed in? — test run.
