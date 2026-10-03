'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  X,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Box,
  Zap,
  Layers,
} from 'lucide-react';

interface Project3DInspectorProps {
  projectTitle: string;
  category: string;
  techStack: string[];
  modelUrl?: string;
  onClose: () => void;
}

interface ComponentTelemetry {
  name: string;
  category: string;
  spec: string;
  bus: string;
  status: string;
}

export function Project3DInspector({
  projectTitle,
  category,
  techStack,
  modelUrl,
  onClose,
}: Project3DInspectorProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [wireframe, setWireframe] = useState(false);
  const [autoSpin, setAutoSpin] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [hoveredComponent, setHoveredComponent] = useState<ComponentTelemetry | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [currentView, setCurrentView] = useState<'iso' | 'top' | 'front'>('iso');
  const [twoDZoom, setTwoDZoom] = useState(1);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const autoSpinRef = useRef(autoSpin);
  autoSpinRef.current = autoSpin;
  const isExplodedRef = useRef(isExploded);
  isExplodedRef.current = isExploded;

  // Determine fallback 2D CAD schematic image based on category
  let schematicImage = '/images/projects/project-pcb-cad.jpg';
  let schematicTag = '4-LAYER EMBEDDED CONTROLLER';
  if (category === 'HYBRID') {
    schematicImage = '/images/projects/project-rover-cad.jpg';
    schematicTag = 'UGV-X AUTONOMOUS ROBOT CHASSIS';
  } else if (category === 'SOFTWARE') {
    schematicImage = '/images/projects/project-telemetry-cad.jpg';
    schematicTag = 'RF TELEMETRY GROUND STATION';
  }

  const handleZoom = (delta: number) => {
    if (viewMode === '2d') {
      setTwoDZoom((prev) => Math.min(Math.max(prev + (delta < 0 ? 0.25 : -0.25), 0.75), 2.5));
      return;
    }
    if (!cameraRef.current) return;
    const currentZ = cameraRef.current.position.z;
    const newZ = Math.min(Math.max(currentZ + delta, 3.5), 24);
    cameraRef.current.position.z = newZ;
  };

  const handleReset = () => {
    if (viewMode === '2d') {
      setTwoDZoom(1);
      return;
    }
    if (!cameraRef.current || !groupRef.current) return;
    cameraRef.current.position.set(0, 5, 12);
    cameraRef.current.lookAt(0, 0, 0);
    groupRef.current.rotation.set(0, 0, 0);
    setCurrentView('iso');
  };

  const setCameraView = (view: 'iso' | 'top' | 'front') => {
    if (!cameraRef.current || !groupRef.current) return;
    setCurrentView(view);
    if (view === 'top') {
      cameraRef.current.position.set(0, 14, 0.001);
      cameraRef.current.lookAt(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
    } else if (view === 'front') {
      cameraRef.current.position.set(0, 0, 14);
      cameraRef.current.lookAt(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
    } else {
      cameraRef.current.position.set(8, 8, 8);
      cameraRef.current.lookAt(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
    }
  };

  // 3D Scene Initialization
  useEffect(() => {
    if (viewMode !== '3d') return undefined;

    const mount = mountRef.current;
    if (!mount) return undefined;

    let isMounted = true;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer | null = null;
    let animId = 0;
    let isDragging = false;
    let resizeObserver: ResizeObserver | null = null;
    let cleanupFn: (() => void) | null = null;

    try {
      scene = new THREE.Scene();
      const isLightMode = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light';
      scene.background = new THREE.Color(isLightMode ? 0xf8fafc : 0x090d16);

      const w = Math.max(mount.clientWidth, 320);
      const h = Math.max(mount.clientHeight, 300);

      camera = new THREE.PerspectiveCamera(45, w / (h || 1), 0.1, 100);
      camera.position.set(0, 5, 12);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      const canvas = document.createElement('canvas');
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.touchAction = 'none'; // Dedicated modal canvas captures touches

      const ctxAttrs: WebGLContextAttributes = {
        alpha: true,
        antialias: false,
        depth: true,
        stencil: false,
        powerPreference: 'default',
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false,
      };

      let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
      try {
        gl = canvas.getContext('webgl2', ctxAttrs);
      } catch (_) {}
      if (!gl) {
        try {
          gl = (canvas.getContext('webgl', ctxAttrs) ||
            canvas.getContext('experimental-webgl', ctxAttrs)) as any;
        } catch (_) {}
      }

      if (!gl) {
        console.warn('WebGL is not available in Project3DInspector, switching to 2D CAD mode');
        setViewMode('2d');
        return undefined;
      }

      renderer = new THREE.WebGLRenderer({
        canvas,
        context: gl,
        alpha: true,
        antialias: false,
        powerPreference: 'default',
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5));
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      groupRef.current = group;
      scene.add(group);

      // Ground plane grid
      const gridHelper = new THREE.GridHelper(18, 18, isLightMode ? 0x94a3b8 : 0x22d3ee, isLightMode ? 0xe2e8f0 : 0x1e293b);
      gridHelper.position.y = -2.0;
      scene.add(gridHelper);

      // Lighting
      const ambLight = new THREE.AmbientLight(0xffffff, isLightMode ? 1.5 : 1.1);
      scene.add(ambLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
      dirLight1.position.set(8, 14, 8);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 2.0);
      dirLight2.position.set(-8, -6, -6);
      scene.add(dirLight2);

      // Interactive meshes array for Raycasting
      const interactiveMeshes: THREE.Mesh[] = [];
      const raycaster = new THREE.Raycaster();
      const mouseCoords = new THREE.Vector2();
      let hoveredMesh: THREE.Mesh | null = null;
      let origColor: THREE.Color | null = null;

      const checkRaycast = (clientX: number, clientY: number) => {
        if (!dom || !camera) return;
        const rect = dom.getBoundingClientRect();
        if (
          clientX < rect.left ||
          clientX > rect.right ||
          clientY < rect.top ||
          clientY > rect.bottom
        ) {
          if (hoveredMesh && origColor) {
            const mat = hoveredMesh.material as THREE.MeshStandardMaterial;
            if (mat?.color) mat.color.copy(origColor);
            hoveredMesh = null;
            origColor = null;
          }
          setHoveredComponent(null);
          return;
        }
        mouseCoords.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoords.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouseCoords, camera);
        const hits = raycaster.intersectObjects(interactiveMeshes, false);
        if (hits.length > 0) {
          const firstHit = hits[0].object as THREE.Mesh;
          if (firstHit.userData?.telemetry) {
            if (hoveredMesh !== firstHit) {
              if (hoveredMesh && origColor) {
                const mat = hoveredMesh.material as THREE.MeshStandardMaterial;
                if (mat?.color) mat.color.copy(origColor);
              }
              hoveredMesh = firstHit;
              const mat = hoveredMesh.material as THREE.MeshStandardMaterial;
              if (mat?.color) {
                origColor = mat.color.clone();
                mat.color.set(0x00e5ff); // Highlight with electric cyan
              }
            }
            setHoveredComponent(firstHit.userData.telemetry);
            return;
          }
        }
        if (hoveredMesh && origColor) {
          const mat = hoveredMesh.material as THREE.MeshStandardMaterial;
          if (mat?.color) mat.color.copy(origColor);
          hoveredMesh = null;
          origColor = null;
        }
        setHoveredComponent(null);
      };

      // Build rich procedural 3D model tailored to project category
      const buildProceduralModel = () => {
        while (group.children.length > 0) {
          group.remove(group.children[0]);
        }
        interactiveMeshes.length = 0;

        if (category === 'HYBRID') {
          // 1. AUTONOMOUS ALL-TERRAIN ROVER
          const chassisGeo = new THREE.BoxGeometry(4.2, 1.0, 2.6);
          const chassisMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.85,
            roughness: 0.25,
            wireframe,
          });
          const chassis = new THREE.Mesh(chassisGeo, chassisMat);
          chassis.userData.basePos = new THREE.Vector3(0, 0, 0);
          chassis.userData.explodedPos = new THREE.Vector3(0, 0, 0);
          chassis.userData.telemetry = {
            name: 'UGV-X TITANIUM CHASSIS MONOCOQUE',
            category: 'Structural Airframe & Electronics Bay',
            spec: 'T6-6061 Aerospace Aluminum & Carbon Fiber',
            bus: 'Internal Isolated Power/CAN Backbone',
            status: 'STRUCTURAL NOMINAL',
          };
          group.add(chassis);
          interactiveMeshes.push(chassis);

          const edgeGeo = new THREE.EdgesGeometry(chassisGeo);
          const edgeMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
          group.add(new THREE.LineSegments(edgeGeo, edgeMat));

          // 4 Heavy-Duty Off-Road Wheels
          const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8, wireframe });
          const rimMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, metalness: 0.9, wireframe });
          const wheelCoords = [
            [-2.1, -0.4, 1.6],
            [2.1, -0.4, 1.6],
            [-2.1, -0.4, -1.6],
            [2.1, -0.4, -1.6],
          ];
          const posNames = ['FL', 'FR', 'RL', 'RR'];

          wheelCoords.forEach(([x, y, z], idx) => {
            const wheelGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.55, 16);
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.x = Math.PI / 2;
            const base = new THREE.Vector3(x, y, z);
            const exploded = new THREE.Vector3(x > 0 ? x + 1.8 : x - 1.8, y, z > 0 ? z + 1.2 : z - 1.2);
            wheel.position.copy(base);
            wheel.userData.basePos = base;
            wheel.userData.explodedPos = exploded;
            wheel.userData.telemetry = {
              name: `${posNames[idx]} BLDC HUB DRIVE`,
              category: 'Planetary Traction Drivetrain',
              spec: '350W 48V FOC Drive • 32 Nm Stall Torque',
              bus: 'CAN 2.0B / Dual Hall Differential Feedback',
              status: 'ACTIVE // 48.0V NOMINAL',
            };
            group.add(wheel);
            interactiveMeshes.push(wheel);

            const rimGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.6, 12);
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.rotation.x = Math.PI / 2;
            rim.position.copy(base);
            rim.userData.basePos = base;
            rim.userData.explodedPos = exploded;
            group.add(rim);
          });

          // Top LiDAR Turret
          const lidarBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.6, 0.5, 16),
            new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, wireframe })
          );
          lidarBase.position.set(0, 0.75, 0);
          lidarBase.userData.basePos = new THREE.Vector3(0, 0.75, 0);
          lidarBase.userData.explodedPos = new THREE.Vector3(0, 2.0, 0);
          lidarBase.userData.telemetry = {
            name: 'LIDAR GIMBAL RISER & DAMPER',
            category: 'Sensor Vibration Isolation Mount',
            spec: 'Tuned Viscoelastic Dampener • 45 Shore A',
            bus: 'PWM Tilt Servo / UART Telemetry',
            status: 'ISOLATED',
          };
          group.add(lidarBase);
          interactiveMeshes.push(lidarBase);

          const lidarPuck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16),
            new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1, wireframe })
          );
          lidarPuck.position.set(0, 1.15, 0);
          lidarPuck.userData.basePos = new THREE.Vector3(0, 1.15, 0);
          lidarPuck.userData.explodedPos = new THREE.Vector3(0, 3.4, 0);
          lidarPuck.userData.telemetry = {
            name: '360° SOLID-STATE TIME-OF-FLIGHT LIDAR',
            category: 'Autonomous Spatial Perception Core',
            spec: '16-Beam 100m Range @ 20Hz • 0.1° Resolution',
            bus: '100BASE-T1 Automotive Ethernet',
            status: 'SCANNING // 20.0 FPS',
          };
          group.add(lidarPuck);
          interactiveMeshes.push(lidarPuck);
        } else if (category === 'SOFTWARE') {
          // 2. SATELLITE GROUND STATION ANTENNA
          const basePedestal = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.6, 0.6, 16),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, wireframe })
          );
          basePedestal.position.set(0, -1.2, 0);
          basePedestal.userData.basePos = new THREE.Vector3(0, -1.2, 0);
          basePedestal.userData.explodedPos = new THREE.Vector3(0, -2.6, 0);
          basePedestal.userData.telemetry = {
            name: 'AZ/EL DUAL-AXIS HARMONIC ROTATOR',
            category: 'Precision Antenna Positioner',
            spec: 'Harmonic Drive 0.01° Resolution • 45°/s',
            bus: 'RS-485 / Modbus RTU @ 115200 bps',
            status: 'LOCKED // SATELLITE TRACKING',
          };
          group.add(basePedestal);
          interactiveMeshes.push(basePedestal);

          const mast = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 2.2, 16),
            new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, wireframe })
          );
          mast.position.set(0, 0.1, 0);
          mast.userData.basePos = new THREE.Vector3(0, 0.1, 0);
          mast.userData.explodedPos = new THREE.Vector3(0, 0.1, 0);
          mast.userData.telemetry = {
            name: 'CARBON COMPOSITE MAST',
            category: 'Rigid High-Modulus Support Mast',
            spec: '50mm OD Ultra-Stiff Carbon Fiber Tube',
            bus: 'Internal Coaxial Run (RG-402 Low-Loss)',
            status: 'STABLE',
          };
          group.add(mast);
          interactiveMeshes.push(mast);

          // Parabolic Dish
          const dishGeo = new THREE.SphereGeometry(2.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.6);
          const dishMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            metalness: 0.85,
            roughness: 0.25,
            side: THREE.DoubleSide,
            wireframe,
          });
          const dish = new THREE.Mesh(dishGeo, dishMat);
          dish.rotation.x = Math.PI / 4;
          dish.position.set(0, 1.5, 0);
          dish.userData.basePos = new THREE.Vector3(0, 1.5, 0);
          dish.userData.explodedPos = new THREE.Vector3(0, 3.0, -0.8);
          dish.userData.telemetry = {
            name: 'PARABOLIC DISH REFLECTOR',
            category: 'High-Gain Microwave Dish',
            spec: '2.4 GHz / 5.8 GHz Dual-Band Mesh • 24 dBi',
            bus: 'Waveguide Feed Horn Interface',
            status: 'RX ACTIVE // SNR +28dB',
          };
          group.add(dish);
          interactiveMeshes.push(dish);

          // Central Feed Horn
          const horn = new THREE.Mesh(
            new THREE.ConeGeometry(0.35, 1.2, 16),
            new THREE.MeshStandardMaterial({ color: 0x00e5ff, metalness: 0.9, wireframe })
          );
          horn.rotation.x = -Math.PI / 4;
          horn.position.set(0, 2.1, 0.7);
          horn.userData.basePos = new THREE.Vector3(0, 2.1, 0.7);
          horn.userData.explodedPos = new THREE.Vector3(0, 4.8, 1.8);
          horn.userData.telemetry = {
            name: 'CRYOGENIC-GRADE LNA & FEED HORN',
            category: 'RF Front-End Receiver Core',
            spec: '0.6 dB Noise Figure @ 2.4 GHz • 40 dB Gain',
            bus: 'SMA 50-Ohm Coax to SDR Quadrature Demod',
            status: 'ONLINE // LOW NOISE',
          };
          group.add(horn);
          interactiveMeshes.push(horn);
        } else {
          // 3. PRECISION 4-LAYER HARDWARE PCB BOARD (EXPLODED LAYER STACKUP)
          // Layer 4 (Bottom GND Plane)
          const l4Geo = new THREE.BoxGeometry(7.0, 0.08, 4.8);
          const l4Mat = new THREE.MeshStandardMaterial({ color: 0x022c22, roughness: 0.3, metalness: 0.6, wireframe });
          const l4Mesh = new THREE.Mesh(l4Geo, l4Mat);
          l4Mesh.position.set(0, -0.15, 0);
          l4Mesh.userData.basePos = new THREE.Vector3(0, -0.15, 0);
          l4Mesh.userData.explodedPos = new THREE.Vector3(0, -2.0, 0);
          l4Mesh.userData.telemetry = {
            name: 'FR4 LAYER 4 // BOTTOM GROUND PLANE',
            category: 'Continuous EMI Return Path Shield',
            spec: '1.0 oz Solid Copper Shielding Plane',
            bus: 'GND Shield Reference (0.00V)',
            status: '0.00V REF // GROUNDED',
          };
          group.add(l4Mesh);
          interactiveMeshes.push(l4Mesh);

          // Layer 3 (Power Plane)
          const l3Geo = new THREE.BoxGeometry(7.0, 0.08, 4.8);
          const l3Mat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.3, metalness: 0.7, wireframe });
          const l3Mesh = new THREE.Mesh(l3Geo, l3Mat);
          l3Mesh.position.set(0, -0.05, 0);
          l3Mesh.userData.basePos = new THREE.Vector3(0, -0.05, 0);
          l3Mesh.userData.explodedPos = new THREE.Vector3(0, -0.7, 0);
          l3Mesh.userData.telemetry = {
            name: 'FR4 LAYER 3 // POWER DISTRIBUTION PLANE',
            category: 'Internal Split VCC Plane',
            spec: '3.3V / 5.0V / 12.0V Split Plane • 8A Capacity',
            bus: 'VCC Power Net',
            status: '3.30V STABLE // 12mV RIPPLE',
          };
          group.add(l3Mesh);
          interactiveMeshes.push(l3Mesh);

          // Layer 2 (High-Speed Signal Plane)
          const l2Geo = new THREE.BoxGeometry(7.0, 0.08, 4.8);
          const l2Mat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.3, metalness: 0.5, wireframe });
          const l2Mesh = new THREE.Mesh(l2Geo, l2Mat);
          l2Mesh.position.set(0, 0.05, 0);
          l2Mesh.userData.basePos = new THREE.Vector3(0, 0.05, 0);
          l2Mesh.userData.explodedPos = new THREE.Vector3(0, 0.7, 0);
          l2Mesh.userData.telemetry = {
            name: 'FR4 LAYER 2 // HIGH-SPEED SIGNAL ROUTING',
            category: 'Impedance-Controlled Stripline Traces',
            spec: '90-Ohm Differential Pairs (USB/CAN-FD/Ethernet)',
            bus: 'High-Speed Bus Traces',
            status: 'ROUTED // LENGTH MATCHED',
          };
          group.add(l2Mesh);
          interactiveMeshes.push(l2Mesh);

          // Layer 1 (Top SMT Substrate)
          const l1Geo = new THREE.BoxGeometry(7.0, 0.12, 4.8);
          const l1Mat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.25, metalness: 0.5, wireframe });
          const l1Mesh = new THREE.Mesh(l1Geo, l1Mat);
          l1Mesh.position.set(0, 0.15, 0);
          l1Mesh.userData.basePos = new THREE.Vector3(0, 0.15, 0);
          l1Mesh.userData.explodedPos = new THREE.Vector3(0, 2.0, 0);
          l1Mesh.userData.telemetry = {
            name: 'FR4 LAYER 1 // TOP SMT SILKSCREEN & PADS',
            category: 'Component Mounting & Microstrip Layer',
            spec: 'ENIG Gold Surface Finish • 1.6mm Total Board Stack',
            bus: 'Surface Mount Interconnect',
            status: 'INSPECTED // 100% PASS',
          };
          group.add(l1Mesh);
          interactiveMeshes.push(l1Mesh);

          const edgeGeo = new THREE.EdgesGeometry(l1Geo);
          const edgeMat = new THREE.LineBasicMaterial({ color: 0x00e5ff });
          const edges = new THREE.LineSegments(edgeGeo, edgeMat);
          edges.position.set(0, 0.15, 0);
          edges.userData.basePos = new THREE.Vector3(0, 0.15, 0);
          edges.userData.explodedPos = new THREE.Vector3(0, 2.0, 0);
          group.add(edges);

          // SMT Pads
          const padMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe });
          for (let x = -2.8; x <= 2.8; x += 0.9) {
            for (let z = -1.8; z <= 1.8; z += 1.1) {
              const pad = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.4), padMat);
              pad.position.set(x, 0.22, z);
              pad.userData.basePos = new THREE.Vector3(x, 0.22, z);
              pad.userData.explodedPos = new THREE.Vector3(x, 2.08, z);
              group.add(pad);
            }
          }

          // STM32H7 MCU
          const mcuGeo = new THREE.BoxGeometry(2.2, 0.5, 2.2);
          const mcuMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.2,
            metalness: 0.85,
            wireframe,
          });
          const mcu = new THREE.Mesh(mcuGeo, mcuMat);
          mcu.position.set(0, 0.45, 0);
          mcu.userData.basePos = new THREE.Vector3(0, 0.45, 0);
          mcu.userData.explodedPos = new THREE.Vector3(0, 3.8, 0);
          mcu.userData.telemetry = {
            name: 'STM32H743ZI DUAL-CORE MICROCONTROLLER',
            category: 'Primary Flight & Real-Time Computing Core',
            spec: '480 MHz ARM Cortex-M7 + 240 MHz Cortex-M4 • 2MB Flash',
            bus: 'CAN-FD, QSPI, SPI x6, I2C x4, USB-OTG High Speed',
            status: 'ACTIVE // CLOCK 480 MHz NOMINAL',
          };
          group.add(mcu);
          interactiveMeshes.push(mcu);

          // Decoupling Capacitors
          const capMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, wireframe });
          const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.8, 16), capMat);
          cap1.position.set(2.4, 0.6, 1.0);
          cap1.userData.basePos = new THREE.Vector3(2.4, 0.6, 1.0);
          cap1.userData.explodedPos = new THREE.Vector3(3.6, 3.2, 1.0);
          cap1.userData.telemetry = {
            name: 'TANTALUM POLYMER BYPASS CAPACITOR ARRAY',
            category: 'Ultra-Low ESR High-Frequency Decoupling',
            spec: '100uF 25V Low-ESR (< 15 mOhm) Surface Mount',
            bus: 'VCC Transient Suppression Net',
            status: 'CHARGED // 25V RATED',
          };
          group.add(cap1);
          interactiveMeshes.push(cap1);

          // Shrouded I/O Terminals
          const headerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, wireframe });
          const header = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 3.2), headerMat);
          header.position.set(-2.8, 0.55, 0);
          header.userData.basePos = new THREE.Vector3(-2.8, 0.55, 0);
          header.userData.explodedPos = new THREE.Vector3(-4.6, 2.8, 0);
          header.userData.telemetry = {
            name: 'SHROUDED INDUSTRIAL I/O TERMINAL BLOCK',
            category: 'External CAN & JTAG Bus Interface',
            spec: 'Gold-Plated 2.54mm Pitch 16-Pin Shrouded Header',
            bus: 'CAN-FD / JTAG SWD / Isolated UART',
            status: 'CONNECTED // SIGNALS OK',
          };
          group.add(header);
          interactiveMeshes.push(header);
        }
      };

      // Load custom .glb if available, else procedural CAD
      if (modelUrl && modelUrl.trim().length > 0) {
        setIsLoadingModel(true);
        import('three/examples/jsm/loaders/GLTFLoader.js')
          .then(({ GLTFLoader }) => {
            if (!isMounted) return;
            const loader = new GLTFLoader();
            loader.load(
              modelUrl,
              (gltf) => {
                if (!isMounted) return;
                while (group.children.length > 0) {
                  group.remove(group.children[0]);
                }
                const model = gltf.scene;
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 5.5 / (maxDim || 1);
                model.scale.set(scale, scale, scale);

                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center.multiplyScalar(scale));

                group.add(model);
                setIsCustomModel(true);
                setIsLoadingModel(false);
              },
              undefined,
              () => {
                if (isMounted) {
                  buildProceduralModel();
                  setIsLoadingModel(false);
                }
              }
            );
          })
          .catch(() => {
            if (isMounted) {
              buildProceduralModel();
              setIsLoadingModel(false);
            }
          });
      } else {
        buildProceduralModel();
      }

      // ROCK-SOLID TOUCH & MOUSE INTERACTION (WITH PINCH-TO-ZOOM ON MOBILE)
      const dom = renderer.domElement;

      let touchPrevX = 0;
      let touchPrevY = 0;
      let initialPinchDistance = 0;
      let initialCameraZ = 12;

      const getTouchDistance = (t1: Touch, t2: Touch) => {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
      };

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          isDragging = true;
          touchPrevX = e.touches[0].clientX;
          touchPrevY = e.touches[0].clientY;
        } else if (e.touches.length === 2 && camera) {
          isDragging = false;
          initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
          initialCameraZ = camera.position.z;
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.cancelable) e.preventDefault(); // Stop iOS Safari gesture cancelation

        if (e.touches.length === 1 && isDragging) {
          const curX = e.touches[0].clientX;
          const curY = e.touches[0].clientY;
          const dx = curX - touchPrevX;
          const dy = curY - touchPrevY;
          group.rotation.y += dx * 0.012;
          group.rotation.x = Math.max(-0.6, Math.min(0.8, group.rotation.x + dy * 0.008));
          touchPrevX = curX;
          touchPrevY = curY;
        } else if (e.touches.length === 2 && camera && initialPinchDistance > 0) {
          const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
          if (currentDistance > 10) {
            const ratio = initialPinchDistance / currentDistance;
            camera.position.z = Math.min(Math.max(initialCameraZ * ratio, 3.5), 24);
          }
        }
      };

      const onTouchEnd = (e: TouchEvent) => {
        isDragging = false;
        initialPinchDistance = 0;
        if (e.changedTouches && e.changedTouches.length === 1) {
          const t = e.changedTouches[0];
          checkRaycast(t.clientX, t.clientY);
        }
      };

      // Desktop Mouse handlers
      let mousePrevX = 0;
      let mousePrevY = 0;

      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        mousePrevX = e.clientX;
        mousePrevY = e.clientY;
        checkRaycast(e.clientX, e.clientY);
      };

      const onMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const dx = e.clientX - mousePrevX;
          const dy = e.clientY - mousePrevY;
          group.rotation.y += dx * 0.01;
          group.rotation.x = Math.max(-0.6, Math.min(0.8, group.rotation.x + dy * 0.007));
          mousePrevX = e.clientX;
          mousePrevY = e.clientY;
        } else {
          checkRaycast(e.clientX, e.clientY);
        }
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (!camera) return;
        camera.position.z = Math.min(Math.max(camera.position.z + e.deltaY * 0.015, 3.5), 24);
      };

      // WebGL Context Recovery Listeners
      const onContextLost = (e: Event) => {
        e.preventDefault();
        console.warn('WebGL Context Lost in Inspector modal');
        if (animId) cancelAnimationFrame(animId);
      };

      const onContextRestored = () => {
        console.info('WebGL Context Restored in Inspector modal');
        renderLoop();
      };

      dom.addEventListener('touchstart', onTouchStart, { passive: true });
      dom.addEventListener('touchmove', onTouchMove, { passive: false });
      dom.addEventListener('touchend', onTouchEnd, { passive: true });
      dom.addEventListener('touchcancel', onTouchEnd, { passive: true });

      dom.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      dom.addEventListener('wheel', onWheel, { passive: false });

      dom.addEventListener('webglcontextlost', onContextLost, false);
      dom.addEventListener('webglcontextrestored', onContextRestored, false);

      // Handle Resizing
      const updateSize = () => {
        if (!mount || !renderer || !camera) return;
        const curW = Math.max(mount.clientWidth, 320);
        const curH = Math.max(mount.clientHeight, 300);
        camera.aspect = curW / curH;
        camera.updateProjectionMatrix();
        renderer.setSize(curW, curH);
      };

      resizeObserver = new ResizeObserver(() => updateSize());
      resizeObserver.observe(mount);

      // Continuous Render Loop with Exploded Assembly CAD lerp
      const renderLoop = () => {
        animId = requestAnimationFrame(renderLoop);
        if (autoSpinRef.current && !isDragging) {
          group.rotation.y += 0.006;
        }
        // Smoothly lerp sub-components along their normal vectors based on isExploded state
        group.traverse((obj) => {
          if (obj.userData?.basePos && obj.userData?.explodedPos) {
            const targetPos = isExplodedRef.current ? obj.userData.explodedPos : obj.userData.basePos;
            obj.position.lerp(targetPos, 0.08);
          }
        });
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };
      renderLoop();

      cleanupFn = () => {
        isMounted = false;
        if (resizeObserver) resizeObserver.disconnect();
        dom.removeEventListener('touchstart', onTouchStart);
        dom.removeEventListener('touchmove', onTouchMove);
        dom.removeEventListener('touchend', onTouchEnd);
        dom.removeEventListener('touchcancel', onTouchEnd);
        dom.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        dom.removeEventListener('wheel', onWheel);
        dom.removeEventListener('webglcontextlost', onContextLost);
        dom.removeEventListener('webglcontextrestored', onContextRestored);
        if (animId) cancelAnimationFrame(animId);
        if (renderer) {
          if (renderer.domElement && mount.contains(renderer.domElement)) {
            mount.removeChild(renderer.domElement);
          }
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('WebGL Initialization error in Project3DInspector:', err);
      setViewMode('2d');
    }

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, [category, wireframe, modelUrl, viewMode]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-0/90 backdrop-blur-md p-2 sm:p-4 overscroll-contain select-none"
      style={{ touchAction: 'none' }}
    >
      <div className="relative flex flex-col md:flex-row w-full max-w-5xl h-[92vh] sm:h-[86vh] max-h-[720px] overflow-hidden rounded-2xl border border-border bg-bg-1 shadow-2xl">
        {/* Left Column: 3D Viewport OR 2D Schematic Stage */}
        <div className="relative w-full h-[340px] sm:h-[400px] md:h-full md:flex-1 bg-bg-0 cursor-grab active:cursor-grabbing select-none overflow-hidden shrink-0 flex flex-col justify-between">
          {/* Top Stage Control Header - Clean Inline Layout with ZERO Overlap */}
          <div className="relative z-30 flex items-center justify-between border-b border-border/60 bg-bg-1/95 px-3 sm:px-4 py-2.5 backdrop-blur-sm gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse shrink-0" />
              <span className="font-mono text-xs font-bold text-text-1 truncate max-w-[150px] sm:max-w-[260px]">
                {projectTitle}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Mode Switcher Toggle */}
              <div className="flex items-center gap-0.5 rounded border border-border/80 bg-bg-0/90 p-0.5 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-all ${
                    viewMode === '3d'
                      ? 'bg-accent text-bg-0 shadow-sm'
                      : 'text-text-2 hover:text-text-1'
                  }`}
                  title="Interactive 3D WebGL (High-end devices)"
                >
                  <Box className="h-3 w-3" />
                  <span>3D</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('2d')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-all ${
                    viewMode === '2d'
                      ? 'bg-accent-2 text-bg-0 shadow-sm'
                      : 'text-text-2 hover:text-text-1'
                  }`}
                  title="Lightweight 2D CAD Schematic (Low-end devices)"
                >
                  <Zap className="h-3 w-3" />
                  <span>2D LITE</span>
                </button>
              </div>

              {/* Status Badges */}
              {isLoadingModel && (
                <span className="hidden lg:inline-flex rounded bg-accent/20 border border-accent/40 px-2 py-0.5 text-[9px] font-mono text-accent animate-pulse">
                  Loading GLB...
                </span>
              )}
              {isCustomModel && (
                <span className="hidden lg:inline-flex rounded bg-success/20 border border-success/40 px-2 py-0.5 text-[9px] font-mono text-success">
                  Custom CAD
                </span>
              )}

              {/* Clean Inline Close Button for Mobile & Desktop */}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-text-2 hover:bg-surface hover:text-text-1 transition-colors border border-border/60 bg-surface/80"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Viewport Center */}
          <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
            {viewMode === '3d' ? (
              // 3D Canvas
              <div ref={mountRef} className="w-full h-full min-h-[260px]" style={{ touchAction: 'none' }} />
            ) : (
              // 2D Schematic High-Res Graphic
              <div className="relative w-full h-full p-4 flex items-center justify-center select-none overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div
                  className="relative transition-transform duration-300 rounded-xl overflow-hidden border border-border/80 shadow-2xl max-h-[90%] max-w-[95%]"
                  style={{ transform: `scale(${twoDZoom})` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={schematicImage}
                    alt={`${projectTitle} CAD Blueprint`}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 rounded bg-bg-0/85 border border-accent/40 px-2 py-0.5 text-[9px] font-mono text-accent backdrop-blur-md">
                    {schematicTag}
                  </div>
                </div>
              </div>
            )}

            {/* Live Raycast Telemetry HUD */}
            {hoveredComponent && viewMode === '3d' && (
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-40 max-w-[280px] sm:max-w-[320px] rounded-xl border border-accent/60 bg-bg-0/95 p-3 shadow-2xl backdrop-blur-md font-mono pointer-events-none transition-all duration-200">
                <div className="flex items-center justify-between border-b border-border/80 pb-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-accent animate-pulse shrink-0" />
                    <span className="text-[11px] font-bold text-accent uppercase tracking-wider truncate">
                      {hoveredComponent.name}
                    </span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40 shrink-0">
                    {hoveredComponent.status}
                  </span>
                </div>
                <div className="text-[10px] space-y-1">
                  <div className="flex justify-between gap-2">
                    <span className="text-text-2 shrink-0">SUBSYSTEM:</span>
                    <span className="font-semibold text-text-1 truncate">{hoveredComponent.category}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-text-2 shrink-0">SPEC:</span>
                    <span className="font-semibold text-accent-2 truncate">{hoveredComponent.spec}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-text-2 shrink-0">INTERFACE:</span>
                    <span className="font-semibold text-text-1 truncate">{hoveredComponent.bus}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating Toolset Overlay - Positioned Safely with No Overlap */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-30 flex items-center gap-1 sm:gap-1.5 rounded-lg border border-border bg-surface/90 p-1 sm:p-1.5 backdrop-blur-md shadow-xl">
            {viewMode === '3d' && (
              <>
                <button
                  type="button"
                  onClick={() => setIsExploded(!isExploded)}
                  title={isExploded ? 'Compact Assembly' : 'Explode CAD Assembly'}
                  className={`rounded p-1.5 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center gap-1 text-[11px] font-mono font-semibold ${
                    isExploded
                      ? 'text-accent bg-accent/20 border border-accent/40 shadow-sm'
                      : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
                  }`}
                >
                  <Layers className="h-4 w-4" />
                  <span className="hidden sm:inline">{isExploded ? 'COMPACT' : 'EXPLODE'}</span>
                </button>
                <div className="h-4 w-[1px] bg-border mx-0.5 sm:mx-1" />
              </>
            )}
            <button
              type="button"
              onClick={() => handleZoom(-2)}
              title="Zoom In (+)"
              className="rounded p-1.5 text-text-2 hover:bg-bg-1 hover:text-text-1 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(2)}
              title="Zoom Out (-)"
              className="rounded p-1.5 text-text-2 hover:bg-bg-1 hover:text-text-1 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-border mx-0.5 sm:mx-1" />
            <button
              type="button"
              onClick={handleReset}
              title="Reset View"
              className="rounded p-1.5 text-text-2 hover:bg-bg-1 hover:text-text-1 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {viewMode === '3d' && (
              <>
                <button
                  type="button"
                  onClick={() => setAutoSpin(!autoSpin)}
                  title={autoSpin ? 'Pause Rotation' : 'Auto Rotate'}
                  className={`rounded p-1.5 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center ${
                    autoSpin ? 'text-accent bg-accent/15' : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
                  }`}
                >
                  {autoSpin ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setWireframe(!wireframe)}
                  title={wireframe ? 'Shaded View' : 'Wireframe View'}
                  className={`rounded p-1.5 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center ${
                    wireframe ? 'text-accent-2 bg-accent-2/15' : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Hint Overlay - Hidden on small mobile screens to prevent overlap */}
          <div className="hidden sm:block absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 pointer-events-none text-[9px] sm:text-[10px] font-mono text-text-2 bg-bg-0/85 px-2.5 py-1 rounded border border-border/40 backdrop-blur-sm">
            {viewMode === '3d'
              ? 'Drag to rotate • Scroll to zoom'
              : 'Use +/- buttons to zoom 2D schematic'}
          </div>
        </div>

        {/* Right Column: Engineering Inspector Specs & Model Pipeline */}
        <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-border bg-surface/50 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto flex-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                {category} // HARDWARE SPEC
              </span>
              <button
                onClick={onClose}
                className="hidden md:flex rounded-lg p-1.5 text-text-2 hover:bg-surface hover:text-text-1 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-text-1">{projectTitle}</h3>
            <p className="mt-1 text-xs text-text-2 leading-relaxed">
              Real-time hardware inspection with progressive WebGL enhancement and 2D CAD schematic fallback.
            </p>

            {/* Camera Angle Presets (When in 3D mode) */}
            {viewMode === '3d' && (
              <div className="mt-4">
                <div className="text-[10px] font-mono text-text-2 mb-2 uppercase tracking-wider">
                  Camera Projection
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCameraView('iso')}
                    className={`rounded border py-1.5 px-1 text-[11px] sm:text-xs font-mono font-semibold transition-all ${
                      currentView === 'iso'
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border bg-bg-1 text-text-2 hover:border-text-2'
                    }`}
                  >
                    <span className="hidden sm:inline">ISOMETRIC</span>
                    <span className="sm:hidden">ISO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraView('top')}
                    className={`rounded border py-1.5 px-1 text-[11px] sm:text-xs font-mono font-semibold transition-all ${
                      currentView === 'top'
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border bg-bg-1 text-text-2 hover:border-text-2'
                    }`}
                  >
                    <span className="hidden sm:inline">TOP (PCB)</span>
                    <span className="sm:hidden">TOP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraView('front')}
                    className={`rounded border py-1.5 px-1 text-[11px] sm:text-xs font-mono font-semibold transition-all ${
                      currentView === 'front'
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border bg-bg-1 text-text-2 hover:border-text-2'
                    }`}
                  >
                    <span className="hidden sm:inline">FRONT (CAD)</span>
                    <span className="sm:hidden">FRONT</span>
                  </button>
                </div>
              </div>
            )}

            {/* Exploded View Control & Active Telemetry in Inspector Column */}
            {viewMode === '3d' && (
              <div className="mt-4 rounded-xl border border-border/80 bg-bg-1/90 p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-accent">
                    <Layers className="h-3.5 w-3.5" />
                    <span>EXPLODED CAD ASSEMBLY</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsExploded(!isExploded)}
                    className={`rounded px-2.5 py-1 text-[10px] font-mono font-bold transition-all ${
                      isExploded
                        ? 'bg-accent text-bg-0 shadow-sm'
                        : 'bg-surface border border-border text-text-2 hover:text-text-1'
                    }`}
                  >
                    {isExploded ? 'ACTIVE' : 'EXPAND'}
                  </button>
                </div>
                <p className="text-[11px] text-text-2 leading-relaxed">
                  {isExploded
                    ? 'Sub-assemblies separated along normal vectors for internal component inspection.'
                    : 'Click Expand or the Explode button to view internal PCB layers and drivetrain components.'}
                </p>
                {hoveredComponent && (
                  <div className="rounded-lg border border-accent/40 bg-bg-0/90 p-2.5 text-[10px] font-mono space-y-1 animate-in fade-in">
                    <div className="text-accent font-bold truncate">{hoveredComponent.name}</div>
                    <div className="text-text-1">{hoveredComponent.spec}</div>
                    <div className="text-text-2">Bus: {hoveredComponent.bus}</div>
                  </div>
                )}
              </div>
            )}

            {/* Tech Stack Chips */}
            <div className="mt-5">
              <div className="text-[10px] font-mono text-text-2 mb-2 uppercase tracking-wider">
                Embedded Stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-bg-1 border border-border px-2 py-0.5 text-xs font-mono text-text-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 3D Model Attachment Status */}
            <div className="mt-5 rounded-lg border border-border/80 bg-bg-1/80 p-3 text-xs font-mono space-y-1.5">
              <div className="text-[11px] text-accent font-semibold flex items-center gap-1.5">
                <Box className="h-3.5 w-3.5" />
                <span>3D MODEL SOURCE</span>
              </div>
              <p className="text-text-2 text-[11px]">
                {modelUrl
                  ? `Custom GLB linked: ${modelUrl}`
                  : `Procedural ${category} model active. Coordinators can link real .glb files in the Admin Panel.`}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-surface border border-border py-2 text-xs font-semibold text-text-1 hover:bg-surface-hover transition-colors"
            >
              Exit Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
