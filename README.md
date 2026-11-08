# CUBESTORM ULTIMATE — Build 3.0

A major upgrade of the original Cubestorm Three.js arcade project. This version keeps the project simple to open and edit: HTML, CSS, JavaScript and documentation are separate files in one folder.

## Project files

```text
Cubestorm-Ultimate/
├── index.html       # Game structure, menus, HUD and screen elements
├── styles.css      # Visual design, settings layout and responsive styling
├── game.js         # Three.js scene, physics, combat, modes and saved progression
├── README.md       # Setup instructions and feature overview
└── FEATURES.md     # Numbered inventory of 220 features and sub-features
```

## Run the game

1. Extract the ZIP file.
2. Open the `Cubestorm-Ultimate` folder in Visual Studio Code.
3. Start a local server in that folder. The simplest option is:

   ```bash
   python -m http.server 8000
   ```

4. Open **http://localhost:8000** in Chrome or Edge.

You can also use the VS Code **Live Server** extension and open `index.html` with it. No npm, Node.js, bundler, backend, API key or build step is required. Three.js and the Google Fonts are loaded from CDNs, so an internet connection is needed when they are first requested. The game profile and settings are stored in the browser's local storage on that device.

## Game modes

- **Campaign:** progress through 24 themed sectors, complete rotating objectives, and face guardians in every fourth sector. Later sectors unlock as you advance.
- **Endless:** keep surviving while the sector themes cycle and difficulty continues to rise.
- **Time Rush:** earn as much score as possible during a 75-second run.
- **Freedom:** explore the selected environment and practise movement without enemy spawns or life pressure.

## Controls

| Action | Keyboard / mouse / controller |
|---|---|
| Move | `W A S D` or arrow keys; gamepad left stick |
| Jump / double jump | `Space`; gamepad A |
| Dash | `Shift`; gamepad B |
| Fire | `F`, hold left mouse button, touch FIRE or gamepad right trigger |
| Reload | `Q` |
| Switch camera | `C` |
| Pause / resume | `P` or `Esc` |
| Mute / unmute | `M` |
| Restart run | `R` |
| FPS counter | `F3` |
| Cycle owned cube skin in menus | `K` |

Touch-capable devices display on-screen movement, jump, dash and fire controls.

## Customisation

The Settings screen contains grouped controls for graphics quality, shadows, glow, particles, trails, starfield, fog, camera mode, camera distance, field of view, HUD scale, movement speed, gravity, jump force, air control, dash strength and cooldown, track width, reload behaviour, aim assistance, firing behaviour, input options, player shape, colour, trail style, accessibility and audio volume.

The Garage offers 12 cube finishes. Collect coins during runs to unlock additional finishes, then equip the one you own. The Achievements screen tracks 18 milestones.

## Performance guidance

- **Performance:** lower pixel ratio and disable real-time shadows. Recommended for integrated graphics and older laptops.
- **Balanced:** default visual/performance compromise.
- **Ultra:** higher pixel ratio and shadows. Use it only if the device can keep a smooth frame rate.

For the smoothest experience, close GPU-heavy browser tabs and enable hardware acceleration in the browser. Reduce particles, shadows and camera shake if frame rate is unstable.

## Troubleshooting

- **Black screen / engine error:** check the internet connection because Three.js is loaded from a CDN; then confirm WebGL and browser hardware acceleration are enabled.
- **Controls do not respond:** click once inside the game, then try the controls again. The game automatically pauses when the browser window loses focus.
- **Progress did not transfer to another browser/device:** saves are local to the browser profile; there is no cloud account or cross-device sync.
- **Reset progress:** open the browser developer tools console on the local game page and run `localStorage.removeItem('cubestormUltimateProfileV3')`, then reload. To reset only settings, run `localStorage.removeItem('cubestormUltimateSettingsV3')`.

## Technical notes and honest limitations

The movement and collisions use a lightweight custom arcade simulation with 3D vectors and axis-aligned bounding boxes. It is not a full rigid-body physics engine. The project is a local single-player browser game, not an online multiplayer service, and it has no server-side accounts, anti-cheat service, cloud saving, professional QA certification or app-store deployment pipeline. The 220-item catalogue in `FEATURES.md` counts individual themes, controls, visual systems and gameplay sub-features; it should not be interpreted as 220 independent major game modes.

## Credits

Created and authored by **Muhammad Raheel Babar**. Built with Three.js and browser-native JavaScript, HTML and CSS.
