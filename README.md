<div align="center">

![CUBESTORM ULTIMATE](assets/banner.svg)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Three.js](https://img.shields.io/badge/Three.js-r160-000000?logo=three.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2017%2B-F7DF1E?logo=javascript&logoColor=000000)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Build Step](https://img.shields.io/badge/Build%20Step-None-brightgreen)
![Status](https://img.shields.io/badge/Status-Active-success)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blueviolet)

### A full 3D arcade survival game, built entirely in the browser — no engine, no build step, no backend.
**24 themed sectors · 4 game modes · 8 enemy archetypes · boss guardians · a full cosmetics garage · 37 live-tunable settings.**

[Quick Start](#-quick-start) · [Controls](#-controls) · [Highlights](#-highlights) · [Architecture](#-architecture-and-how-it-works) · [License](#-license)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Highlights](#-highlights)
- [Preview](#-preview)
- [Quick Start](#-quick-start)
- [Game Modes](#-game-modes)
- [Controls](#-controls)
- [The 24 Sectors](#-the-24-sectors)
- [Enemies and Threats](#-enemies-and-threats)
- [Power-Ups](#-power-ups)
- [Missions and Scoring](#-missions-and-scoring)
- [The Garage](#-the-garage)
- [Achievements](#-achievements)
- [Settings and Customization](#-settings-and-customization)
- [Project Structure](#-project-structure)
- [Architecture and How It Works](#-architecture-and-how-it-works)
- [Browser and Hardware Requirements](#-browser-and-hardware-requirements)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [Honest Limitations](#-honest-limitations)
- [Credits](#-credits)
- [License](#-license)

---

## 🧩 Overview

**CUBESTORM ULTIMATE** (Build 3.0) is a single-player, browser-native 3D arcade survival game. You pilot a cube down a neon runway, dodging and shooting your way through waves of enemy geometry, collecting coins and power-ups, and fighting a Sector Guardian every four stages — all the way to sector 24.

There is no game engine, no bundler, and no server. The entire experience is three files — `index.html`, `styles.css`, and `game.js` — driven by [Three.js](https://threejs.org/) for rendering and the native Web Audio API for sound. Open it with a static file server and you're playing in seconds.

This repository is built to be genuinely easy to read, fork, and extend: every enemy, sector, skin, mission, and setting is defined as plain data at the top of `game.js`, so changing the game's balance or content rarely means touching the game loop itself.

---

## ✨ Highlights

- **24 handcrafted sectors**, each with its own sky, floor, fog, and glow palette, plus procedurally placed scenery that varies by sector.
- **4 distinct game modes** — Campaign, Endless, Time Rush, and a no-pressure Freedom mode for practicing movement.
- **5 difficulty presets** (Story → Nightmare) that scale enemy speed, enemy health, spawn rate, lives, and score multiplier independently.
- **8 enemy archetypes** with unique movement patterns — straight runners, zigzaggers, hoppers, a splitter that divides on death, a pulsing prism, and a scaling Sector Guardian boss.
- **8 power-up types** (Shield, Slow, Double Score, Extra Life, Magnet, Rapid Fire, Multi-Shot, Repair) layered on top of a combo-driven scoring system.
- **12 unlockable cube finishes**, 5 player geometries, and 4 trail styles in a dedicated Garage screen, purchased with coins earned in-run.
- **18 tracked achievements** spanning score, survival, combat, and collection milestones.
- **37 live-tunable settings** across 6 categories (visual quality, camera & HUD, physics & movement, combat & assists, color & accessibility, audio) — all generated from a single declarative schema, not hand-wired one by one.
- **Full input coverage**: keyboard, mouse, on-screen touch controls, and Gamepad API support, all active simultaneously.
- **Procedural audio engine** — every sound effect is synthesized at runtime with the Web Audio API. There isn't a single `.mp3` or `.wav` file to download.
- **Defensive local-save system** that validates, clamps, and repairs the player's saved profile and settings on load, so a corrupted or hand-edited save can't crash the game.
- **Accessibility options** baked in: a reduced-flash toggle, a high-contrast HUD mode, `prefers-reduced-motion` support, and configurable aim assistance.
- **Graceful failure states** for missing WebGL or a failed Three.js CDN load, instead of a blank screen.

---

## 🖼️ Preview

This README ships with a generated hero banner (`assets/banner.svg`) rather than fabricated gameplay screenshots. If you'd like real captures in here, drop your own PNGs or a short GIF into `assets/` and reference them with standard Markdown image syntax, for example:

```markdown
![Campaign gameplay](assets/screenshot-campaign.png)
![Sector Guardian fight](assets/screenshot-boss.png)
```

---

## 🚀 Quick Start

No Node.js, npm, bundler, backend, API key, or build step is required.

1. **Extract** the project folder (or clone this repository).
2. **Open the folder** in your editor of choice (e.g. Visual Studio Code).
3. **Start a local static server** from inside the folder. The simplest option:

   ```bash
   python -m http.server 8000
   ```

   Any other static server works too (`npx serve`, PHP's built-in server, etc.) — the only requirement is that the page is served over `http://`, not opened directly as a `file://` URL, since module loading and some browser APIs behave inconsistently from the filesystem.

4. **Open your browser** to:

   ```text
   http://localhost:8000
   ```

Alternatively, use the VS Code **Live Server** extension and open `index.html` directly with it.

> Three.js and the Google Fonts used for the UI are loaded from a CDN, so an internet connection is required the first time the page loads them. Your progress and settings are then stored locally in your browser via `localStorage` — nothing is ever sent to a server.

---

## 🎮 Game Modes

| Mode | Description | Lives | Ends When |
|---|---|---|---|
| **Campaign** | Progress through all 24 themed sectors in order. Every 4th sector (4, 8, 12, 16, 20, 24) ends in a Sector Guardian boss fight that must be cleared before advancing. | Set by difficulty (1–5) | You clear sector 24, or run out of lives |
| **Endless** | The same mechanics as Campaign, but sectors cycle indefinitely and difficulty keeps climbing. No Guardian fights. | Set by difficulty | You run out of lives |
| **Time Rush** | A 75-second sprint for the highest score you can bank before the clock runs out. No Guardian fights. | Set by difficulty | The 75-second timer expires |
| **Freedom** | No enemies, no countdown, no life loss — just the track, your cube, and unlimited movement practice. | Unlimited (∞) | You choose to quit |

Each mode remembers your chosen difficulty and, for Campaign, your furthest unlocked sector.

---

## 🕹️ Controls

| Input | Action |
|---|---|
| `W` `A` `S` `D` or Arrow Keys | Move |
| `Space` | Jump — press again while airborne for a double jump |
| `Shift` | Dash (a short burst of speed with brief invulnerability) |
| `F` or Left Click | Fire energy bolts |
| `Q` | Manual reload |
| `C` | Toggle first-person / chase camera mid-run |
| `P` or `Esc` | Pause / Resume |
| `M` | Mute / unmute all audio |
| `R` | Restart the current run |
| `F3` | Toggle the FPS counter |
| `K` | Cycle your equipped skin (menus only) |
| `Enter` | Start the Campaign from the main menu |
| Gamepad Left Stick | Move |
| Gamepad **A** | Jump |
| Gamepad **B** | Dash |
| Gamepad Right Trigger | Fire |
| On-screen touch buttons | Move / Jump / Dash / Fire — shown automatically on touch-capable devices |

Camera distance, field of view, and whether first-person is the default view are all configurable from **Settings → Camera & HUD**.

---

## 🌌 The 24 Sectors

| # | Sector | # | Sector | # | Sector | # | Sector |
|---|---|---|---|---|---|---|---|
| 01 | Neon Harbor | 07 | Skyline Rush | 13 | Aurora Heights | 19 | Prism Palace |
| 02 | Verdant Circuit | 08 | Toxic Gardens 👹 | 14 | Clockwork City | 20 | Thunder Plains 👹 |
| 03 | Solar Foundry | 09 | Deep Space | 15 | Quantum Garden | 21 | Mirage Desert |
| 04 | Frostline 👹 | 10 | Crystal Caverns | 16 | Magma Station 👹 | 22 | Binary Abyss |
| 05 | Violet Expanse | 11 | Obsidian Run | 17 | Moonlit Coast | 23 | Solar Cathedral |
| 06 | Cinder Valley | 12 | Last Dimension 👹 | 18 | Emerald Vault | 24 | Eternal Core 👹 |

👹 = Sector Guardian boss fight (Campaign and Endless modes only; every 4th sector). Each sector has its own sky, floor, fog, and rim-light color, plus a scenery variant drawn from six procedural geometry families, so no two blocks of the campaign look identical.

---

## 👾 Enemies and Threats

| Enemy | Behavior | Relative Speed | Hit Points | Base Score |
|---|---|---|---|---|
| Normal | Straight-line approach | 1.0× | 1 | 15 |
| Runner | Fast and fragile | 1.55× | 1 | 22 |
| Heavy | Slow, armored, hits hard | 0.72× | 3 | 38 |
| Zigzag | Weaves side to side across the track | 1.08× | 1 | 26 |
| Hopper | Bounces vertically as it approaches | 1.05× | 1 | 27 |
| Splitter | Divides into two Runners on death | 0.92× | 2 | 34 |
| Prism | Translucent, pulses in and out of focus | 1.12× | 2 | 36 |
| **Sector Guardian** (boss) | Weaves laterally, health scales with sector number | 0.55× (slower on approach) | 22 + 2 × sector | 450 |

New enemy types are introduced gradually — Runners appear from sector 2, Heavies from sector 3, Splitters from sector 4, Zigzags from sector 5, Prisms from sector 6, and Hoppers from sector 7 — so the difficulty ramp is never a single wall. Enemy speed, health, and spawn frequency are additionally scaled by your chosen difficulty preset.

---

## ⚡ Power-Ups

| Power-Up | Effect |
|---|---|
| **Shield** | Absorbs the next hit you take |
| **Slow** | Slows enemies and incoming pickups for 8 seconds |
| **Double Score** | Doubles your score multiplier for 10 seconds |
| **Extra Life** | +1 life (only appears below your max lives, and never in Freedom mode) |
| **Magnet** | Pulls nearby coins and power-ups toward you for 12 seconds |
| **Rapid Fire** | Unlimited ammo with a faster fire rate for 10 seconds |
| **Multi-Shot** | Fires three energy bolts per shot for 9 seconds |
| **Repair** | Restores one life |

---

## 🎯 Missions and Scoring

Every sector (outside Freedom mode) assigns one of 8 rotating mission templates — dodge a number of enemies, collect coins, land kills, land shots, or gather power-ups — with rewards ranging from 120 to 220 score, plus a coin bonus on completion.

Scoring layers several multipliers together:

```text
points_awarded = floor(base_points × combo_multiplier × difficulty_multiplier)

combo_multiplier = min(5, 1 + floor(combo / 5) × 0.5) × (2 if Double Score is active else 1)
```

Chaining kills and dodges without taking a hit raises your combo (and therefore your multiplier); getting hit resets it to zero. A 10× combo and a cleared Sector Guardian each trigger their own on-screen celebration.

---

## 🧰 The Garage

Coins earned during runs unlock cosmetic cube finishes in the Garage screen:

| Skin | Unlock Cost | Skin | Unlock Cost |
|---|---|---|---|
| Cyan Pulse | Owned by default | Crimson Byte | 180 ◆ |
| Royal Violet | 80 ◆ | Skyline Blue | 200 ◆ |
| Solar Flare | 100 ◆ | Toxic Lime | 220 ◆ |
| Rose Circuit | 120 ◆ | Amethyst | 240 ◆ |
| Emerald Drive | 140 ◆ | Ocean Glass | 260 ◆ |
| Arctic Glass | 160 ◆ | Supernova | 300 ◆ |

Beyond color, **Settings → Color & Accessibility** also lets you change the player's geometry (cube, octahedron, icosahedron, dodecahedron, or tetrahedron) and pick between four trail styles — energy sparks, soft dots, crystal shards, or no trail at all — with a custom color picker for each.

---

## 🏆 Achievements

18 milestones are tracked permanently on your local profile:

| | |
|---|---|
| First Contact — complete your first run | Dimension Defender — destroy 100 enemies |
| Pocket Change — collect 25 coins | Untouchable — dodge 25 enemies |
| Coin Architect — collect 100 coins | Chain Reaction — reach a 10× combo |
| Four Digits — score 1,000 in one run | Guardian Down — defeat a Sector Guardian |
| High Voltage — score 5,000 in one run | World Hopper — reach sector 5 |
| Cube Collector — destroy 25 enemies | Halfway There — reach sector 12 |
| Beyond the Edge — complete all 24 sectors | Style Explorer — unlock five skins |
| Power Network — collect 20 power-ups | Against the Clock — survive 60s in Time Rush |
| Dash Specialist — dash 20 times | Airborne — jump 50 times |

---

## ⚙️ Settings and Customization

Every setting below is generated from one declarative schema in `game.js` (`SETTING_GROUPS`) and rendered into the Settings screen automatically — adding a new slider or toggle means adding one line of data, not writing new UI code.

- **Visual Quality** — graphics preset (Performance / Balanced / Ultra), dynamic shadows, emissive glow, particle effects, player trail, starfield, atmospheric fog.
- **Camera & HUD** — camera mode (chase / close chase / first-person), camera distance, field of view, camera shake, threat radar, FPS counter, HUD scale.
- **Physics & Movement** — movement speed, gravity, jump force, air control, dash power, dash cooldown, track width.
- **Combat & Assists** — automatic reload, aim assistance, hold-to-fire, hit feedback notifications, aim-guidance strength, inverted gamepad vertical input.
- **Color & Accessibility** — player tint, trail tint, player geometry, trail style, reduced flashes, high-contrast HUD, gameplay tips.
- **Audio** — sound effects on/off, master volume, interface sounds.

All settings apply live and persist locally, independently of your save profile, so resetting your progress never resets your preferred setup (and vice versa).

---

## 🏗️ Project Structure

```text
Cubestorm-Ultimate/
├── index.html        # Game structure, menus, HUD and screen elements
├── styles.css         # Visual design, settings layout and responsive styling
├── game.js            # Three.js scene, physics, combat, modes and saved progression
├── README.md          # You are here
├── FEATURES.md        # Numbered inventory of 220 features and sub-features
├── LICENSE            # MIT License
└── assets/
    └── banner.svg      # README hero banner
```

No `package.json`, no `node_modules`, no build output directory. What you see is what runs.

---

## 🧠 Architecture and How It Works

### Game Loop and State Machine
The game runs on a single `requestAnimationFrame` loop. Delta time is read from a `THREE.Clock` and clamped to a maximum of 45ms per frame, so switching browser tabs or a slow frame never causes a physics "spiral of death" when you return. A simple state machine (`menu` → `playing` → `paused` → `over`) gates which systems update and which screen is shown.

### Movement, Physics and Feel
Movement isn't a physics-engine rigid body — it's a small, tuned arcade model: exponential smoothing toward a target velocity (`1 - e^(-speed·dt)`) gives responsive but non-twitchy acceleration, gravity is applied every frame, and jumping uses both **input buffering** (a jump pressed just before landing still registers) and **coyote time** (a jump pressed just after leaving a platform still registers) — the two tricks most platformers use to make jumps feel forgiving.

### Collision Detection
All collision — player vs. enemy, bullet vs. enemy, player vs. pickup — is handled with simple axis-aligned bounding box (AABB) overlap tests in three dimensions. It's deliberately lightweight: fast enough to check dozens of entities every frame without a spatial partitioning structure, at the cost of not supporting rotated hitboxes (which the gameplay never needs).

### Data-Driven Design
Sectors, difficulties, enemy types, power-up colors, skins, trail styles, missions, achievements, and every settings control are defined as plain configuration objects and arrays at the top of `game.js` (`STAGES`, `DIFFICULTIES`, `ENEMIES`, `SKINS`, `MISSIONS`, `ACHIEVEMENTS`, `SETTING_GROUPS`). The game logic reads from these tables rather than hard-coding behavior per entity, so balancing a number or adding a 25th sector doesn't require touching the simulation code.

### Persistence Layer
Profile (`cubestormUltimateProfileV3`) and settings (`cubestormUltimateSettingsV3`) are stored as JSON in `localStorage`. On load, every field is defensively clamped and type-checked against its expected range or default — so a corrupted save, a manually-edited value, or a value from an older version of the game can't put the simulation into an invalid state.

### Procedural Audio Engine
There are no audio files. Every sound — jump, dash, shot, reload, coin pickup, power-up, hit, boss roar, level transition — is synthesized on the fly from Web Audio `OscillatorNode`s with short gain envelopes, keeping the entire project dependency-free and the download size tiny.

### Rendering Pipeline
A single `THREE.Scene` combines a hemisphere ambient light, one shadow-casting directional light, and a point light for rim glow, rendered with ACES Filmic tone mapping for a more cinematic contrast curve. Each sector swaps the sky color, fog color, floor material, and rim-light color to its own theme, and regenerates a scenery pass from one of six procedural geometry families so sectors don't visually repeat. Entity counts are capped (26 enemies, 45 pickups, 50 bullets, 340 particles) to keep frame time predictable even during chaotic moments.

---

## 🖥️ Browser and Hardware Requirements

- A modern desktop or mobile browser with **WebGL** support (recent Chrome, Edge, Firefox, or Safari).
- Hardware acceleration enabled in your browser for a stable frame rate.
- An internet connection on first load, to fetch Three.js and the Google Fonts used in the UI from their CDNs.
- A gamepad is optional, not required — keyboard, mouse, and touch are all fully supported on their own.

---

## 🩹 Troubleshooting

- **Black screen or "3D engine could not start" message** — check your internet connection (Three.js loads from a CDN), then confirm WebGL and hardware acceleration are enabled in your browser.
- **Controls don't respond** — click once inside the game window to give it focus, then try again. The game automatically pauses whenever the browser tab loses focus.
- **Progress didn't carry over to another browser or device** — saves are local to that specific browser profile; there is no account system or cloud sync.
- **Reset your progress** — open your browser's developer console on the local game page and run:

  ```js
  localStorage.removeItem('cubestormUltimateProfileV3')
  ```

- **Reset only your settings**, leaving progress untouched:

  ```js
  localStorage.removeItem('cubestormUltimateSettingsV3')
  ```

---

## 🧭 Roadmap

These are ideas under consideration, not implemented features — listed here for transparency about where the project could go next, not as a promise of what it currently does:

- An optional, opt-in cloud save so progress can follow a player across devices.
- A local leaderboard view that compares your best runs across modes and difficulties.
- Additional boss attack patterns for the Sector Guardian, varied by sector.
- A short in-run replay / highlight capture for your best moments.
- Additional sectors and enemy archetypes beyond the current 24 / 8.

---

## 🤝 Contributing

Contributions, bug reports, and balance suggestions are welcome.

1. Fork the repository and create a feature branch.
2. Keep the project dependency-free — new features should stay implementable in vanilla JavaScript, HTML, and CSS plus the existing Three.js CDN import.
3. Match the existing code style found in `game.js` (ES2017+, semicolon-terminated statements, `camelCase` naming, configuration-first design).
4. Test across at least one desktop and one touch-capable browser before opening a pull request.
5. Describe *what* changed and *why* in your pull request description — screenshots or a short clip are appreciated for anything visual.

---

## ❓ FAQ

**Do I need Node.js or npm to run this?**
No. Any static file server works; see [Quick Start](#-quick-start).

**Does it work on mobile?**
Yes — on-screen touch controls appear automatically on touch-capable devices, and the layout is responsive down to small screens.

**Where is my save data stored?**
In your browser's `localStorage`, under the keys `cubestormUltimateProfileV3` and `cubestormUltimateSettingsV3`. Nothing leaves your device.

**Can I self-host Three.js instead of using the CDN?**
Yes — download the matching Three.js build and point the `<script>` tag in `index.html` at your local copy instead of the CDN URL.

**Is there multiplayer or an online leaderboard?**
Not currently — see [Honest Limitations](#-honest-limitations) and [Roadmap](#-roadmap).

**Why does the track get narrower as I progress?**
It's an intentional difficulty curve — `trackWidth` shrinks slightly with every sector (configurable in Settings) so later sectors demand tighter control, independent of enemy difficulty scaling.

---

## 📜 Honest Limitations

In the interest of setting accurate expectations:

- Movement and collisions use a lightweight custom arcade model with 3D vectors and axis-aligned bounding boxes — **not** a full rigid-body physics engine.
- This is a **local, single-player browser game**. There is no multiplayer, no server-side accounts, no anti-cheat service, no cloud save, and no app-store packaging.
- The 220-item catalogue in `FEATURES.md` counts individual sectors, controls, visual systems, and gameplay sub-features; it describes one cohesive game, not 220 independent systems.
- Three.js and the UI fonts are loaded from third-party CDNs, so the game requires an internet connection the first time those resources are fetched, even though gameplay itself needs no server.

---

## 🙌 Credits

- **Created and authored by [Muhammad Raheel Babar](#)**.
- Built with [Three.js](https://threejs.org/), browser-native JavaScript, HTML, and CSS.
- Typography via Google Fonts — *Barlow Condensed* and *Inter*.
- Development was assisted by **Claude** (Anthropic) for iterative feature design, code generation, and this documentation.

---

## 📄 License

Released under the **MIT License** — see [`LICENSE`](LICENSE) for the full text. In short: you're free to use, copy, modify, merge, publish, distribute, sublicense, and sell copies of this project, provided the original copyright notice is retained, and the software is provided as-is, without warranty of any kind.

<div align="center">

**Built from scratch, playable in one click, and fully yours to take apart.**

</div>
