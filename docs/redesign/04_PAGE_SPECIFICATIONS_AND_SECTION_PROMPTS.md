# Page Specifications & Section Design Blueprint

> **Architecture Overview**: Standardized specification for all 10 core sections of the redesigned TRAIC platform.

---

## Section 1: Navigation Bar (Desktop & Mobile)

### Desktop Navigation (`.header-nav`)
- **Container**: Floating translucent pill, `56px` height, centered at top with `max-width: 1140px`.
- **Material**: Translucent dark glass (`background: rgba(0, 0, 0, 0.65)`), `-webkit-backdrop-filter: blur(20px) saturate(180%)`, subtle 1px border.
- **Left Element**: Brand lockup linking to `#top`. Monoline TRAIC logo mark in `#64D2FF` cyan + "TRAIC" text in Semibold.
- **Center Element**: 5 semantic navigation destinations:
  1. *Disciplines* (`#build`)
  2. *Projects* (`#projects`)
  3. *Patents* (`#impact`)
  4. *Events* (`#events`)
  5. *Team* (`#team`)
- **Right Element**: Pill CTA button: **"Join TRAIC"** in Apple systemCyan (`#64D2FF`) with pure black text (`#000000`).
- **Dynamic Behavior**: `IntersectionObserver` scroll-spy updates `aria-current="page"` and silver-white text color on the active section.

### Mobile Navigation (`.mobile-tab-bar`)
- **Breakpoint**: Activates on screens $\le 960\text{px}$.
- **Position**: Floating bottom translucent dock, fixed at bottom in Steven Hoober's natural **One-Thumb Zone**.
- **Dimensions**: `height: 60px; max-width: 420px; border-radius: 9999px;`.
- **Tabs**: 5 icon-and-label tabs: *Home, Projects, Events, Team, Join* with 48px touch targets.

---

## Section 2: Hero Section (`.hero-section`)

- **Layout**: Centered, full-screen vertical alignment (`min-height: 100svh`).
- **Headline (H1)**:
  `"We build machines. We build <span class="text-accent">ideas.</span>"`
  - Size: `clamp(44px, 8.5vw, 88px)`. Semibold, line-height `1.05`, tight tracking `-0.035em`.
  - Only the word `"ideas."` receives the cyan accent (Von Restorff rule).
- **Subline**:
  `"Robotics, embedded systems, and machine intelligence, built by students at COER University."`
  - Size: `clamp(18px, 2.2vw, 22px)`, color: `rgba(235, 235, 245, 0.64)`.
- **CTAs**:
  - Primary: `<a href="#join" class="btn btn-primary">Join TRAIC</a>`
  - Secondary: `<a href="#projects" class="link-chevron">Explore our work ›</a>`
- **Visual Subject**: Clean silhouette of the autonomous robotics platform (`.hero-stage`) rising from the bottom edge against a subtle radial cyan rim light. Zero tacky neon rings or HUD brackets.

---

## Section 3: What We Build (`#build` - Bento Grid)

- **Eyebrow**: `"DISCIPLINES"`
- **Heading (H2)**: `"Innovation in every line of code."`
- **Sub-heading**: `"Six engineering verticals collaborating under one lab roof to build production hardware."`
- **Grid Layout**: 3-column Bento grid with `20px` gap:
  1. **Autonomous Robotics** (Large 2-column span card with hardware circuit schematic).
  2. **Embedded Systems** (Bare-metal C/C++, ARM Cortex, RTOS).
  3. **Connected IoT** (LoRa meshes, MQTT telemetry).
  4. **Applied Edge AI** (Computer vision, TensorRT, edge inferencing).
  5. **Unmanned Aerial Systems** (Custom quadcopter frames, flight telemetry).
  6. **Automation & Mechatronics** (Closed-loop motor control, actuators).
- **Card Aesthetics**: `#1C1C1E` dark surface, `24px` squircle corners, monoline SF-symbols icons, subtle 1px border.

---

## Section 4: Lab in Motion (`#lab` - Horizontal Gallery)

- **Eyebrow**: `"LAB IN MOTION"`
- **Heading (H2)**: `"Inside the workshop."`
- **Sub-heading**: `"From circuit schematics to physical fabrication, our rapid prototyping environment is open 24/7."`
- **Controls**: Circular 44px Previous and Next buttons with accessible `aria-label`s.
- **Carousel Engine**:
  - Horizontal scroll container (`scroll-snap-type: x mandatory`).
  - Cards: `480px` wide on desktop, `82vw` on mobile. `16:10` aspect ratio media container with captions below.
  - Cards featured: *Precision PCB Prototyping*, *Additive Manufacturing 3D Farm*, *Avionics Testing Bench*, *Optical Vision Calibration*.

---

## Section 5: Featured Projects (`#projects` - 2×2 Case Studies)

- **Eyebrow**: `"PORTFOLIO"`
- **Heading (H2)**: `"Built by students. Made to work."`
- **Sub-heading**: `"Selected open-source and patented systems engineered by TRAIC members."`
- **Grid Layout**: 2-column grid of large cards:
  1. **Atlas Autonomous Rover** (ROS2 Humble, 2D LiDAR, RTAB-Map SLAM).
  2. **GreenMind Polyhouse IoT** (ESP32-S3, LoRa SX1262, microclimate irrigation).
  3. **SkyFrame Surveying UAV** (PX4 Autopilot, 4K Gimbal, 28-min endurance).
  4. **SortBot Vision Workcell** (NVIDIA Jetson Orin Nano, Delta arm, 90 picks/min).
- **Interaction & Affordance**:
  - Each card is an interactive `<button type="button" class="project-card" aria-haspopup="dialog">`.
  - Clicking any card opens the accessible HTML5 `<dialog>` modal showing full technical narratives, BOM, and hardware specs.

---

## Section 6: Impact & Authority (`#impact` - Patents & Numbers)

- **Eyebrow**: `"IMPACT & AUTHORITY"`
- **Heading (H2)**: `"Ideas worth protecting."`
- **Sub-heading**: `"A single verified record of university research and field achievements."`
- **Single Source of Truth Numbers**:
  - `21` Years of Innovation
  - `100+` Shipped Projects
  - `500+` Engineers Mentored
  - `50+` National Trophies
- **Patent Spotlight Card**:
  - Title: *Adaptive SLAM Navigation System*
  - Badge: `Official Patent · Filed & Published`
  - Abstract: Proprietary indoor localization algorithm dynamically adjusting scan-matching weights against transient crowds.
- **Institutional Authority Strip**:
  - *COER University Innovation Cell • IEEE Student Branch • DST Hardware Grants • Industry Mentorship Panel*.

---

## Section 7: Events Section (`#events`)

- **Eyebrow**: `"EVENTS"`
- **Heading (H2)**: `"Come build with us."`
- **Sub-heading**: `"Hands-on hackathons, technical bootcamps, and competitive showcases."`
- **Layout**: 2-column split (1.25fr / 1fr):
  - **Left**: Featured upcoming event spotlight (*TRAIC National Hackathon 2026*, Nov 20–22, 2026) with live dynamic countdown pill (`diffDays > 0 ? "... days away" : "Event Live"`).
  - **Right**: Clean vertical stack of recent sessions (*Embedded Firmware Bootcamp*, *Edge AI on Jetson*, *Drone Derby*) separated by hairline dividers.

---

## Section 8: Team Section (`#team`)

- **Eyebrow**: `"LEADERSHIP"`
- **Heading (H2)**: `"The people behind the machines."`
- **Sub-heading**: `"Student researchers and lab domain leads guiding project execution."`
- **Grid Layout**: 4-column responsive grid with avatar monogram tokens, full student names, and domain roles (President, Lead Firmware, Hardware Lead, Research Lead).

---

## Section 9: Join TRAIC & Footer (`#join`)

- **Container**: Elevated `#1C1C1E` card with `32px` padding and soft borders.
- **Heading (H2)**: `"Build what's next with us."`
- **Sub-heading**: `"No prior robotics experience required. If you're passionate about software, electronics, or mechanical design, our lab is open."`
- **Value Reciprocity Strip**:
  - ✓ Free starter kit and component access
  - ✓ Mentorship from senior developers
  - ✓ University credit & patent collaboration
- **Recruitment Form**:
  - 3 primary inputs (Full Name, College Email, Domain of Focus).
  - Explicit DPDP Act 2023 Consent Checkbox.
  - Asynchronous submission simulation with inline loading state and accessible feedback.
- **Footer**:
  - 4 clean navigation columns (*Explore, Research, Community, Location*).
  - Club official creed: **"Honor · Honesty · Sacrifice"**.
  - Copyright line: `© 2026 The Robotics & Innovation Club (TRAIC), COER University.`
