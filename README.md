# CUBELY — A little cube. A lot of fun.

An award-grade, tactile, playful 3D Rubik's Cube web experiment built with **React**, **TypeScript**, **Three.js**, **React Three Fiber**, **Drei**, and **Zustand**, powered by Herbert Kociemba's two-phase optimal solving algorithm.

---

## 🎨 Creative Direction (Phase 2)

**CUBELY** transforms the core Rubik's cube engine into an expressive, editorial digital playground.

- **Aesthetic**: Warm paper/linen backdrop (`#FAFAF8`), elegant editorial typography (`Instrument Serif` paired with `Inter`), soft ambient contact shadows, and generous negative space.
- **Physical 3D Tactility**: Smooth rounded cubelet edges, beveled lacquer sticker tiles, soft ground contact shadows, and a gentle idle breathing float.
- **Micro-Interactions**: Tactile button press feedback, smooth turn easing, celebratory floating completion banner (*"Beautifully done!"*), and non-intrusive toast messages.
- **Synthesized Web Audio**: Pure Web Audio API mechanical turn clicks, soft button pops, and a celestial C-Major 7th completion chime (off by default, zero external assets).

---

## 🌈 Palettes & Themes

Users can freely customize the visual presentation in the **Customise** panel without affecting the underlying mathematical cube state:

### 1. Cube Sticker Palettes
- **Candy Playground** *(Default)*: Playful confectionery pinks, apricot, and lilacs.
- **Neon Pop**: High-contrast, saturated cyberpunk primaries and electric accents.
- **Sunset Mirage**: Warm golden hour ambers, terracotta coral, and dusk indigo.
- **Studio Slate**: Minimalist architectural grayscale tones.

### 2. Canvas Environments
- **Warm Paper** (`#FAFAF8`): Editorial gallery aesthetic.
- **Live Aurora**: Flowing multi-stop mesh gradient animation.
- **Studio Gray** (`#F3F4F6`): Clean design studio backdrop.
- **Blush Sand** (`#F7F3EE`): Soft warm clay atmosphere.
- **Midnight Velvet** (`#101116`): Sleek dark mode with luminous sticker glow.

---

## 🕹️ Controls & Interactions

### 1. Mouse & Touch
- **Background Drag**: Smooth 360° orbiting around the cube.
- **Face Sticker Swipe**: Click or touch any sticker and drag horizontally or vertically. The engine projects 3D tangent vectors to screen coordinates and performs vector cross products ($\vec{A} = \vec{T} \times \vec{N}$) to identify the target layer and turn direction from any perspective.
- **Mobile Touch**: `touch-action: none` prevents accidental browser scrolling during interaction.

### 2. Speedcube Keyboard Shortcuts
- `U`, `D`, `L`, `R`, `F`, `B`: Clockwise 90° face turns.
- `Shift + [Key]`: Counter-clockwise inverse turns (`U'`, `D'`, etc.).
- `M`, `E`, `S`: Middle slice turns.
- `x`, `y`, `z`: Whole-cube spatial rotations.
- `Ctrl + Z` / `Ctrl + Y`: Undo / Redo.
- `Spacebar`: Pause / Resume automated move playback.
- Automatically disabled when typing inside text inputs.

---

## ⚡ Gameplay & Solver Features

- **Herbert Kociemba Two-Phase Solver**: Calculates optimal solutions in 22 moves or fewer directly from the current 54-facelet state.
- **WCA Scrambler**: Generates valid, non-redundant scramble sequences (15, 20, 25 moves).
- **Interactive Move Queue**: Supports play, pause, resume, cancel, and speed tuning (Fast 100ms, Smooth 200ms, Gentle 350ms).
- **High-Precision Timer & Move Counter**: Millisecond digital stopwatch that halts automatically upon solved-state detection.
- **Focus Mode**: One-click minimal mode hiding chrome and UI elements to highlight the 3D cube.
- **Direct Layer Turns Dock**: Expandable dock providing on-screen buttons for all standard face, slice, and cube rotations.

---

## 🧪 Testing Suite (16/16 Passed)

Run the Vitest test suite:

```bash
npm test
```

All 16 engine integrity and logic test suites pass:
- Initial cube solved state.
- Inverse turns (`U U'`, `R R'`, `F F'`).
- 4 identical quarter turns return to identity.
- Double turns (`U2`, `D2`, `L2`, `R2`, `F2`, `B2`).
- WCA scrambling state alteration.
- Kociemba solver state restoration.
- Undo & Redo consistency.
- Reset restoration.
- Long random sequence (100 moves) drift immunity.
- Layer integrity verification.
- Sexy Move cycle ($\times 6$).
- Middle slice moves (`M`, `E`, `S`).
- Whole-cube rotations (`x`, `y`, `z`).

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Sarthak1113/cubely.git
cd cubely

# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```
