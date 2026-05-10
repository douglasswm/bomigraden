# Todo

## Objective

Add a tuxedo cat sprite component that can render alongside the existing calico cat in the garden, while preserving the calico behavior and reusing the current animation/movement system.

## Plan

- [x] Review project lessons and inspect the current calico cat implementation.
- [x] Locate the new tuxedo sprite pack and verify its structure.
- [x] Put the tuxedo sprite pack under the browser-served cat asset path.
- [x] Refactor hardcoded cat frame constants into reusable sprite pack configuration.
- [x] Keep a `CalicoCat` wrapper for the existing cat behavior.
- [x] Add a `TuxedoCat` wrapper using the tuxedo sprite assets.
- [x] Render both cats in the garden with separate positions/layers.
- [x] Add tuxedo test controls for idle, walk, sleep, jump, and roll over.
- [x] Run the normal project verification commands and fix any failures.
- [x] Review the implementation for simplicity and document results.

## Review

- Added `catSpritePacks.calico` and `catSpritePacks.tuxedo` in `src/main.jsx`.
- Refactored `AnimatedCat` to accept a sprite pack, waypoint list, initial position, and scale.
- Added `CalicoCat` and `TuxedoCat` wrappers around the shared animation component.
- Copied the tuxedo pack into `public/assets/cat/tuxedo/` so Vite serves it at `/assets/cat/tuxedo/...`.
- Rendered the tuxedo cat separately on the island at the right/lower garden path using its own waypoint loop.
- Added Cats controls in the side panel for Bomi and Tuxedo: Idle, Walk, Sleep, Jump, and Roll Over.
- Kept calico click-to-move behavior; tuxedo has independent button/click cycling and demo walk behavior.
- Kept bottom-center anchoring, soft shadow, responsive scale, and horizontal flip in the shared component.
- Verification: `npm run build` succeeded.
- Verification: local Vite server responded at `http://localhost:5173/`.
- Verification: `/assets/cat/tuxedo/sprite_manifest.json` and `/assets/cat/tuxedo/idle/idle_01.png` returned `200 OK`.
