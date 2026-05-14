# Todo

## Objective

Create or reuse an animated sprite interaction component for the corgi idle sprite pack, using the packed spritesheet and integrating it into the existing garden/pet UI.

## Plan

- [x] Review project lessons and inspect current garden/cat animation implementation.
- [x] Locate the corgi idle sprite pack and confirm metadata/spritesheet settings.
- [x] Add a reusable spritesheet animation component using CSS background-position plus requestAnimationFrame.
- [x] Copy/wire the corgi spritesheet under the existing public asset convention.
- [x] Add the corgi idle example to the garden scene without costume/accessory/tail states.
- [x] Add focused tests for render output, frame positioning, looping, and interaction callback prop acceptance.
- [x] Run available package verification commands and document exact outcomes.

## Notes

- Existing cat animations are frame-array based, but the corgi requirement prefers spritesheet rendering.
- The corgi pack exists at `corgi_idle_sprite_pack/` with `spritesheets/corgi_idle_sheet_5x2_320x448.png` and matching metadata.
- Package scripts initially include `dev`, `build`, and `preview`; there is no existing lint or test script.

## Review

- Added `src/SpriteAnimation.js` with `SpriteAnimation`, `CorgiIdleSprite`, and pure frame helpers.
- `SpriteAnimation` renders a div-based spritesheet with CSS `background-position`, `requestAnimationFrame` timing, configurable `src`, `frameWidth`, `frameHeight`, `frameCount`, `columns`, `rows`, `fps`, `loop`, `playing`, `className`, and optional click/hover callbacks.
- Added accessible defaults with `role="img"` and a corgi aria-label, plus a `decorative` option for `aria-hidden`.
- Copied the corgi spritesheet and metadata to `public/assets/corgi_idle_sprite_pack/`.
- Added a resting corgi example to the garden scene using the 5x2, 320x448, 10-frame, 8fps looping spritesheet.
- Added `src/SpriteAnimation.test.mjs` and an `npm test` script.
- Verification: `npm test` passed 4 tests covering render output, frame positions, looping/clamping, and callback prop acceptance.
- Verification: `npm run build` succeeded.
- Verification: local Vite served the root page with HTTP 200 during smoke check.
- Verification: local Vite served the new corgi spritesheet path with HTTP 200 after rerunning the asset check outside the sandbox.
- Note: there is no lint script in `package.json`.

## Previous Task Snapshot

### Objective

Integrate the full cat toy system into the garden scene using the provided `public/assets/cat-toys/` pack: toy selection, Drop/Throw modes, animated free toy entities, cat jump response, collision, and `rolling_over_with_toy` cat playback keyed by cat type and toy type.

### Plan

- [x] Identify the tuxedo/carrot frame with the hind-leg hole by diffing cleaned frames against the clean source pack.
- [x] Restore the affected hind-leg pixels without bringing back the broad white base.
- [x] Regenerate packed sheets, build, and verify on a contrast contact sheet.
- [x] Restore tuxedo/carrot toy-play frames from the clean source pack after over-cleaning punched holes.
- [x] Apply a floor-only cleanup that preserves carrot artwork, paws, and tuxedo markings.
- [x] Regenerate tuxedo/carrot packed sheets and verify with a contrast contact sheet.
- [x] Inspect tuxedo/carrot toy-play frames on a high-contrast background.
- [x] Clean rough white outline artifacts without removing tuxedo white markings or carrot highlights.
- [ ] Verify cleaned frames visually and with the normal build.
- [x] Review project lessons and inspect current garden/cat/toy implementation.
- [x] Confirm available toy assets and identify path mismatches or missing folders.
- [x] Centralize toy asset config for static, drop, throw, and cat-with-toy frames.
- [x] Add Drop/Throw UI controls and selected-state styling.
- [x] Extend toy entity state to include action type, lifecycle state, animation frame, timing, velocity, caught flags, and target cat.
- [x] Render toy drop/throw animation frames, then settle to the static sprite.
- [x] Route the nearest available cat to settled toys using jumping movement without interrupting duo/one-shot actions.
- [x] Detect cat/toy collision after the spawn animation has settled, hide the free toy, and play `rolling_over_with_toy`.
- [x] Return the cat to idle/walk after toy play and keep existing flower, cat mode, music, and duo behavior intact.
- [x] Run build verification and browser smoke checks; fix any issues found.
- [x] Copy clean transparent `rolling_over_with_toy` frame assets from the root pack into `public/assets/cat-toys/`.
- [x] Verify the real cat-with-toy frames render instead of the fallback overlay.

### Notes

- Existing code already has a partial toy flow, but it currently points at non-existent `chili_plush.png` and `carrot_plush.png` files.
- The current repo contains `public/assets/cat-toys/toys/*_static.png` plus toy drop/throw frames.
- As of inspection, `public/assets/cat-toys/calico/...` and `public/assets/cat-toys/tuxedo/...` `rolltoy` frame folders are not present, although the app can be wired to those expected paths and guarded with fallback behavior.

### Review

- Added `toyAssets` for carrot/chili static sprites plus 5-frame drop and throw frame arrays.
- Added `catToyAnimations` for the expected calico/tuxedo and carrot/chili `rolling_over_with_toy` frame paths.
- Added Toys UI selection for Chili/Carrot and Drop/Throw action mode.
- Added animated toy entities with `toyType`, `actionType`, `state`, `x/y`, `startX/startY`, `targetX/targetY`, `velocityX/velocityY`, `frameIndex`, `spawnedAt`, `settledAt`, `isActive`, `isCaught`, and `targetedByCatId`.
- Drop plays the toy's 5-frame drop sequence, then settles to the static toy sprite.
- Throw plays the toy's 5-frame throw sequence while moving along a short arc, then settles to the static toy sprite.
- After settling, the nearest available cat jumps toward the toy; collision uses garden-coordinate distance against `TOY_CATCH_DISTANCE`.
- On collision, the free toy is hidden and the target cat enters `rolling_over_with_toy` with animation selected from cat asset type plus toy type.
- Added image-error fallback for missing cat-with-toy frames so the app does not render broken sprites if the expected files are absent.
- Verification: `npm run build` succeeded.
- Verification: Chrome smoke test confirmed the Toys section renders, selecting Chili updates the instruction copy, dropping a toy renders the toy, Snow jumps to it, the free toy hides on catch, and the cat returns to idle after play.
- Added the clean transparent cat-with-toy pack from `garden_cat_toy_sprite_pack_clean_transparent/` into `public/assets/cat-toys/calico/` and `public/assets/cat-toys/tuxedo/`.
- Verified all 40 expected `rolltoy` frame PNGs are now present.
- Increased in-garden toy size from `clamp(44px, 8.4%, 74px)` to `clamp(64px, 11.2%, 112px)` and animated drop/throw toy size from `clamp(54px, 10%, 92px)` to `clamp(78px, 13.2%, 134px)`.
- Verification: local dev server returns HTTP 200 for representative `calico_carrot_rolltoy_01.png` and `tuxedo_chili_rolltoy_01.png` frame paths.
- Verification: Chrome smoke test confirmed real baked cat-with-carrot play frames render after catch instead of the plain roll/fallback overlay.
- Correction follow-up: slowed `rolling_over_with_toy` frame timing from 240ms to 380ms per frame so the toy-play poses read more clearly.
- Correction follow-up: cleaned rough white exterior/base artifacts from the 10 tuxedo/carrot `rolling_over_with_toy` frame PNGs and regenerated the matching 5x2 packed sheets.
- Correction follow-up: increased cats by 25% only while in `jumping` state and increased in-garden toy sprite sizing by 15%.
- Correction follow-up: restored tuxedo/carrot toy-play frames from the clean source pack and replaced the over-broad white-fringe cleanup with a floor-only mask to avoid punching holes in the carrot/cat art.
- Correction follow-up: used OpenCV connected-component diffing against the clean source pack to restore the 1,080-pixel hind-leg component in `tuxedo_carrot_rolltoy_06.png`.
- Correction follow-up: used OpenCV to remove only the thin near-transparent exterior white shell above the protected lower body band across all tuxedo/carrot toy-play frames.

## Follow-up: Corgi Idle Tuning

### Objective

Slow the corgi idle animation, make the in-garden corgi 33% larger, and move it to a different position.

### Plan

- [x] Reduce the corgi idle default fps from the original fast playback.
- [x] Increase the garden corgi CSS scale by 33% on desktop and mobile.
- [x] Move the garden corgi to a different resting position on the island.
- [x] Run tests and build verification.
- [x] Capture the correction pattern in `tasks/lessons.md`.

### Review

- Reduced `CorgiIdleSprite` default playback from 8 fps to 6 fps.
- Increased `.garden-corgi` scale by 33%: desktop `0.3` to `0.399`, mobile `0.24` to `0.319`.
- Moved `.garden-corgi` from `left: 79%; top: 75%` to `left: 31%; top: 62%`.
- Added a lesson about verifying sprite speed and size at garden scale.
- Verification: `npm test` passed 4 tests.
- Verification: `npm run build` succeeded.
- Follow-up: reduced `CorgiIdleSprite` default playback again from 6 fps to 4 fps after the first slowdown still read too fast.
- Follow-up: reduced `CorgiIdleSprite` default playback to the requested 2 fps.
- Correction: the visible garden corgi was still using `CorgiIdleSprite`'s wrapper default of 8 fps; changed that wrapper default to 2 fps and added a render assertion for `data-animation-fps="2"`.
- Follow-up: applied the same 2 fps idle pacing to both cats by changing cat idle frame duration to 500ms.

## Objective: Corgi Walk Sprite

Create or reuse an animated sprite interaction component for the corgi walking sprite pack, using the packed spritesheet and integrating it into the garden/pet UI.

## Plan

- [x] Inspect current sprite component, tests, garden integration, and locate the walking pack.
- [x] Confirm walking metadata: 5 columns, 2 rows, 10 frames, 416x352, 8 fps, looping, walk animation.
- [x] Reuse `SpriteAnimation` and add a `CorgiWalkSprite` wrapper with `direction` and `speed` props.
- [x] Copy walking spritesheet/metadata under `public/assets/corgi_walk_sprite_pack/`.
- [x] Add a garden example that moves the corgi across an island path using the walking spritesheet.
- [x] Add tests for walking defaults, frame math, rendered attrs, and interaction callback prop acceptance.
- [x] Run available verification commands and document results.

## Review

- Added `CorgiWalkSprite` as a wrapper around `SpriteAnimation`, using the 5x2, 416x352, 10-frame, 8fps looping walking spritesheet.
- Extended `SpriteAnimation` to accept and render `direction` and `speed` metadata props while preserving optional click/hover callbacks.
- Copied walking spritesheet and metadata to `public/assets/corgi_walk_sprite_pack/`.
- Added an `AnimatedCorgi` garden controller so there is only one corgi: it rests with the idle spritesheet and walks between garden waypoints with the walking spritesheet.
- Increased the walking corgi display scale by 33% after feedback, from the original `0.32` walking scale target to `0.426`.
- Moved the corgi starting waypoint away from the cats' starting positions to the lower-left island path.
- Added test coverage for walking frame background math, 8fps walk defaults, direction/speed props, and callback prop acceptance.
- Verification: `npm test` passed 5 tests.
- Verification: `npm run build` succeeded.
