# Todo

## Objective

Add a background music toggle control and update the tuxedo cat naming to Snow throughout the user-facing app and internal component/state names, while preserving the existing cat behavior.

## Plan

- [x] Review the current background audio and cat control implementation.
- [x] Add a side-panel button to toggle background music on and off.
- [x] Keep the Enter garden button starting background music from the user gesture.
- [x] Rename tuxedo cat UI/component/state conventions to Snow while preserving tuxedo asset paths.
- [x] Run the normal build and fix any failures.
- [x] Document results and verification.

## Review

- Added a side-panel `Music` button with on/off icons and `aria-pressed` state.
- Kept the Enter garden action starting background music from the user gesture.
- Added explicit audio pause/resume handling for the toggle; music loops at volume `0.42`.
- Renamed the tuxedo cat's app conventions to Snow: `SnowCat`, `SNOW_WAYPOINTS`, `snowAction`, `snowWalking`, `snowSpawn`, and Snow control labels.
- Preserved `/assets/cat/tuxedo/...` as the sprite asset path because it describes the existing asset folder.
- Verification: `npm run build` succeeded.
- Verification: Vite reloaded `src/main.jsx` on the running dev server.
