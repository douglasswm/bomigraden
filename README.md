# Bomi Garden

Bomi Garden is a small React and Vite garden scene with animated pets, flower drawing, toy interactions, and sprite-based corgi/cat animations.

## Setup

Install dependencies:

```sh
npm install
```

Start the local dev server:

```sh
npm run dev
```

Build production assets:

```sh
npm run build
```

Run tests:

```sh
npm test
```

Preview a production build:

```sh
npm run preview
```

## Project Structure

- `src/` contains the React app, garden scene, sprite animation components, and tests.
- `public/assets/` contains runtime assets served by Vite.
- `dist/` contains the generated production build.
- `tasks/` contains project notes, implementation plans, and lessons learned.

## Sprite Assets

The app uses packed spritesheets for efficient corgi rendering:

- `public/assets/corgi_idle_sprite_pack/`
- `public/assets/corgi_walk_sprite_pack/`

Local root sprite-pack folders such as `corgi_idle_sprite_pack/` and `corgi_walk_sprite_pack/` are source material and are not required for running the app after the assets have been copied into `public/assets/`.

## Notes

- `node_modules/` is intentionally ignored. Recreate it with `npm install`.
- `.DS_Store` and local environment files are ignored.
- There is no separate lint script configured at this time.
