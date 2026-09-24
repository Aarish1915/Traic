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
} from 'lucide-react';

interface Project3DInspectorProps {
  projectTitle: string;
  category: string;
  techStack: string[];
  modelUrl?: string;
  onClose: () => void;
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
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [currentView, setCurrentView] = useState<'iso' | 'top' | 'front'>('iso');
  const [twoDZoom, setTwoDZoom] = useState(1);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const autoSpinRef = useRef(autoSpin);
  autoSpinRef.current = autoSpin;

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

    // Verify WebGL availability before attempting creation
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL unsupported on this device. Switching to 2D Lite Schematic.');
      setViewMode('2d');
      return undefined;
    }

    let isMounted = true;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer | null = null;
    let animId = 0;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
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

      renderer = new THREE.WebGLRenderer({
        antialias: false, // Prevents iOS Safari memory threshold crash
        alpha: true,
        powerPreference: 'low-power',
      });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.25));
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.touchAction = 'none'; // Ensures smooth iOS touch rotation
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

      // Build rich procedural 3D model tailored to project category
      const buildProceduralModel = () => {
        while (group.children.length > 0) {
          group.remove(group.children[0]);
        }

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
          group.add(chassis);

          const edgeGeo = new THREE.EdgesGeometry(chassisGeo);
          const edgeMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
          group.add(new THREE.LineSegments(edgeGeo, edgeMat));

          // 4 Heavy-Duty Off-Road Wheels
          const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8, wireframe });
          const rimMat = new THREE.MeshStandardMaterial({ color: 0xff9f1c, metalness: 0.9, wireframe });
          const wheelCoords = [
            [-2.1, -0.4, 1.6],
            [2.1, -0.4, 1.6],
            [-2.1, -0.4, -1.6],
            [2.1, -0.4, -1.6],
          ];

          wheelCoords.forEach(([x, y, z]) => {
            const wheelGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.55, 16);
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.x = Math.PI / 2;
            wheel.position.set(x, y, z);
            group.add(wheel);

            const rimGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.6, 12);
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.rotation.x = Math.PI / 2;
            rim.position.set(x, y, z);
            group.add(rim);
          });

          // Top LiDAR Turret
          const lidarBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.6, 0.5, 16),
            new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, wireframe })
          );
          lidarBase.position.set(0, 0.75, 0);
          group.add(lidarBase);

          const lidarPuck = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.4, 0.4, 16),
            new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1, wireframe })
          );
          lidarPuck.position.set(0, 1.15, 0);
          group.add(lidarPuck);
        } else if (category === 'SOFTWARE') {
          // 2. SATELLITE GROUND STATION ANTENNA
          const basePedestal = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.6, 0.6, 16),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, wireframe })
          );
          basePedestal.position.set(0, -1.2, 0);
          group.add(basePedestal);

          const mast = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 2.2, 16),
            new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, wireframe })
          );
          mast.position.set(0, 0.1, 0);
          group.add(mast);

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
          group.add(dish);

          // Central Feed Horn
          const horn = new THREE.Mesh(
            new THREE.ConeGeometry(0.35, 1.2, 16),
            new THREE.MeshStandardMaterial({ color: 0xff9f1c, metalness: 0.9, wireframe })
          );
          horn.rotation.x = -Math.PI / 4;
          horn.position.set(0, 2.1, 0.7);
          group.add(horn);
        } else {
          // 3. PRECISION 4-LAYER HARDWARE PCB BOARD
          const baseGeo = new THREE.BoxGeometry(7.0, 0.3, 4.8);
          const baseMat = new THREE.MeshStandardMaterial({
            color: 0x064e3b,
            roughness: 0.3,
            metalness: 0.5,
            wireframe,
          });
          const baseMesh = new THREE.Mesh(baseGeo, baseMat);
          group.add(baseMesh);

          const edgeGeo = new THREE.EdgesGeometry(baseGeo);
          const edgeMat = new THREE.LineBasicMaterial({ color: 0xffd166 });
          group.add(new THREE.LineSegments(edgeGeo, edgeMat));

          const padMat = new THREE.MeshBasicMaterial({ color: 0xffd166, wireframe });
          for (let x = -2.8; x <= 2.8; x += 0.9) {
            for (let z = -1.8; z <= 1.8; z += 1.1) {
              const pad = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.32, 0.4), padMat);
              pad.position.set(x, 0.05, z);
              group.add(pad);
            }
          }

          const mcuGeo = new THREE.BoxGeometry(2.2, 0.5, 2.2);
          const mcuMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.2,
            metalness: 0.85,
            wireframe,
          });
          const mcu = new THREE.Mesh(mcuGeo, mcuMat);
          mcu.position.set(0, 0.28, 0);
          group.add(mcu);

          const capMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, wireframe });
          const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.8, 16), capMat);
          cap1.position.set(2.4, 0.5, 1.4);
          group.add(cap1);

          const cap2 = cap1.clone();
          cap2.position.set(2.4, 0.5, 0.5);
          group.add(cap2);

          const headerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, wireframe });
          const header = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 3.2), headerMat);
          header.position.set(-2.8, 0.45, 0);
          group.add(header);
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

      // UNIFIED POINTER EVENTS FOR ROTATION (WORKS FLAWLESSLY ON IPHONE & ANDROID)
      const dom = renderer.domElement;

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
        try {
          dom.setPointerCapture(e.pointerId);
        } catch {}
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        group.rotation.y += dx * 0.012;
        group.rotation.x += dy * 0.008;
        prevX = e.clientX;
        prevY = e.clientY;
      };

      const onPointerUp = (e: PointerEvent) => {
        isDragging = false;
        try {
          dom.releasePointerCapture(e.pointerId);
        } catch {}
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (!camera) return;
        camera.position.z = Math.min(Math.max(camera.position.z + e.deltaY * 0.015, 3.5), 24);
      };

      dom.addEventListener('pointerdown', onPointerDown);
      dom.addEventListener('pointermove', onPointerMove);
      dom.addEventListener('pointerup', onPointerUp);
      dom.addEventListener('pointercancel', onPointerUp);
      dom.addEventListener('wheel', onWheel, { passive: false });

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

      // Continuous Render Loop
      const renderLoop = () => {
        animId = requestAnimationFrame(renderLoop);
        if (autoSpinRef.current && !isDragging) {
          group.rotation.y += 0.006;
        }
        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };
      renderLoop();

      cleanupFn = () => {
        isMounted = false;
        if (resizeObserver) resizeObserver.disconnect();
        dom.removeEventListener('pointerdown', onPointerDown);
        dom.removeEventListener('pointermove', onPointerMove);
        dom.removeEventListener('pointerup', onPointerUp);
        dom.removeEventListener('pointercancel', onPointerUp);
        dom.removeEventListener('wheel', onWheel);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-0/90 backdrop-blur-md p-2 sm:p-4">
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
          </div>

          {/* Floating Toolset Overlay - Positioned Safely with No Overlap */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-30 flex items-center gap-1 sm:gap-1.5 rounded-lg border border-border bg-surface/90 p-1 sm:p-1.5 backdrop-blur-md shadow-xl">
            <button
              onClick={() => handleZoom(-2)}
              title="Zoom In (+)"
              className="rounded p-1.5 text-text-2 hover:bg-bg-1 hover:text-text-1 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleZoom(2)}
              title="Zoom Out (-)"
              className="rounded p-1.5 text-text-2 hover:bg-bg-1 hover:text-text-1 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-border mx-0.5 sm:mx-1" />
            <button
              onClick={handleReset}
              title="Reset View"
              className="rounded p-1.5 text-text-2 hover:bg-bg-1 hover:text-text-1 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {viewMode === '3d' && (
              <>
                <button
                  onClick={() => setAutoSpin(!autoSpin)}
                  title={autoSpin ? 'Pause Rotation' : 'Auto Rotate'}
                  className={`rounded p-1.5 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center ${
                    autoSpin ? 'text-accent bg-accent/15' : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
                  }`}
                >
                  {autoSpin ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
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
                    onClick={() => setCameraView('iso')}
                    className={`rounded border py-1.5 text-xs font-mono font-semibold transition-all ${
                      currentView === 'iso'
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border bg-bg-1 text-text-2 hover:border-text-2'
                    }`}
                  >
                    ISOMETRIC
                  </button>
                  <button
                    onClick={() => setCameraView('top')}
                    className={`rounded border py-1.5 text-xs font-mono font-semibold transition-all ${
                      currentView === 'top'
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border bg-bg-1 text-text-2 hover:border-text-2'
                    }`}
                  >
                    TOP (PCB)
                  </button>
                  <button
                    onClick={() => setCameraView('front')}
                    className={`rounded border py-1.5 text-xs font-mono font-semibold transition-all ${
                      currentView === 'front'
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-border bg-bg-1 text-text-2 hover:border-text-2'
                    }`}
                  >
                    FRONT (CAD)
                  </button>
                </div>
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
