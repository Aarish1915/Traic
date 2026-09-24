import { notFound } from 'next/navigation';
import { ProjectDetailClient, type ProjectDetail } from './ProjectDetailClient';

const PROJECT_DATABASE: Record<string, ProjectDetail> = {
  'autonomous-ugv-rover': {
    slug: 'autonomous-ugv-rover',
    title: 'Autonomous Field Rover (UGV-X)',
    category: 'HYBRID',
    year: 2024,
    status: 'Operational — Field Tested',
    tagline: 'All-terrain autonomous rover equipped with LiDAR, stereo depth cameras, and ROS2 navigation.',
    description: 'Custom CNC aluminum differential-drive robot running real-time 3D SLAM, obstacle avoidance, and waypoint following on NVIDIA Jetson Orin Nano.',
    fullNarrative: 'The UGV-X was engineered by TRAIC members over an 8-month intensive design cycle for hazardous industrial inspections and GPS-denied environments. The mechanical chassis was machined out of 6061-T6 aluminum on our workshop CNC mill, paired with 4 high-torque planetary-geared BLDC motors. Embedded firmware runs on an STM32H7 controller operating FreeRTOS and micro-ROS, synchronized with an onboard NVIDIA Jetson Orin Nano over CAN-FD at 5 Mbps.',
    techStack: ['ROS2 Humble', 'C++20', 'RTAB-Map', 'LiDAR', 'CAN-FD', 'NVIDIA Jetson', 'Nav2', 'FreeRTOS'],
    repoUrl: 'https://github.com/Aarish1915/Traic',
    hasTelemetryDemo: true,
    specs: [
      { label: 'Compute Architecture', value: 'NVIDIA Jetson Orin Nano (40 TOPS) + STM32H7 Dual-Core MCU' },
      { label: 'Sensing Suite', value: '360° 3D LiDAR (16-beam, 100m range) + Intel RealSense D435i' },
      { label: 'Bus Communication', value: 'Isolated CAN-FD 2.0 @ 5 Mbps + LoRa 868MHz Telemetry Backup' },
      { label: 'Drive Train', value: '4x Planetary-geared BLDC motors with magnetic Hall encoders' },
      { label: 'Battery System', value: '6S 22.2V 10,000mAh LiFePO4 with active smart BMS' },
      { label: 'Odometry Precision', value: 'Sub-2cm localization error via EKF sensor fusion' },
    ],
    bom: [
      { component: 'Primary Edge Computer', partNumber: 'Jetson Orin Nano 8GB', function: 'Neural SLAM & Path Planning' },
      { component: 'Real-Time Controller', partNumber: 'STM32H743ZI', function: 'CAN-FD Driver & RTOS Motor Control' },
      { component: '9-DOF Precision IMU', partNumber: 'BNO085 (Bosch Sensortec)', function: 'Quaternion Attitude Reference' },
      { component: 'Isolated CAN Transceiver', partNumber: 'TI ISO1042', function: 'High-speed 5Mbps Bus Isolation' },
      { component: 'Motor Gate Drivers', partNumber: 'TI DRV8301', function: 'Three-Phase BLDC FOC Commutation' },
    ],
    team: [
      { name: 'Aarish Ali', role: 'Robotics Architect & Lead Coordinator' },
      { name: 'Rohan Sharma', role: 'Autonomous Navigation & Nav2 Lead' },
      { name: 'Vikram Mehta', role: 'CNC Chassis Machining & FEA' },
    ],
    awards: [
      '1st Prize Winners — Smart India Hackathon (Hardware Edition 2024)',
      'AIR 4 — DD Robocon India National Stage (2024)',
    ],
  },
  'edge-neural-pcb': {
    slug: 'edge-neural-pcb',
    title: 'Edge Neural Accelerator Board',
    category: 'HARDWARE',
    year: 2024,
    status: 'Fabricated v2.1 — Lab Verified',
    tagline: 'Custom 4-layer PCB running quantized edge vision models on STM32H7 and Hailo-8 NPU.',
    description: 'High-speed differential routing, power sequencing, and camera interfaces on a custom 4-layer FR4 board for low-power edge detection.',
    fullNarrative: 'Engineered entirely from schematic capture to SMD soldering in the TRAIC lab, this 4-layer high-frequency PCB integrates an STM32H743 MCU with an M.2 key Hailo-8 neural acceleration coprocessor. Featuring impedance-controlled 90-ohm USB-C differential pairs, 100-ohm MIPI CSI-2 camera traces, and strict power sequencing for core and peripheral rails.',
    techStack: ['KiCad 8', 'STM32H7', 'Embedded C', 'Hailo-8 SDK', 'FreeRTOS', 'Differential Routing'],
    repoUrl: 'https://github.com/Aarish1915/Traic',
    specs: [
      { label: 'Layer Stackup', value: '4-Layer JLC2313 (Signal - GND - PWR - Signal)' },
      { label: 'Dielectric & Impedance', value: 'FR-4 High-Tg (170°C), 90Ω diff / 50Ω single-ended matched' },
      { label: 'AI Inference Performance', value: '26 TOPS @ 2.5W power envelope via Hailo-8' },
      { label: 'Microcontroller Clock', value: 'Cortex-M7 @ 480 MHz with 2MB Flash, 1MB RAM' },
      { label: 'Power Conversion', value: 'Synchronous Buck Regulators: 5.0V, 3.3V, 1.8V, 0.9V Core' },
      { label: 'Camera Input', value: 'Dual-lane MIPI CSI-2 interface for low-latency visual intake' },
    ],
    bom: [
      { component: 'Microcontroller', partNumber: 'STM32H743ZIT6 (LQFP-144)', function: 'Main Control & Sensor Hub' },
      { component: 'Neural Processor', partNumber: 'Hailo-8 M.2 A+E Module', function: 'Quantized INT8 CNN Acceleration' },
      { component: 'DC-DC Step-Down', partNumber: 'TI TPS62130 (QFN-16)', function: 'High-Efficiency 3A Buck Regulation' },
      { component: 'LDO Regulator', partNumber: 'Microchip MIC5365', function: 'Ultra-Low Noise 3.3V Sensor Power' },
      { component: 'Crystal Oscillators', partNumber: 'Abracon 25MHz & 32.768kHz', function: 'HSE & RTC Precision Clocking' },
    ],
    team: [
      { name: 'Priya Patel', role: 'PCB Schematic & High-Speed Routing Lead' },
      { name: 'Ananya Verma', role: 'Quantized Neural Pipeline Engineer' },
      { name: 'Aarish Ali', role: 'Hardware Testing & Signal Validation' },
    ],
    awards: [
      '1st Place — IEEE Hardware Sprint (2023)',
      'Best Engineering Prototype — National Innovation Fair (2023)',
    ],
  },
  'telemetry-ground-station': {
    slug: 'telemetry-ground-station',
    title: 'Distributed Telemetry Ground Station',
    category: 'SOFTWARE',
    year: 2024,
    status: 'Live Deployment — Version 3.2',
    tagline: 'Sub-millisecond WebSockets and WebRTC ground station platform for live robotic fleet telemetry.',
    description: 'Decodes RF packets from rovers and drones in real time, rendering low-latency 3D orientation models, battery thermals, and sensor graphs.',
    fullNarrative: 'The TRAIC Distributed Ground Station was built to eliminate third-party telemetry lag during competition field trials. Built with Go and Rust micro-services, it ingests packet bursts over serial, UDP, and LoRa radios, validates checksums, and pushes sub-millisecond JSON state updates to web dashboards via WebSockets. An interactive 3D Three.js orientation viewer visualizes vehicle pitch, roll, and heading in real time.',
    techStack: ['Go', 'Rust', 'Next.js 15', 'Three.js', 'WebSockets', 'LoRa 868MHz', 'Tailwind'],
    repoUrl: 'https://github.com/Aarish1915/Traic',
    hasTelemetryDemo: true,
    specs: [
      { label: 'Uplink Protocol', value: 'Binary Packed CAN-FD frames over UDP & LoRa SX1262' },
      { label: 'Streaming Latency', value: '< 1.2ms end-to-end packet decode to web canvas' },
      { label: 'Throughput', value: 'Up to 2,500 packets/sec with zero browser thread blocking' },
      { label: 'Orientation Tracking', value: 'Real-time 60fps Three.js Euler/Quaternion 3D model orientation' },
      { label: 'Persistence Engine', value: 'InfluxDB time-series for post-run telemetry replay' },
    ],
    bom: [
      { component: 'Radio Transceiver', partNumber: 'Semtech SX1262 (868MHz)', function: 'Long-Range LoRa Telemetry' },
      { component: 'USB-to-UART Bridge', partNumber: 'FTDI FT232HQ', function: 'High-speed 12Mbps Serial Interface' },
      { component: 'Antenna Array', partNumber: 'Taoglas 868MHz Dipole', function: 'Omnidirectional Field Antenna' },
    ],
    team: [
      { name: 'Kavya Nair', role: 'Telemetry Architecture & Go Backend Lead' },
      { name: 'Aarish Ali', role: 'Radio Protocol & Packet Deserializer' },
    ],
    awards: [
      'Top Telemetry Architecture Award — SIH Grand Finale (2024)',
    ],
  },
  'robocon-holonomic-base': {
    slug: 'robocon-holonomic-base',
    title: 'Holonomic Mecanum Drive Base',
    category: 'HARDWARE',
    year: 2024,
    status: 'Operational — Arena Ready',
    tagline: 'Omni-directional drive platform with dual optical mouse odometry for Robocon.',
    description: 'Precision trajectory tracking within 5mm error margin at 2.5 m/s acceleration using cascading velocity and position PID loops.',
    fullNarrative: 'Engineered specifically for the DD Robocon 2024 national arena, this holonomic base uses 4 independent Mecanum wheels oriented at 45 degrees to allow instant translation in any Cartesian direction without turning. Odometry is maintained via dual optical ground-tracking sensors, which eliminate wheel-slip drift during rapid acceleration.',
    techStack: ['SolidWorks', 'STM32F4', 'CAN-FD', 'Optical Odometry', 'PID Cascades', 'C++'],
    repoUrl: 'https://github.com/Aarish1915/Traic',
    specs: [
      { label: 'Drive Mechanism', value: '4x 152mm Anodized Aluminum Mecanum Wheels' },
      { label: 'Top Velocity', value: '2.8 m/s with 3.2 m/s² max linear acceleration' },
      { label: 'Localization Error', value: '< 4.5mm per 10m traveled via dual optical surface sensors' },
      { label: 'Control Frequency', value: '1 kHz cascading velocity & position PID update loop' },
    ],
    bom: [
      { component: 'Drive Motors', partNumber: 'Maxon EC 45 Flat 70W', function: 'Brushless Actuation with Hall Sensors' },
      { component: 'Motion Controller', partNumber: 'STM32F405RG', function: '1kHz PID Math & CAN-FD Node' },
      { component: 'Optical Odometry', partNumber: 'PMW3389 Motion Sensor', function: '16,000 CPI Ground Displacement' },
    ],
    team: [
      { name: 'Vikram Mehta', role: 'Mechanical Transmission Lead' },
      { name: 'Aarish Ali', role: 'Cascading PID & Motion Control' },
    ],
    awards: ['AIR 4 & Best Engineering Design Trophy — Robocon 2024'],
  },
  'hexapod-walking-robot': {
    slug: 'hexapod-walking-robot',
    title: 'Adaptive Terrain Hexapod',
    category: 'HARDWARE',
    year: 2023,
    status: 'Fabricated — Research Prototype',
    tagline: '18-DOF biomimetic hexapod robot with inverse kinematics and terrain adaptation.',
    description: 'Designed custom carbon-fiber and 3D printed coxa-femur-tibia legs driven by high-torque digital bus servos with gait sequencing.',
    fullNarrative: 'A biomimetic research platform built to navigate uneven outdoor terrain that wheels cannot traverse. The robot features 6 three-segment articulated legs, totaling 18 degrees of freedom. An onboard Teensy 4.1 calculates inverse kinematics in closed form at 200 Hz to dynamically alter step clearance over rocks and steps.',
    techStack: ['FreeCAD', 'C++', 'Inverse Kinematics', 'Teensy 4.1', 'Dynamixel Servos'],
    repoUrl: 'https://github.com/Aarish1915/Traic',
    specs: [
      { label: 'Degrees of Freedom', value: '18-DOF (3-DOF per leg: Coxa, Femur, Tibia)' },
      { label: 'Kinematics Frequency', value: '200 Hz analytical closed-form IK calculation' },
      { label: 'Actuation Bus', value: 'Daisy-chained TTL Half-Duplex RS-485 at 1 Mbps' },
      { label: 'Gait Patterns', value: 'Alternating Tripod, Wave, Ripple, and Terrain-Adaptive' },
    ],
    bom: [
      { component: 'Digital Bus Servos', partNumber: 'Robotis Dynamixel XL430', function: 'Smart Joint Servos with Feedback' },
      { component: 'Kinematics MCU', partNumber: 'Teensy 4.1 (600MHz Cortex-M7)', function: 'Analytical IK & Gait Sequencing' },
      { component: 'Foot Ground Sensors', partNumber: 'Interlink FSR 402', function: 'Dynamic Ground Contact Detection' },
    ],
    team: [
      { name: 'Vikram Mehta', role: 'Leg Geometry & Carbon Fiber Design' },
      { name: 'Rohan Sharma', role: 'Inverse Kinematics & Gait Software' },
    ],
    awards: ['Special Innovation Prize — National Innovation Fair (2023)'],
  },
  'smart-grid-energy-monitor': {
    slug: 'smart-grid-energy-monitor',
    title: 'IoT Industrial Energy Monitor',
    category: 'HYBRID',
    year: 2023,
    status: 'Installed — Live Field Operation',
    tagline: 'DIN-rail mounted 3-phase power quality and fault analyzer with MQTT telemetry.',
    description: 'Measures true RMS voltage, active/reactive power, and power factor with isolated current transformers and secure TLS MQTT uplinks.',
    fullNarrative: 'A robust industrial IoT device designed to monitor college power distribution panels. Utilizes Analog Devices ADE7758 polyphase energy metering ICs with isolated split-core current transformers, communicating over Modbus RS-485 and secure Wi-Fi/MQTT to central time-series analytics dashboards.',
    techStack: ['ESP32', 'FreeRTOS', 'ADE7758', 'MQTT', 'InfluxDB', 'Grafana'],
    repoUrl: 'https://github.com/Aarish1915/Traic',
    specs: [
      { label: 'Measurement Rating', value: '3-Phase 415V AC True RMS @ up to 100A per phase' },
      { label: 'Measurement Accuracy', value: '< 0.5% Class 0.5S active energy metering error' },
      { label: 'Security & Enclosure', value: 'TLS 1.3 MQTT, DIN-rail mounted flame-retardant ABS' },
    ],
    bom: [
      { component: 'Polyphase Energy IC', partNumber: 'ADE7758ARWZ', function: 'True RMS Power & Harmonic Analysis' },
      { component: 'Microcontroller', partNumber: 'ESP32-WROOM-32E', function: 'Secure MQTT Client & Data Logging' },
      { component: 'Isolated CT Sensors', partNumber: 'YHDC SCT-013-000', function: 'Galvanically Isolated AC Current Sensing' },
    ],
    team: [
      { name: 'Priya Patel', role: 'High-Voltage Isolation PCB Design' },
      { name: 'Kavya Nair', role: 'MQTT InfluxDB Telemetry Pipeline' },
    ],
    awards: ['Finalist — SIH 2023 Energy Track'],
  },
};

export function generateStaticParams() {
  return Object.keys(PROJECT_DATABASE).map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECT_DATABASE[slug];

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
