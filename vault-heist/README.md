# Vault Heist (play-money prototype)

Open `index.html` in a browser. No build step, no server, no wallet, no real money.

## Folder layout
- `index.html`   page shell (HUD, canvas, buttons)
- `css/style.css` look and feel
- `js/config.js`  constants and helpers
- `js/render.js`  canvas setup, sprites, map baking, drawing
- `js/world.js`   procedural world generation (no drawing)
- `js/game.js`    state and rules (movement, traps, vaults, geese, scan)
- `js/main.js`    input and the main loop
- `tests/check.js` headless bug check + bot playthroughs: `node tests/check.js`

## Controls
Arrows / WASD move. Space talks. E scans for traps (3 coins). Touch d-pad on mobile.
