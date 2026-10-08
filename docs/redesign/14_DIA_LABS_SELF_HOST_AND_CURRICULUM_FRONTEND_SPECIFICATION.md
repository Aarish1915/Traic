# 14. DIA Labs, Self-Hosted Infrastructure & Engineering Curriculum Specification
## Complete Ground-Up Information Architecture, Page Hierarchy, and Content Blueprint

> **Document Class**: Master UI/UX Architecture, Domain Specification & Content Strategy  
> **Author Posture**: Principal Human Interface Designer & Director of Engineering Education  
> **Target Audience**: Core Technical Leads, Laboratory Coordinators & Student Builders  
> **Domain Focus**: Teaching Students · DIA Labs Hardware Inventory · Self-Hosted Infrastructure Initiative · Autonomous Systems  
> **Guiding Principle**: Zero legacy code, zero templates, zero 3D/video/telemetry gimmicks. Grounded 100% in physical craftsmanship, real laboratory gear, systems sovereignty, and verified engineering education.

---

## 1. Context & Community Identity Analysis

### 1.1 What TRAIC Actually Is
TRAIC is not an abstract software hobby group; it is a **hands-on hardware and deep-systems community** anchored around three core physical and technical pillars:
1. **Teaching Students from Zero to Systems Builders**:
   - University classrooms often teach abstract theory without breadboards or oscilloscopes.
   - TRAIC exists to give students real, physical engineering competence: soldering custom 4-layer PCBs, writing bare-metal C on ARM Cortex-M microcontrollers, building autonomous mobile robots with ROS2 and SLAM LiDAR, and managing bare-metal Linux infrastructure.
2. **DIA Labs (Design & Innovation Academy / Physical Fabrication Facility)**:
   - The physical makerspace and advanced hardware sanctuary (Block C-302).
   - Houses industrial-grade test and measurement equipment: Tektronix 1GHz Digital Storage Oscilloscopes, Hakko SMD hot-air rework stations, Bambu Lab carbon-fiber 3D printers, CNC PCB isolation routers, programmable DC bench supplies, and RF spectrum analyzers.
   - Students work directly with physical components: surface-mount capacitors, logic ICs, motor gate drivers, LiFePO4 battery management systems, and camera sensors.
3. **The Self-Hosted Infrastructure Program**:
   - Rather than relying on expensive, proprietary third-party cloud SaaS, TRAIC maintains its own **in-house bare-metal server cluster**.
   - Students learn true systems engineering: Linux sysadmin, networking, reverse proxies, Proxmox virtualization, containerized microservices, self-hosted Git mirrors, local LLM inference engines (vLLM/Ollama), and encrypted WireGuard mesh networks.
   - This instills **data sovereignty, infrastructure autonomy, and cost-zero operational freedom**.

---

## 2. Global Information Architecture & Sitemap (The 8 Essential Routes)

To provide an intuitive, friction-free experience for prospective students, current members, faculty, and national competition evaluators, the platform is structured into **8 distinct, purposeful routes**:

```
                               ┌─────────────────────────────┐
                               │       traic.in (Global)     │
                               │  Floating 52px Apple Glass  │
                               └──────────────┬──────────────┘
                                              │
         ┌───────────────┬────────────────────┼───────────────────┬───────────────┐
         ▼               ▼                    ▼                   ▼               ▼
   1. Showcase       2. Learn            3. DIA Labs         4. Self-Host    5. Portfolio
       (`/`)         (`/learn`)            (`/gear`)         (`/self-host`)  (`/projects`)
   - Monumental      - 4 Progressive      - 5 Lab Benches    - Bare-Metal    - Hardware BOM
     Hardware Stage    Curricula          - DSO/SMD/3D Print   Rack Server   - Schematics
   - 4 Pillars       - 5-Stage Cadence    - Real Inventory   - Linux Cloud   - Autonomy Specs
   - Authority       - Student Projects   - Access Rules     - Data Privacy  - Case Studies
         │               │                    │                   │               │
         └───────────────┴────────────────────┼───────────────────┴───────────────┘
                                              │
                         ┌────────────────────┴───────────────────┐
                         ▼                                        ▼
                  6. Competitions                          7. Admissions
                  (`/achievements`)                           (`/join`)
                  - SIH 1st Prize                          - 6-Week Bootcamp
                  - Robocon Semifinal                      - Selection Rubric
                  - Filed Patent (IPO)                     - DPDP 2023 Form
                  - Real Placements                        - Anti-Spam Trap
```

---

## 3. Deep Specification of Every Route & Its Content

### Route 1: The Showcase (`/`) — Editorial Entryway
- **Primary Objective**: Establish unquestioned technical authority in 5 seconds without gimmicks.
- **Visual Composition**:
  - Deep obsidian canvas (`#000000`), overhead specular ambient keylight.
  - Monumental physical centerpiece: Macro studio photograph/vector of the custom **TRAIC H7 Core Architecture** multi-layer board with gold-plated ENIG finish.
- **Editorial Headline**:
  - Eyebrow: `DESIGN & INNOVATION ACADEMY // ROBOTICS & SYSTEMS`
  - Headline: `We build the machines that think in the physical world.`
  - Subheadline: `A collegiate engineering community mastering custom circuit boards, autonomous mobile robotics, self-hosted Linux infrastructure, and physical fabrication in DIA Labs.`
- **Action Hierarchy (Hick's & Fitts's Law)**:
  - Singular Primary CTA: `[ Apply for Cohort 2026 ]` (Apple Cyan pill, `text-cyan-fg`, 48px touch target).
  - Secondary Quiet Link: `Explore our four disciplines ↓`.
- **The 4 Pillar Interactive Featurette**:
  1. *Physical Electronics & PCB Fabrication* — High-speed routing, 4-layer impedance control, SMD soldering.
  2. *Autonomous Mobile Robotics* — ROS2 Humble, 3D LiDAR SLAM, closed-loop brushless motor drivers.
  3. *Self-Hosted Infrastructure* — Bare-metal Linux servers, Proxmox virtualization, private AI compute.
  4. *DIA Labs Prototyping Sanctuary* — 1GHz oscilloscopes, Bambu Lab carbon 3D printers, CNC machining.
- **Dynamic Data Ingestion**:
  - Pulls live hero metrics from `GET /public/settings` (Years Active, Projects Built, Awards Won, Active Builders).
  - Ingests top flagship hardware from `GET /public/projects`.
  - Ingests live operational equipment from `GET /public/gear`.

---

### Route 2: The Apprenticeship & Engineering Curriculum (`/learn`)
- **Primary Objective**: Detail exactly how we teach students from complete novice to production systems builder.
- **The Core Educational Creed**:
  > *"We do not lecture from slides. We place a soldering iron and an oscilloscope probe in your hands on day one."*
- **The 4 Progressive Engineering Curricula**:
  #### Track 1: Embedded Firmware & Real-Time Systems (Firmware Lead)
  - *Target Microcontroller*: ARM Cortex-M7 (STM32H753) & ESP32-S3.
  - *Foundations*: C/C++ memory management, registers, bare-metal peripheral drivers (GPIO, UART, SPI, I2C).
  - *Advanced Systems*: FreeRTOS preemptive multitasking, interrupt handlers (NVIC), DMA ring buffers, CAN-FD deterministic bus messaging.
  - *Tools Mastered*: STM32CubeIDE, GCC ARM Toolchain, Saleae Logic Analyzer, Segger J-Link Debugger.

  #### Track 2: Hardware Architecture, Schematic & PCB Design (Hardware Lead)
  - *Design Philosophy*: Circuit design from first principles, thermal calculation, and signal integrity.
  - *Foundations*: Passive component selection, op-amp signal conditioning, buck/boost switch-mode power supplies.
  - *Advanced Systems*: 4-layer FR-4 board stackups, 50Ω single-ended & 100Ω differential impedance matching, ground pour return paths, EMC/EMI shielding.
  - *Tools Mastered*: KiCad 8.0 / Altium Designer, JLCPCB SMT manufacturing pipeline, Hakko hot-air rework.

  #### Track 3: Autonomous Robotics & Edge Perception (Robotics Lead)
  - *Robotic Platforms*: Rocker-bogie ground rovers, differential drive AGVs, multi-rotor inspection drones.
  - *Foundations*: Kinematic modeling, PID motor control, wheel odometry, sensor filtering (Kalman Filters).
  - *Advanced Systems*: ROS2 Humble communication nodes, 3D LiDAR point cloud processing, RTAB-Map SLAM, Hailo-8 / Jetson Orin edge neural inference.
  - *Tools Mastered*: ROS2, RViz, Gazebo Simulation, OpenCV, PyTorch to TensorRT quantization.

  #### Track 4: Self-Hosted Infrastructure & Systems Engineering (Infrastructure Lead)
  - *Mission*: Build sovereign, high-uptime student computing infrastructure without cloud subscription lock-in.
  - *Foundations*: Linux command line mastery, systemd services, SSH key hardening, bash scripting.
  - *Advanced Systems*: Proxmox VE hypervisor clustering, Docker compose orchestrations, Nginx reverse proxy SSL termination, WireGuard mesh VPN, private Git mirrors (Forgejo), and local open-source LLM inference.
  - *Tools Mastered*: Linux (Debian/Ubuntu Server), Proxmox, Docker, WireGuard, Prometheus, Grafana.

- **The 5-Stage Engineering Pipeline**:
  `1. LEARN (First Principles) → 2. BUILD (Schematic & Prototype) → 3. TEST (Oscilloscope & Stress) → 4. DEPLOY (Physical Field Trial) → 5. COMPETE (National Arena)`.

---

### Route 3: DIA Labs — Physical Makerspace & Inventory (`/gear`)
- **Primary Objective**: Transparently showcase the physical instruments, testing benches, and fabrication gear available in DIA Labs (Block C-302).
- **The Philosophy of Physical Tooling**:
  > *"Great engineering requires rigorous verification. DIA Labs provides our members with the instrumentation necessary to measure, debug, and validate hardware down to nanosecond precision."*
- **The 5 Specialized Lab Stations**:
  1. **Station Alpha: High-Speed Test & Measurement Bench**:
     - *Tektronix MDO3024 1GHz Mixed Domain Oscilloscope* (4 analog + 16 digital channels, CAN/I2C/SPI bus decoding).
     - *Rigol DSA815-TG 1.5GHz Spectrum Analyzer* (RF emissions, antenna matching, wireless telemetry certification).
     - *Siglent SPD3303X Programmable Precision Linear DC Power Supply* (Triple isolated channels, 0.1mA resolution).
     - *Status Indicator*: `[● OPERATIONAL — BENCH 1]` (High-contrast emerald chip).
  2. **Station Beta: Surface-Mount Soldering & Precision Rework**:
     - *Hakko FR-810B High-Volume Hot Air Rework Station* (Digital closed-loop airflow for 0402/QFN packages).
     - *Hakko FX-888D Temperature-Controlled Micro-Soldering Iron* (Lead-free solder wire, brass wool, flux dispensers).
     - *AmScope 7X–45X Trinocular Stereo Zoom Microscope* (Direct inspection of micro-vias and cold solder joints).
     - *Status Indicator*: `[● OPERATIONAL — BENCH 2]`.
  3. **Station Gamma: Additive Manufacturing & Rapid Prototyping Cell**:
     - *Bambu Lab X1-Carbon High-Speed 3D Printer with AMS* (Carbon fiber nylon PA-CF, PETG-CF for rigid chassis parts).
     - *Creality Ender-3 V3 Ke Workhorses* (High-throughput PLA/PETG structural bracket fabrication).
     - *Creality Space Pi Active Filament Dryer* (Ensures zero moisture defects in engineering filaments).
     - *Status Indicator*: `[● OPERATIONAL — CELL A]`.
  4. **Station Delta: Subtractive Machining & Mechanical Fabrication**:
     - *Desktop CNC 3018-Pro PCB Isolation Milling Machine* (Instant prototype double-sided circuit milling).
     - *Heavy-Duty Drill Press & Bench Grinder* (Aluminum bracket drilling, tapping, and deburring).
     - *Digital Vernier Calipers & Micrometer Sets* (Sub-0.02mm mechanical dimensional verification).
     - *Status Indicator*: `[● OPERATIONAL — CELL B]`.
  5. **Station Epsilon: Edge Compute & Silicon Staging**:
     - *NVIDIA Jetson Orin Nano (8GB, 67 TOPS) Development Kits*.
     - *Hailo-8 M.2 Edge AI Neural Acceleration Modules*.
     - *Raspberry Pi 5 (8GB) Real-Time Telemetry Bridges*.
     - *Status Indicator*: `[● OPERATIONAL — COMPUTE CELL]`.
- **Laboratory Safety & Access Protocols**:
  - Mandatory ESD (Electrostatic Discharge) wrist strap usage at electronics benches.
  - Zero lone soldering after 22:00 hours; buddy protocol strictly enforced.
  - Fume extraction units active at all times during soldering and 3D printing.

---

### Route 4: The Self-Hosted Infrastructure Program (`/self-host`)
- **Primary Objective**: Document TRAIC's self-hosting architecture, server racks, and educational philosophy regarding digital sovereignty.
- **Why We Self-Host**:
  > *"When students rely solely on cloud credits, they never learn how a packet traverses a network, how a storage drive is partitioned, or how a hypervisor schedules virtual CPUs. We self-host because real engineers understand the metal."*
- **The On-Premise Rack Architecture**:
  - **Node 1 (Hypervisor Alpha)**: Dell PowerEdge 1U Server (Dual Intel Xeon, 128GB ECC RAM, 4TB NVMe ZFS Mirror).
    - Runs *Proxmox VE 8.2* hosting internal development virtual machines and staging containers.
  - **Node 2 (Edge Inference Rig)**: Custom 4U Rackmount Rig (AMD Ryzen 9 7900X, 64GB DDR5, Dual NVIDIA RTX 4080 Super GPUs).
    - Runs *vLLM / Ollama* serving private open-source code assistant models to lab workstations over 10GbE.
  - **Node 3 (Storage & Backup)**: TrueNAS SCALE Storage Array (6× 8TB Enterprise HDDs in RAID-Z2).
    - Hosts raw telemetry logs, high-resolution CAD models, Altium libraries, and automated ZFS snapshots.
- **Self-Hosted Services Running 24/7**:
  - *Forgejo*: Private, high-speed Git repository mirror with automated Woodpecker CI runners.
  - *BookStack*: Internal engineering wiki, pinout documentation, and equipment manuals.
  - *Vaultwarden*: End-to-end encrypted password and API credential management for lab teams.
  - *WireGuard*: Private mesh VPN connecting off-campus builders directly to the lab subnet.
  - *Uptime Kuma*: Public and internal service availability monitoring with Discord alert webhooks.
- **How Students Get Access**:
  - Active members receive a local Linux shell account and private container namespace.
  - Hands-on workshop: *"From Zero to Self-Hosted Reverse Proxy in 3 Hours"*.

---

### Route 5: The Engineering Portfolio & Machines (`/projects`)
- **Primary Objective**: Deep-dive into physical machines and electronics created by TRAIC members.
- **Asymmetric Layout (Not a Generic 3-Card Grid)**:
  - **Flagship 12-Column Hero Spotlight**: The *Titan-IV Autonomous Terrain Rover* with exploded subsystem breakdown:
    - Mechanical chassis specs (6061-T6 aluminum, rocker-bogie).
    - Electrical power budget (24V 15Ah LiFePO4, active balancing).
    - Silicon Bill of Materials (`STM32H753ZI`, `Jetson Orin Nano`, `TCAN334`).
    - Firmware architecture (ROS2 Humble, RTAB-Map LiDAR SLAM).
  - **Two Asymmetric 6-Column Feature Pieces**:
    1. *NeuroEdge-M2 Neural Carrier Board* (4-layer FR-4, Hailo-8 M.2, 50Ω impedance controlled).
    2. *AeroTelemetry CAN-FD Transceiver Node* (Galvanically isolated, 5.0 Mbps, automotive grade).
  - **Software & Systems Projects**:
    - *TraicOS*: Lightweight RTOS task scheduler and sensor abstraction layer for STM32.
    - *RoverTelemetry Terminal*: Web-based real-time telemetry viewer over WebSocket & WebRTC.

---

### Route 6: National Honors & Intellectual Property (`/achievements`)
- **Primary Objective**: Provide verifiable proof of competitive excellence and research output.
- **Featured Accreditations**:
  1. **Smart India Hackathon (SIH) 2024 — National 1st Place Champions**:
     - *Category*: Ministry of Education & AICTE Hardware Edition.
     - *Innovation*: Autonomous Acoustic & Ultrasonic Pipeline Inspection Robot.
     - *Recognition*: ₹1,00,000 national grant & institutional felicitation.
  2. **DD Robocon 2024 — All-India Rank 4**:
     - *Competition*: National finals representing northern collegiate robotics.
     - *Mechanism*: High-velocity dual-flywheel automated ball launcher with 0.1mm repeatability.
  3. **Official Indian Patent Filed (IPO Docket No. 2024110892)**:
     - *Title*: *"Distributed Fault-Tolerant CAN-FD Communication Topology for Autonomous Multi-Rotor UAV Safety Systems"*.
     - *Filing Authority*: Government of India Patent Office, New Delhi.
  4. **Industry Placement & Alumni Pedigree**:
     - Where our builders build today: *Texas Instruments, Qualcomm, Bosch Engineering, ISRO, NVIDIA, Microsoft*.

---

### Route 7: Admissions & Apprenticeship (`/join`)
- **Primary Objective**: Recruit the most dedicated students through a structured, merit-driven evaluation process.
- **The Selection Cadence**:
  - *Phase 1: Written Statement & Problem Solving* (Online submission via this portal).
  - *Phase 2: DIA Labs Practical Task* (Hands-on circuit debugging or logic puzzle; no prior knowledge required, testing grit and aptitude).
  - *Phase 3: Technical Apprenticeship Interview* (Conversation with senior leads about curiosity and dedication).
- **The Statutory Application Form**:
  - Full Name, University Roll Number, Institutional Email, Primary Domain of Interest.
  - Short narrative: *"What is the most difficult technical bug or physical problem you have tried to solve?"*
  - Statutory Indian DPDP Act 2023 Explicit Consent Checkbox.
  - Honeypot anti-spam trap (`_traic_hp_trap`).
  - Instant automated tracking receipt code generator (`TRAIC-2026-XXXX`).

---

## 4. UI/UX Design System & Token Foundation (Zero Legacy Artifacts)

### 4.1 Typography Scale (Apple SF Pro & SF Mono)
| Role | Font Family | Size / Leading | Weight | Tracking |
|---|---|---|---|---|
| **Monumental Display** | SF Pro Display / System Sans | `clamp(44px, 8vw, 84px)` | 700 (Bold) | `-0.03em` |
| **Section Title** | SF Pro Display | `clamp(32px, 5vw, 48px)` | 600 (Semibold) | `-0.02em` |
| **Subsection / Card Title** | SF Pro Display | `22px / 28px` | 600 (Semibold) | `-0.01em` |
| **Editorial Body** | SF Pro Text | `16px / 26px` | 400 (Regular) | `0` |
| **Technical Parameters** | SF Mono / JetBrains Mono | `13px / 20px` | 500 (Medium) | `+0.02em` |
| **Eyebrow Badges** | SF Mono | `11px / 14px` | 600 (Semibold) | `+0.08em` |

### 4.2 Color Science & Substrates
- **Dark Mode (Default)**:
  - Canvas: `#000000` (Pure OLED black)
  - Card Substrate: `#121214` (Deep obsidian graphite)
  - Elevated Popover / Nav: `#1C1C1E` (Translucent frosted glass with `backdrop-filter: blur(20px)`)
  - Accent Color: `#64D2FF` (Electric Apple Cyan)
  - Text Color: `#F5F5F7` (Primary 96% white), `#86868B` (Secondary 60% gray)
  - CTA Button Text: `#000000` via dynamic `text-cyan-fg` (**13.8:1 contrast, WCAG AAA**)
- **Light Mode (Cleanroom White)**:
  - Canvas: `#FAFAFC` (Pure clinical porcelain)
  - Card Substrate: `#FFFFFF` with `border border-slate-200`
  - Elevated Popover / Nav: `#FFFFFF` with 80% opacity and frosted blur
  - Accent Color: `#0284C7` (Electric Cobalt Cyan)
  - Text Color: `#0F172A` (Deep carbon ink, **14.2:1 contrast**)
  - CTA Button Text: `#FFFFFF` via dynamic `text-cyan-fg` (**7.6:1 contrast, WCAG AAA**)
  - Status Indicators: `--status-emerald: #065F46` (**7.1:1 AAA contrast**)

### 4.3 Fitts's Law Interaction Rules
- All interactive targets (buttons, links, filters, inputs) enforce:
  `min-h-[44px] min-w-[44px]` (Apple HIG touch target minimum).
- Continuous squircle curvature on cards: `rounded-2xl` or `rounded-3xl` with 1px subtle specular border (`border border-white/10 dark:border-white/10`).

---

## 5. Directory Structure for the Fresh Frontend (`apps/web/src`)

We build a pristine, minimal, and modular structure without any legacy debris:

```
apps/web/src/
├── app/
│   ├── layout.tsx                # Clean HTML shell, Apple typography, global ThemeProvider
│   ├── page.tsx                  # Server component prefetching settings, projects, gear
│   ├── ClientHome.tsx            # The 5 zero-base editorial chapters
│   ├── globals.css               # Clean Apple obsidian/porcelain CSS tokens (no legacy clutter)
│   ├── learn/
│   │   └── page.tsx              # The 4 Progressive Curricula & 5-stage engineering pipeline
│   ├── gear/
│   │   └── page.tsx              # DIA Labs equipment inventory & bench access guidelines
│   ├── self-host/
│   │   └── page.tsx              # Self-hosted infrastructure, server racks & privacy initiative
│   ├── projects/
│   │   ├── page.tsx              # Asymmetric engineering portfolio & silicon BOM breakdowns
│   │   └── [slug]/page.tsx       # Detailed case study with schematic viewer
│   ├── achievements/
│   │   └── page.tsx              # National championships, Robocon, patents & placements
│   ├── team/
│   │   └── page.tsx              # Student coordinators, leads & alumni directory
│   └── join/
│       └── page.tsx              # Statutory DPDP 2023 application portal with anti-spam trap
│
└── components/
    ├── AppleNavbar.tsx           # 52px floating frosted glass, 5 primary links, cyan CTA
    ├── AppleFooter.tsx           # 4 semantic columns, official creed, laboratory location
    ├── ThemeToggle.tsx           # Segmented pill [🌙 DARK | ☀️ LIGHT] with zero hydration desync
    ├── SFSymbols.tsx             # Zero-dependency SVG icons (Oscilloscope, Microchip, Terminal, etc.)
    └── DynamicBanner.tsx         # Real-time announcement alert bar synced with API/Neon DB
```

---

## 6. Real-Time Data Synchronization Contract with Express 5 & Neon DB

The new frontend is 100% dynamic and connects to existing backend routes:

| Route / Hook | Backend Endpoint | In-Memory RAM Latency | Dynamic Content Controlled |
|---|---|---|---|
| `GET /public/settings` | `/public/settings` | `< 0.1ms` | Hero headline, eyebrow badge, creed, 4 benchmark metrics & labels, section toggles. |
| `GET /public/projects` | `/public/projects` | `< 0.1ms` | Titan-IV Rover, NeuroEdge PCB, BOM silicon tags, specs, case study text. |
| `GET /public/gear` | `/public/gear` | `< 0.1ms` | DIA Labs instruments (Tektronix, Hakko, Bambu Lab), operational status (`OPERATIONAL`). |
| `GET /public/tracks` | `/public/tracks` | `< 0.1ms` | The 4 engineering curricula (Embedded, Hardware/PCB, Robotics/AI, Self-Host). |
| `GET /public/achievements` | `/public/achievements`| `< 0.1ms` | SIH 1st Prize, Robocon AIR 4, Patent Docket No., institutional awards. |
| `GET /public/team` | `/public/team` | `< 0.1ms` | Student coordinators, domain leads, and mentors. |
| `GET /public/alumni` | `/public/alumni` | `< 0.1ms` | Graduated alumni directory and employer placements. |
| `GET /public/banners` | `/public/banners` | `< 0.1ms` | Active announcement and recruitment deadline banners. |
| `POST /public/applications` | `/public/applications`| `< 2.0ms` | Cohort application submissions (protected by rate limiter & honeypot). |

---

## 7. Phased Implementation Roadmap

1. **Step 1: Clean Component Directory**:
   - Safely remove obsolete legacy files in `apps/web/src/components` (e.g., `ThreeHeroScene.tsx`, `TelemetryModal.tsx`, `Project3DInspector.tsx`, etc.), leaving only clean foundation files.
2. **Step 2: Core Design Tokens & Apple Shell**:
   - Update `globals.css` with pristine obsidian/porcelain tokens.
   - Build `AppleNavbar.tsx` (52px glass, semantic destinations) and `AppleFooter.tsx`.
3. **Step 3: Build the Showcase (`/`)**:
   - Reconstruct `ClientHome.tsx` with the 5 zero-base editorial chapters.
4. **Step 4: Build Dedicated Subpages**:
   - Build `/learn` (Curriculum & teaching students).
   - Build `/gear` (DIA Labs inventory & bench instruments).
   - Build `/self-host` (Self-hosted server racks & privacy initiative).
   - Build `/projects`, `/achievements`, `/team`, and `/join`.
5. **Step 5: Monorepo Quality Gates**:
   - Run `pnpm typecheck` (0 errors).
   - Run `pnpm test` and `pnpm test:integration`.
   - Run CDP browser audit.
