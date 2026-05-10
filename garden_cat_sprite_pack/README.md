# Garden Cat Sprite Pack

Files:
- `annas-garden-island.png` — the garden art.
- `calico_cat_garden_style_spritesheet_2048x1024.png` — transparent sprite sheet.
- `cat_sprite_meta.json` — frame dimensions and animation metadata.
- `frames/` — individual PNG frames.
- `garden_cat_animation_demo.html` — small standalone CSS/JS demo.

Sprite sheet layout:
- 2048 x 1024 px
- 4 columns x 2 rows
- Each frame: 512 x 512 px
- Row 0: idle, 4 frames
- Row 1: walk, 4 frames

CSS positions:
- Idle: `background-position` from `0 0` to `-2048px 0` with `steps(4)`
- Walk: `background-position` from `0 -512px` to `-2048px -512px` with `steps(4)`

Recommended visual scale on the attached garden: about `0.25` to `0.32`.
Use a bottom-center-ish transform origin / anchor around `50% 86%`.
