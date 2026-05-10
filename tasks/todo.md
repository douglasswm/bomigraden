# Todo

## Objective

When the user opens the app, show an animated letter opening. Reuse the letter visual assets from `https://www.gardenletters.online/?note=2e4zi39cw`, and use the Google Font `Nothing You Could Do` for the letter text. The final text will be supplied after the letter experience is ready.

## Plan

- [x] Slow the cat animation:
  - [x] Increase cat travel duration so walking across the island is calmer.
  - [x] Increase idle, walk, sleep, jump, and roll frame durations.
  - [x] Verify with the normal project build.
- [x] Make cat jump shift position:
  - [x] Add a vector hop offset for jump mode instead of only cycling jump frames in place.
  - [x] Animate the cat shadow with the jump vector.
  - [x] Verify with the normal project build.
- [x] Update opening letter copy:
  - [x] Address the letter to Damcho from Bomi.
  - [x] Add concise expressive Happy Meowther's Day copy thanking Damcho for caring for Bomi.
  - [x] Verify with the normal project build.
- [x] Fix letter signature visibility:
  - [x] Move `- Bomi` above the envelope front flap.
  - [x] Verify with the normal project build.
- [x] Review project lessons and current app structure.
- [x] Inspect the referenced GardenLetters site and identify reusable letter assets/font behavior.
- [x] Copy the required GardenLetters letter assets into the local public assets folder.
- [x] Add a reusable opening-letter React component with placeholder text.
- [x] Style the startup overlay, letter animation, and responsive layout.
- [x] Verify with build, local asset checks, and browser rendering.
- [x] Review for simplicity/elegance and document results.
- [x] Fix letter flower placement so all selected flowers angle and peek from behind the letter.
- [x] Add those same flowers as permanent garden decorations.
- [x] Rebuild and visually verify the corrected flower layering.

## Review

- Cat animation slowdown requested after the opening-letter work.
- Slowed cat movement by raising `CAT_WALK_DURATION` from `4200` to `6200` and rest pauses from `1700` to `2200`.
- Slowed cat frame cycling: idle `150 -> 220ms`, walk `85 -> 125ms`, sleeping `190 -> 260ms`, jumping `145 -> 210ms`, rolling over `180 -> 260ms`.
- Verified `npm run build` succeeds.
- User correction: jump mode should shift vectors; current implementation was jumping in the same spot.
- User requested final letter copy addressed to Damcho from Bomi, with Happy Meowther's Day wordplay and concise thanks for caring for Bomi.
- User correction: the `- Bomi` signature was hidden/blocked by the envelope front.
- Added a CSS jump vector on `.cat-state-jumping` that moves the whole cat through a short hop arc over the same `2100ms` cycle as the 10-frame jump loop.
- Added matching shadow movement/scale/opacity so the jump reads as spatial movement instead of frame-only animation.
- Verified `npm run build` succeeds.
- Reworked jump mode again so it advances through the same waypoint path as walk mode while using jump frames and a vertical hop lift. The cat now changes actual garden position instead of only using a local CSS offset.
- Updated the opening letter to `To: Damcho`, signed `- Bomi`, with concise Happy Meowther's Day copy.
- Moved the signature above the envelope flap by constraining the visible text area and removing the bottom-pinned signature layout.
- Verified `npm run build` succeeds.
- Previous garden work remains in place: the React/Vite garden app, island asset, smooth cat sprites, flower templates, and current build workflow were already implemented before this task.
- Added `OpeningLetter` as a separate startup overlay in `src/main.jsx`, so the final text can be swapped without touching garden behavior.
- Downloaded GardenLetters envelope, paper, and flower PNG assets into `public/assets/letter/`.
- Loaded `Nothing You Could Do` from Google Fonts and applied it to the letter text only.
- Fixed the flower layering after review: flowers now sit behind the letter/envelope stack and peek from the edges without covering the message area.
- Verified `npm run build` succeeds.
- Verified the local app responds with `200 OK` and inspected the running Chrome mobile viewport: the letter opens on load, text is readable, side flowers are visible, and the enter button is accessible.
- Reviewed the GardenLetters implementation: it stacks the envelope back, flower containers, paper, text, and front mask in one grid; flower containers use oversized inner images with offsets so the blooms peek from behind the paper/envelope.
- Updated the local opening letter to follow that pattern, with slight angled rotations and visible flowers behind the letter instead of over the text.
- Added the same GardenLetters flower assets as permanent, non-clickable garden decorations on the island.
- Rebuilt successfully and visually verified in Chrome: startup letter flowers peek from behind the letter, and after entering the garden the same flowers remain placed on the island.
