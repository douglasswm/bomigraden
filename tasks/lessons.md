# Lessons

- Review this file at session start for project-specific patterns to preserve.
- When a user asks to clone a specific visual reference, do not substitute a hand-built approximation for a named asset unless exact asset reuse is unavailable or disallowed; inspect and reuse/closely match the reference asset first.
- For animal characters, verify recognizability at the actual rendered size before calling the work complete.
- For duo animal sprites, match each animal's apparent size to the individual character components; a two-character 512px frame usually needs a larger component scale than a single-character 512px frame.
- When a user provides a pet's proper name, update visible labels and internal component/state naming around that character; keep coat-pattern names only where they describe asset folders or sprite variants.
- For small planted flower templates, exaggerate defining silhouettes like sunflower petals so the species remains recognizable after scaling down.
- When a user names new assets that are not at the requested destination path, search the repo for the asset pack before asking them to re-add files.
- For sprite characters, use `steps()` only for frame changes; keep character travel smooth with `requestAnimationFrame`/transform updates instead of coarse `left/top` CSS transitions.
- For tap-selected character modes, keep the selected mode active until the next explicit user action; do not auto-reset one-shot animations to idle unless the interaction design asks for it.
- When layering reference letter assets, verify decorative flowers are visible in the final stacked render; do not assume source z-index/positions will survive after resizing or masking changes.
- For decorative letter flowers, prefer partial edge peeks behind the paper/envelope over placing full flowers above the letter; visible should not mean covering the message area.
- When placing flowers behind a letter, position each asset so a meaningful portion escapes the paper/envelope silhouette; assets fully inside the paper rectangle will be hidden even with correct z-index.
- For sprite jump modes, frame cycling alone reads as jumping in place; add a visible position/vector offset and shadow response so the action travels.
- If a user asks for jump behavior to work like walk mode, update the cat's actual waypoint position over time, not just a local CSS transform offset.
- On the GardenLetters-style card, keep the signature above the envelope front flap; avoid `margin-top: auto` in the letter copy because it can push the sender behind the mask.
