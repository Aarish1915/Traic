# 03 — 3D Graphics Architecture & Cross-Device Engineering

## 1. High-Performance WebGL Engine Philosophy

The 3D graphics on the TRAIC website must not function as a frivolous decorative gimmick; they must serve as a **high-precision interactive engineering visualizer**. A user visiting the site—whether on an iPhone 11, a budget Android device, or a 4K dual-GPU desktop—must experience fluid, 60 FPS rendering with zero layout shift, zero battery overheating, and zero gesture collisions.

---

## 2. Cross-Device 3D Performance Budget

| Metric | Budget Target | Mobile Defense Strategy |
|---|---|---|
| **Frame Time** | $< 16.6\text{ms}$ ($60\text{ FPS}$) | Dynamic render loop (`demand` frameloop when idle; continuous spin only on hover/drag) |
| **GPU Memory (VRAM)** | $< 35\text{MB}$ total | Draco-compressed glTF meshes; downsampled $1024\times1024$ PBR texture atlases |
| **Draw Calls** | $< 45$ per frame | InstancedMesh for pins/vias; merged geometries for static chassis |
| **Device Pixel Ratio (DPR)** | Clamped $[1.0, 1.5]$ | Avoid rendering at native $3\times$ DPR on mobile, which burns GPU fill rate |
| **Initial JS Chunk Weight** | $< 80\text{KB}$ | Three.js core statically bundled; GLTFLoader and Draco decoders dynamically loaded on demand |

---

## 3. WebGL2 -> WebGL1 Context Probe & Lifecycle Management

### The Problem Solved
Historically, Three.js r170+ defaults strictly to WebGL2. On older iPhones (iPhone 11, XR) or low-end Android Blink webviews, attempting to allocate a WebGL2 context throws an uncaught exception, crashing the canvas and flashing an empty container. Furthermore, calling `renderer.forceContextLoss()` permanently disables WebKit's shared GPU context, preventing subsequent 3D modals from mounting.

### The Robust Dual-Probe Pipeline
```text
┌──────────────────────────────────────────────────────────┐
│                 CANVAS MOUNT EVENT                       │
└──────────────────────────┬───────────────────────────────┘
                           │
             ┌─────────────▼─────────────┐
             │ Probe 'webgl2' context    │
             └─────────────┬─────────────┘
                           │
              ┌────────────┴────────────┐
       Available?                  Failed?
              │                         │
     ┌────────▼────────┐       ┌────────▼────────┐
     │ Use WebGL2      │       │ Probe 'webgl'   │
     │ Hardware Engine │       │ Context Fallback│
     └─────────────────┘       └────────┬────────┘
                                        │
                           ┌────────────┴────────────┐
                    Available?                  Failed?
                           │                         │
                  ┌────────▼────────┐       ┌────────▼────────┐
                  │ Use WebGL1      │       │ Fallback to 2D  │
                  │ Render Pipeline │       │ Hi-Res CAD View │
                  └─────────────────┘       └─────────────────┘
```

### Context Disposal Guard
```typescript
// Safe cleanup: Never call renderer.forceContextLoss()
function disposeScene(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) {
        object.material.forEach((m) => m.dispose());
      } else if (object.material) {
        object.material.dispose();
      }
    }
  });
  renderer.dispose();
}
```

---

## 4. Mobile Touch Disambiguation Matrix

One of the worst user experiences on mobile is a canvas that "steals" vertical scrolling, causing the user to get trapped while trying to swipe down the page.

### The Two-Finger vs One-Finger Disambiguation Standard
1. **Vertical Page Scroll Freedom**:
   - The outer canvas container has `touch-action: pan-y`. Single-finger vertical swipes are immediately handled by the browser's native scroll engine with zero resistance.
2. **Turntable Rotation (Intentional Horizontal Drag)**:
   - When a touch gesture starts with $|\Delta X| > |\Delta Y| \times 1.4$, horizontal turntable rotation activates, calling `e.preventDefault()` only after horizontal intent is established.
3. **Pinch-to-Zoom & Dual Touch**:
   - When `e.touches.length === 2`, standard pinch distance calculation scales the camera FOV / distance smoothly, with `overscroll-behavior: contain` to prevent browser page zooming or pull-to-refresh triggers.
4. **Touch Guidance HUD**:
   - On mobile touch screens, a subtle high-tech translucent HUD tag (`[ ↔ Swipe to Rotate • Pinch to Zoom ]`) fades in on initial scroll view and gently fades out after first touch.

---

## 5. Exploded CAD & Interactive PCB Hardware Inspection

To elevate the site from an amateur showcase to a senior engineering platform, the 3D modal offers true functional hardware introspection:

### A. Real Engineering Models Tailored to Project Types
1. **Robotics (UGV / Drone / Arm)**:
   - Chassis: Lightweight carbon fiber frame with visible hex bolts.
   - Drivetrain: 4 off-road planetary hub motors with rubber tread textures.
   - Sensor Mast: Rotating 360° LiDAR puck with raycasted distance scan points, stereo depth cameras, and GNSS antenna.
2. **Semiconductor / PCB (Edge Neural Board)**:
   - 4-layer FR4 PCB with green/black solder mask, gold-plated ENIG vias, and glowing differential signal traces.
   - Central MCU: STM32H7 Dual-Core with metallic heat spreader and pin 1 index dot.
   - Edge Accelerator: Hailo-8 M.2 module with heatsink fins.

### B. Interactive Exploded View Mode (`Explode` Slider)
* By toggling the **EXPLODED VIEW** slider, an anime.js / Three.js tween offsets internal sub-assemblies along their normal vectors:
  - Top LiDAR and camera assembly translates $+Y$ by $2.5\text{ units}$.
  - Motor hub wheels translate $\pm X$ by $1.8\text{ units}$.
  - PCB layers separate vertically ($0.6\text{ units}$ between Ground, Power, Signal, and Component planes).

### C. Component Raycasting & Spec Tooltips
* Hovering or tapping on any hardware component casts a ray from the camera, highlighting the component with an electric cyan wireframe outline and popping up an engineering telemetry HUD:
  - **Component**: STM32H743ZI
  - **Function**: Primary Flight / Motor Controller
  - **Clock Speed**: 480 MHz ARM Cortex-M7
  - **Bus Interface**: CAN-FD, SPI, I2C, USART
