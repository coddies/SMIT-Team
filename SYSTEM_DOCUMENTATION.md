# ToonCraft 2D Animation Studio - Complete System Architecture & Specification Blueprint

> **Purpose of this document:**  
> This document is an exhaustive, production-grade technical specification and implementation blueprint of the **ToonCraft 2D Studio** application. If provided back to an AI model or software engineer, it contains every architectural detail, mathematical formula, component relationship, state structure, rendering procedure, and keyframe algorithm needed to recreate the exact same software from scratch with identical functionality.

---

## 1. System Overview & Technology Stack

- **Application Type:** Pure Client-Side Single Page Application (SPA) built for responsive desktop and tablet browsers.
- **Framework:** React 18+ with TypeScript (Strict mode enabled).
- **Build System:** Vite.
- **Styling:** Tailwind CSS (utility-first, dark slate studio theme `bg-slate-950`).
- **Icons:** `lucide-react`.
- **Canvas Engine:** Pure HTML5 Canvas 2D Rendering Context (`CanvasRenderingContext2D`) without external canvas libraries (no Pixi, Fabric, or Konva). Characters, props, vehicles, particles, and rigs are drawn procedurally via mathematical vector paths and transformation matrices.
- **Audio Engine:** HTML5 Web Audio API (`AudioContext`) with real-time procedural sound effect synthesis and audio track playback.
- **Export Engine:** Native `HTMLCanvasElement.captureStream()` combined with `MediaRecorder` API for real-time video export (WebM/MP4) and full JSON project serialization.

---

## 2. Directory & File Structure

```text
src/
├── App.tsx                          # Root layout, modal managers, sidebar tab switching, header integration
├── main.tsx                         # React DOM mount point with ProjectProvider
├── index.css                        # Tailwind CSS global styles and dark studio root variables
├── types/
│   └── animation.ts                 # Full TypeScript definitions (Project, Scene, Keyframe, Character, Rig, Audio)
├── constants/
│   ├── defaults.ts                  # Presets for characters, traditional Desi/Pakistani outfits, hair, backgrounds, SFX
│   └── documentation.ts             # Embedded complete system blueprint & exportable specification
├── context/
│   └── ProjectContext.tsx           # Global state engine, Undo/Redo history stack, Keyframe CRUD, auto-keyframe logic
├── renderer/
│   ├── sceneRenderer.ts             # Canvas scene composer, keyframe interpolation (lerp + action holding), layer sorting
│   └── characterRig.ts              # Procedural vector drawing: limbs, joints, visemes, cartoon walk/run cycles, Pakistani attires
├── audio/
│   └── audioManager.ts              # Web Audio API engine, procedural cartoon sound effects generator, audio track mixing
└── components/
    ├── Header.tsx                   # Top studio bar: Title rename, aspect ratios (16:9, 9:16, 1:1), doc download, undo/redo, export, recording
    ├── StageCanvas.tsx              # Interactive viewport: selection gizmos, drag-to-move, floating character/layer toolbar (up/down/minimize)
    ├── SimplePerformanceMode.tsx    # Live Performance deck: auto-keyframing, clickable keyframes strip, prev/next step, SFX soundboard
    ├── CharacterCustomizer.tsx      # Deep avatar customization: hair, beard/mustache, Desi outfits, colors, accessories
    ├── BackgroundManager.tsx        # Preset backdrops (Village, Street, Living Room, Classroom), custom upload, color fills
    ├── AssetLibrary.tsx             # Movable props & animated vehicles (rickshaw, car, bicycle, boat, clouds)
    ├── AudioPanel.tsx               # Audio tracks mixer, microphone recording, timeline placement
    ├── SceneManager.tsx             # Multi-scene management, duration per scene, scene ordering, duplication
    ├── Timeline/
    │   └── Timeline.tsx             # Multi-track keyframe sequencer: time ruler, playhead scrubbing, diamond markers, keyframe inspector
    ├── ExportModal.tsx              # Real-time scene renderer & video export dialog
    ├── RecordingModal.tsx           # Screen recording stream capture modal
    └── HelpModal.tsx                # Keyboard shortcuts, user manual, and copy/download system blueprint
```

---

## 3. Core Data Types & Schema (`src/types/animation.ts`)

### 3.1 Character Actions & Expressions
```typescript
export type CharacterType = 'male' | 'female' | 'boy' | 'girl';

export type CharacterAction =
  | 'idle'
  | 'standing'
  | 'walking'
  | 'running'
  | 'sitting'
  | 'talking'
  | 'waving'
  | 'pointing'
  | 'raising_hands'
  | 'laughing'
  | 'crying'
  | 'thinking'
  | 'shaking_head'
  | 'nodding';

export type CharacterExpression =
  | 'neutral'
  | 'happy'
  | 'smiling'
  | 'sad'
  | 'angry'
  | 'surprised'
  | 'laughing'
  | 'crying'
  | 'thinking';

export type GazeDirection = 'center' | 'left' | 'right' | 'up' | 'down';
export type MouthShape = 'closed' | 'smile' | 'open_o' | 'wide' | 'frown' | 'talk_a' | 'talk_e' | 'talk_o';
```

### 3.2 Outfits & Cultural Styles
```typescript
export type Hairstyle =
  | 'short_messy' | 'quiff_pompadour' | 'side_part' | 'spiky' | 'bob'
  | 'long_wavy' | 'ponytail' | 'pigtails' | 'curly' | 'afro_curls'
  | 'top_knot' | 'curtain_bangs' | 'braids' | 'pixie_cut' | 'bald';

export type FacialHair =
  | 'none' | 'mustache' | 'handlebar_mooch' | 'thin_mustache' | 'roabdar_mustache'
  | 'walrus_mustache' | 'goatee' | 'french_beard' | 'stubble' | 'simple_beard'
  | 'full_beard' | 'long_traditional_beard' | 'bushy_desi_beard' | 'chin_strap';

export type AccessoryStyle =
  | 'none' | 'baseball_cap' | 'beanie' | 'headphones' | 'bow_tie' | 'ribbon'
  | 'police_hat' | 'turban_pagri' | 'sindhi_topi' | 'namaz_prayer_cap' | 'balochi_turban'
  | 'wedding_kulah' | 'dupatta_shoulder' | 'dupatta_head' | 'wedding_haar_mala'
  | 'bridal_matha_patti' | 'gold_jhumkas' | 'party_hat' | 'gold_crown';

export type OutfitStyle =
  | 'tshirt' | 'hoodie' | 'shirt' | 'dress'
  // Pakistani / Desi Men's & Women's
  | 'mens_shalwar_kameez' | 'waistcoat_shalwar_kameez' | 'kurta_pajama' | 'sherwani'
  | 'dulha_wedding' | 'village_desi' | 'old_traditional'
  | 'womens_shalwar_kameez' | 'saree' | 'lehenga_bridal' | 'dulhan_wedding'
  // Professions & Comedy
  | 'school_uniform' | 'office_formal' | 'shopkeeper' | 'farmer' | 'mechanic'
  | 'police_uniform' | 'doctor_coat' | 'teacher_outfit'
  | 'torn_phati_shirt' | 'patched_shalwar_kameez' | 'poor_village' | 'oversized_funny'
  | 'dirty_work_clothes' | 'funny_jester';
```

### 3.3 Keyframes & Project Structure
```typescript
export interface CharacterKeyframe {
  id: string;
  time: number;          // Playhead timestamp in seconds (rounded to 0.1s)
  x: number;             // Percentage of canvas width (0 - 100)
  y: number;             // Percentage of canvas height (0 - 100)
  scale: number;         // Scaling factor (0.2 to 2.5)
  rotation: number;      // Degrees (-180 to 180)
  flipX: boolean;        // Facing left (true) or right (false)
  action: CharacterAction;
  expression: CharacterExpression;
  gaze: GazeDirection;
  isTalking: boolean;    // Dialogue lip-sync animated visemes active
  opacity: number;       // 0 to 1
}

export interface SceneCharacter {
  id: string;
  name: string;
  type: CharacterType;
  appearance: CharacterAppearance;
  zIndex: number;
  keyframes: CharacterKeyframe[];
}

export interface ImageOverlayKeyframe {
  id: string;
  time: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  flipX?: boolean;
}

export interface ImageOverlayLayer {
  id: string;
  name: string;
  imageUrl: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  visible: boolean;
  flipX?: boolean;
  animationType?: 'none' | 'drive_left' | 'drive_right' | 'bounce_idle' | 'floating_boat';
  animationSpeed?: number;
  keyframes?: ImageOverlayKeyframe[];
}

export interface AnimationScene {
  id: string;
  name: string;
  duration: number; // in seconds (e.g. 5.0s, 10.0s)
  background: BackgroundSettings;
  characters: SceneCharacter[];
  audioTracks: AudioTrackItem[];
  imageLayers?: ImageOverlayLayer[];
}

export interface AnimationProject {
  version: string;
  settings: {
    id: string;
    name: string;
    aspectRatio: '16:9' | '9:16' | '1:1';
    fps: number;
    exportResolution: '1080p' | '720p';
  };
  scenes: AnimationScene[];
  activeSceneId: string;
}
```

---

## 4. Keyframe System & Interpolation Engine (`src/renderer/sceneRenderer.ts` & `src/context/ProjectContext.tsx`)

### 4.1 The Fundamental Animation Rule (Action Holding During Locomotion)
In classic keyframe animation, if a character is at 0.0s with action walking at X=20, and moves to 4.0s with action standing at X=80:
- **Incorrect (Naive) behavior:** Swapping the action at the 50% midpoint (2.0s) causes the character to stand still while sliding across the floor from 2.0s to 4.0s.
- **Correct ToonCraft behavior:**
  1. The character **maintains the source action (walking)** for the entire travel distance.
  2. A smooth cross-fade window occurs only in the final 25% of the keyframe span (or last 0.4s, whichever is smaller):
     transitionWindow = Math.min(0.4, span * 0.25)
     timeUntilNext = next.time - time
     actionProgress = 1 - (timeUntilNext / transitionWindow)
  3. When actionProgress >= 0.5, the destination action takes over smoothly right as the character halts at their destination.

### 4.2 Spatial Linear Interpolation (Lerp)
Coordinates (x, y), scale, rotation, and opacity are smoothly lerped:
progress = (time - prev.time) / (next.time - prev.time)
coord = prev + (next - prev) * progress

### 4.3 Keyframe Matching & Creation Tolerances
- **Standardized Tolerance:** Exactly 0.15s (150ms).
- When updateCharacterAtCurrentTime is invoked:
  1. Checks if an existing keyframe exists within Math.abs(keyframe.time - roundedTime) < 0.15s.
  2. **If found:** Updates only the specified properties (action, expression, isTalking, flipX, etc.) on that specific keyframe. Other keyframes remain untouched!
  3. **If not found:** Samples the current interpolated pose and position at roundedTime, creates a brand new CharacterKeyframe, merges the updates, and appends it sorted by timestamp.

---

## 5. Procedural Character Rigging & Kinematics Engine (`src/renderer/characterRig.ts`)

Characters are drawn purely via procedural vector maths in drawCartoonCharacter(...). No bitmap spritesheets are used.

### 5.1 Kinematic Bone Angles
The rig dynamically computes joint angles based on the current action and continuous cycle time T:
- **Walk Cycle:**
  cycleSpeed = 7.0
  legSwing = Math.sin(T * cycleSpeed) * 0.45 rad
  armSwing = -Math.sin(T * cycleSpeed) * 0.40 rad
  bobbing = -Math.abs(Math.sin(T * cycleSpeed)) * 8 px

- **Run Cycle:**
  cycleSpeed = 12.0
  legSwing = Math.sin(T * cycleSpeed) * 0.85 rad
  kneeBend = Math.max(0, Math.cos(T * cycleSpeed)) * 0.9 rad
  armSwing = -Math.sin(T * cycleSpeed) * 0.95 rad
  bobbing = -Math.abs(Math.sin(T * cycleSpeed)) * 16 px

- **Wave Cycle:**
  Upper arm raised 130 deg, forearm oscillates:
  handAngle = Math.sin(T * 9.0) * 0.5 rad

- **Layer Ordering of Limbs (Crucial for Depth):**
  1. Back Arm (behind torso)
  2. Back Leg
  3. Torso & Pelvis
  4. Outfit / Shalwar Kameez
  5. Front Leg
  6. Neck & Head
  7. Facial Features & Visemes
  8. Hair & Headwear (Pagri, Sindhi Topi, Caps)
  9. Front Arm (in front of torso)

### 5.2 Dynamic Mouth Visemes (Dialogue Lip-Sync)
When isTalking is true:
- An oscillating viseme clock cycles through phoneme shapes:
  visemeClock = Math.floor(T * 11) % 5
  - 0: talk_a (medium open mouth)
  - 1: talk_o (round open lips)
  - 2: talk_e (wide teeth smile shape)
  - 3: wide (stressed vowel)
  - 4: closed (bilabial plosive: m/b/p)

---

## 6. On-Canvas Interactive Controls & Floating Bar (`src/components/StageCanvas.tsx`)

### 6.1 Direct Stage Manipulation
- **Click Selection:** Clicking on a character or image overlay selects it with an animated glowing selection box and resize handles.
- **Dragging on Canvas:**
  - Dragging a character dynamically updates their (X, Y) position at the current playhead.
  - If the playhead is on a keyframe, that keyframe's (X, Y) is updated. If between keyframes, a keyframe is auto-stamped at that time.
- **Multi-Touch / Canvas Zoom:** Zoom in, zoom out, fit to viewport (100%).

### 6.2 Floating Character Quick Toolbar
When a character is selected and the timeline is paused, a floating control deck renders with the following capabilities:
1. **Vertical Mobility ("Upar / Neeche Karna"):**
   - **Move Down / Move Up Toggle:** Instant button with ArrowDown / ArrowUp switching between docked top (top-4) and docked bottom (bottom-16).
   - **Free Drag Grip Handle (GripVertical):** Users can hold the handle and drag the bar to any arbitrary vertical Y position on the screen without covering their scene.
2. **Minimization ("Minimize Karna"):**
   - **Minimize Button (Minimize2):** Collapses the large toolbar into an ultra-compact floating pill showing:
     - 🎭 Character name
     - Current action icon + label
     - Keyframe time (💎 KF @ 4.0s)
     - Move Up/Down toggle
     - **Expand Button (Maximize2)**
3. **Comprehensive Action Tools on the Bar:**
   - Prev/Next keyframe step jump buttons (ChevronLeft, ChevronRight)
   - Keyframe stamp/status badge
   - Total scene keyframe counter (X kf)
   - Action dropdown (All 14 cartoon actions)
   - Expression dropdown (All 9 facial morphs)
   - 🗣️ Lip-sync Talking toggle button
   - ⇄ Horizontal Flip toggle
   - Size Scale (+ / - 10%)
   - Rotate tilt (+15 deg)
   - Layer ordering (Bring Forward / Send Backward Z-Index)
   - Delete Keyframe (if on a keyframe)
   - Remove character from scene

---

## 7. Simple Performance Mode (`src/components/SimplePerformanceMode.tsx`)

Located both in the top header quick deck and inside the sidebar:
- **Instant Character Selector:** Pick between active characters in the scene.
- **Keyframe Pills Strip:** Displays every keyframe in the scene as an interactive badge:
  [💎 0.0s: 🚶 Walking] [💎 4.0s: 🧍 Standing]
  - Clicking any pill snaps the timeline to that exact timestamp.
  - The active keyframe has an amber glow ring.
- **Interactive Action & Expression Grids:**
  - Clicking any cartoon action or facial expression triggers updateCharacterAtCurrentTime.
  - Plays a sound effect confirmation (click or pop).
  - Displays a temporary live confirmation toast: e.g., Action "Walking" recorded to keyframe @ 0.0s.
  - Guarantees complete keyframe independence: Changing an action at 4.0s never alters or breaks the keyframe at 0.0s.
- **Instant SFX Soundboard:** Buttons to trigger comic whooshes, punches, boings, pops, and chimes.

---

## 8. Multi-Track Timeline Sequencer (`src/components/Timeline/Timeline.tsx`)

- **Playback Controls:** Play, Pause, Scrub, Loop, Jump to Start (0.0s), FPS settings (30/60).
- **Time Ruler:** Precision millisecond tick marks with draggable playhead scrubber.
- **Track Types:**
  1. Character Tracks: Row for each character showing diamond keyframe badges. Badges display emoji action icons.
  2. Image Layer Tracks: Keyframe tracking for moving props and vehicles.
  3. Audio Tracks: Waveform bars with volume, mute, and solo controls.
- **Keyframe Inspector Drawer:**
  - When clicking any keyframe diamond, an inspector panel opens allowing exact numerical editing of Time, X, Y, Scale, Rotation, Flip, Action, Expression, Gaze, Talking, and Keyframe Deletion.

---

## 9. Audio & Lip-Sync Synthesizer (`src/audio/audioManager.ts`)

- Uses Web Audio API without external sound files for core SFX:
  - **Click/Pop:** Short sine pitch-drop (800Hz -> 200Hz) over 50ms.
  - **Boing:** Modulated sine wave (150Hz -> 600Hz) with vibrato LFO.
  - **Punch/Hit:** Low-frequency pulse (120Hz) with white-noise burst.
  - **Whoosh:** Bandpass-filtered white noise sweeping from 300Hz -> 1800Hz -> 200Hz.
  - **Ding/Success:** High double sine chime (1046Hz -> 1318Hz) with smooth exponential decay.
- Supports external MP3/WAV uploads and microphone speech recording.

---

## 10. Project Serialization & Video Export (`src/components/ExportModal.tsx`)

### 10.1 Project JSON Format
Complete project state can be exported to and imported from a single JSON file. It stores settings, scenes, characters, image layers, audio tracks, and keyframes.

### 10.2 Video Export Pipeline
1. Renders the animation frame by frame or in real time to an off-screen canvas at full target resolution (1920x1080, 1080x1920, or 1080x1080).
2. Uses canvas.captureStream(fps) and passes stream into MediaRecorder.
3. Mixed audio from AudioContext.createMediaStreamDestination() is attached.
4. Generates standard .webm or .mp4 video downloadable directly from the browser without server dependencies.

---

## 11. Step-by-Step Recreation Checklist

To rebuild this exact application in a new codebase:
1. **Setup:** Initialize React + Vite + TypeScript + Tailwind CSS. Install lucide-react.
2. **Types:** Copy src/types/animation.ts with all action, expression, outfit, and keyframe types.
3. **Audio:** Implement src/audio/audioManager.ts using native Web Audio API oscillators and gain nodes.
4. **Character Rig:** Implement src/renderer/characterRig.ts drawing procedural cartoon bodies, head morphs, visemes, and outfits.
5. **Renderer:** Implement src/renderer/sceneRenderer.ts with action holding (25% transition window) and linear coordinate interpolation.
6. **Context:** Implement src/context/ProjectContext.tsx with undo/redo history, state sampling, and standardized 0.15s tolerance.
7. **Stage Canvas:** Build src/components/StageCanvas.tsx featuring canvas rendering, gizmos, and the mobile/minimizable on-screen floating bar.
8. **Performance Mode:** Build src/components/SimplePerformanceMode.tsx with clickable keyframes strip and live action auto-stamping.
9. **Timeline:** Build src/components/Timeline/Timeline.tsx with time ruler, track diamonds, and keyframe inspector.
10. **Modals & Customizers:** Build CharacterCustomizer, BackgroundManager, AssetLibrary, AudioPanel, SceneManager, and ExportModal.
