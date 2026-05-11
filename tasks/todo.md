# Todo

## Objective

Integrate the full cat toy system into the garden scene using the provided `public/assets/cat-toys/` pack: toy selection, Drop/Throw modes, animated free toy entities, cat jump response, collision, and `rolling_over_with_toy` cat playback keyed by cat type and toy type.

## Plan

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

## Notes

- Existing code already has a partial toy flow, but it currently points at non-existent `chili_plush.png` and `carrot_plush.png` files.
- The current repo contains `public/assets/cat-toys/toys/*_static.png` plus toy drop/throw frames.
- As of inspection, `public/assets/cat-toys/calico/...` and `public/assets/cat-toys/tuxedo/...` `rolltoy` frame folders are not present, although the app can be wired to those expected paths and guarded with fallback behavior.

## Review

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
