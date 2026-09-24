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
  const [wireframe, setWireframe] = useState(false);
  const [autoSpin, setAutoSpin] = useState(true);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [currentView, setCurrentView] = useState<'iso' | 'top' | 'front'>('iso');

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const autoSpinRef = useRef(autoSpin);
  autoSpinRef.current = autoSpin;

  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const currentZ = cameraRef.current.position.z;
    const newZ = Math.min(Math.max(currentZ + delta, 3.5), 24);
    cameraRef.current.position.z = newZ;
  };

  const handleReset = () => {
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

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let isMounted = true;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animId: number;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    try {
      scene = new THREE.Scene();
      const isLightInitial = typeof document !== 'undefined' && document.documentElement.classList.contains('light');
      scene.background = new THREE.Color(isLightInitial ? 0xf1f3f5 : 0x0b0e14);

      const initialW = mount.clientWidth || 650;
      const initialH = mount.clientHeight || 550;

      camera = new THREE.PerspectiveCamera(45, initialW / (initialH || 1), 0.1, 100);
      camera.position.set(0, 5, 12);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(initialW, initialH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      mount.appendChild(renderer.domElement);

      const updateSize = () => {
        if (!mount || !renderer || !camera) return;
        const w = mount.clientWidth || 650;
        const h = mount.clientHeight || 550;
        camera.aspect = w / (h || 1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      const resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(mount);

      const group = new THREE.Group();
      groupRef.current = group;
      scene.add(group);

      // Ground plane grid
      const gridHelper = new THREE.GridHelper(16, 16, isLightInitial ? 0xd1d5db : 0x232838, isLightInitial ? 0xe5e7eb : 0x141821);
      gridHelper.position.y = -1.8;
      scene.add(gridHelper);

      // Lighting
      const ambLight = new THREE.AmbientLight(0xffffff, isLightInitial ? 1.6 : 0.9);
      scene.add(ambLight);

      const dirLight1 = new THREE.DirectionalLight(isLightInitial ? 0xd97706 : 0xff9f1c, 2.8);
      dirLight1.position.set(8, 12, 8);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(isLightInitial ? 0x0284c7 : 0x38bdf8, 2.2);
      dirLight2.position.set(-8, -6, -6);
      scene.add(dirLight2);

      // Theme-adaptive background & lighting listener
      const applyTheme = (isLight: boolean) => {
        scene.background = new THREE.Color(isLight ? 0xf1f3f5 : 0x0b0e14);
        gridHelper.material = new THREE.LineBasicMaterial({
          color: isLight ? 0xd1d5db : 0x232838,
          transparent: true,
          opacity: isLight ? 0.6 : 0.5,
        });
        ambLight.intensity = isLight ? 1.6 : 0.9;
        dirLight1.color.setHex(isLight ? 0xd97706 : 0xff9f1c);
        dirLight2.color.setHex(isLight ? 0x0284c7 : 0x38bdf8);
      };

      const themeObserver = new MutationObserver(() => {
        applyTheme(document.documentElement.classList.contains('light'));
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      // Build default procedural CAD / PCB model
      const buildProceduralCAD = () => {
        while (group.children.length > 0) {
          group.remove(group.children[0]);
        }

        // PCB base substrate
        const baseGeo = new THREE.BoxGeometry(6.5, 0.25, 4.2);
        const baseMat = new THREE.MeshStandardMaterial({
          color: category === 'HARDWARE' ? 0x0f2a1d : 0x141821, // Solder mask green or matte black
          roughness: 0.3,
          metalness: 0.5,
          wireframe,
        });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        group.add(baseMesh);

        // Gold traces and SMD pads
        const padMat = new THREE.MeshBasicMaterial({ color: 0xffd166, wireframe });
        for (let x = -2.6; x <= 2.6; x += 0.8) {
          for (let z = -1.6; z <= 1.6; z += 1.0) {
            const pad = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.35), padMat);
            pad.position.set(x, 0.04, z);
            group.add(pad);
          }
        }

        // Microcontroller / SoC package
        const mcuGeo = new THREE.BoxGeometry(2.0, 0.45, 2.0);
        const mcuMat = new THREE.MeshStandardMaterial({
          color: 0x1c2230,
          roughness: 0.2,
          metalness: 0.85,
          wireframe,
        });
        const mcu = new THREE.Mesh(mcuGeo, mcuMat);
        mcu.position.set(0, 0.25, 0);
        group.add(mcu);

        // Cylindrical Capacitors
        const capMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, wireframe });
        const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.7, 16), capMat);
        cap1.position.set(2.2, 0.45, 1.3);
        group.add(cap1);

        const cap2 = cap1.clone();
        cap2.position.set(2.2, 0.45, 0.5);
        group.add(cap2);

        // Terminal Block / Header
        const headerMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, wireframe });
        const header = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 2.5), headerMat);
        header.position.set(-2.6, 0.4, 0);
        group.add(header);
      };

      if (modelUrl) {
        setIsLoadingModel(true);
        // Load custom user 3D model (.glb / .gltf)
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

                // Auto-center and normalize size
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 5.5 / (maxDim || 1);
                model.scale.set(scale, scale, scale);

                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center.multiplyScalar(scale));

                // Apply wireframe to all submeshes if active
                model.traverse((child) => {
                  if ((child as THREE.Mesh).isMesh) {
                    const m = child as THREE.Mesh;
                    if (Array.isArray(m.material)) {
                      m.material.forEach((mat) => {
                        if (mat && 'wireframe' in mat) {
                          (mat as any).wireframe = wireframe;
                        }
                      });
                    } else if (m.material && 'wireframe' in m.material) {
                      (m.material as any).wireframe = wireframe;
                    }
                  }
                });

                group.add(model);
                setIsCustomModel(true);
                setIsLoadingModel(false);
              },
              undefined,
              (err) => {
                console.warn('Failed to load custom GLB model, falling back to CAD board:', err);
                if (isMounted) {
                  buildProceduralCAD();
                  setIsLoadingModel(false);
                }
              }
            );
          })
          .catch(() => {
            if (isMounted) {
              buildProceduralCAD();
              setIsLoadingModel(false);
            }
          });
      } else {
        buildProceduralCAD();
      }

      // Drag to rotate
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;

        group.rotation.y += deltaX * 0.012;
        group.rotation.x += deltaY * 0.012;

        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      // Mouse Wheel Zoom
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        if (!camera) return;
        camera.position.z = Math.min(Math.max(camera.position.z + e.deltaY * 0.015, 3.5), 24);
      };

      // Mobile touch rotate (1 finger) and pinch-zoom (2 fingers)
      let initialPinchDist = 0;
      let initialCameraZ = 0;

      const getTouchDistance = (t1: Touch, t2: Touch) => {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return Math.hypot(dx, dy);
      };

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          isDragging = true;
          prevMouseX = e.touches[0].clientX;
          prevMouseY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          isDragging = false;
          initialPinchDist = getTouchDistance(e.touches[0], e.touches[1]);
          if (camera) initialCameraZ = camera.position.z;
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1 && isDragging) {
          e.preventDefault();
          const deltaX = e.touches[0].clientX - prevMouseX;
          const deltaY = e.touches[0].clientY - prevMouseY;
          group.rotation.y += deltaX * 0.012;
          group.rotation.x += deltaY * 0.012;
          prevMouseX = e.touches[0].clientX;
          prevMouseY = e.touches[0].clientY;
        } else if (e.touches.length === 2 && initialPinchDist > 0 && camera) {
          e.preventDefault();
          const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
          const pinchFactor = initialPinchDist / (currentDist || 1);
          camera.position.z = Math.min(Math.max(initialCameraZ * pinchFactor, 3.5), 24);
        }
      };

      const onTouchEnd = () => {
        isDragging = false;
        initialPinchDist = 0;
      };

      mount.addEventListener('mousedown', onMouseDown);
      mount.addEventListener('wheel', onWheel, { passive: false });
      mount.addEventListener('touchstart', onTouchStart, { passive: false });
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);

      // Resize
      const onResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / (mount.clientHeight || 1);
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener('resize', onResize);

      // Render Loop
      const renderLoop = () => {
        animId = requestAnimationFrame(renderLoop);
        if (autoSpinRef.current && !isDragging) {
          group.rotation.y += 0.005;
        }
        renderer.render(scene, camera);
      };
      renderLoop();

      return () => {
        isMounted = false;
        themeObserver.disconnect();
        resizeObserver.disconnect();
        mount.removeEventListener('mousedown', onMouseDown);
        mount.removeEventListener('wheel', onWheel);
        mount.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(animId);
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch {
      return undefined;
    }
  }, [category, wireframe, modelUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-0/85 backdrop-blur-md p-2 sm:p-4">
      <div className="relative flex flex-col md:flex-row w-full max-w-5xl h-[92vh] sm:h-[85vh] max-h-[720px] overflow-hidden rounded-2xl border border-border bg-bg-1 shadow-2xl">
        {/* Mobile floating close button */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-3 right-3 z-30 rounded-full bg-surface/90 border border-border p-2 text-text-1 shadow-lg backdrop-blur-md"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left: 3D Viewport with Controls Overlay */}
        <div className="relative w-full h-[280px] sm:h-[350px] md:h-full md:flex-1 bg-bg-0 cursor-grab active:cursor-grabbing select-none overflow-hidden shrink-0">
          <div ref={mountRef} className="w-full h-full" style={{ touchAction: 'none' }} />

          {/* Top Badges */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2 pointer-events-none max-w-[80%]">
            <span className="rounded-md bg-surface/90 border border-border px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-mono text-accent-2 backdrop-blur-sm shadow truncate">
              {isCustomModel ? '3D CAD MODEL // LOADED' : '3D PCB FABRICATION // PROCEDURAL'}
            </span>
            {isLoadingModel && (
              <span className="rounded-md bg-accent/20 border border-accent/40 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-mono text-accent animate-pulse">
                Loading GLB...
              </span>
            )}
          </div>

          {/* Interactive Floating Toolset */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex items-center gap-1 sm:gap-1.5 rounded-lg border border-border bg-surface/90 p-1 sm:p-1.5 backdrop-blur-md shadow-xl">
            <button
              onClick={() => handleZoom(-2)}
              title="Zoom In (+)"
              className="rounded p-1.5 text-text-2 hover:bg-bg-1 hover:text-text-1 transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleZoom(2)}
              title="Zoom Out (-)"
              className="rounded p-1.5 text-text-2 hover:bg-bg-1 hover:text-text-1 transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-border mx-0.5 sm:mx-1" />
            <button
              onClick={handleReset}
              title="Reset View"
              className="rounded p-1.5 text-text-2 hover:bg-bg-1 hover:text-text-1 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setAutoSpin(!autoSpin)}
              title={autoSpin ? 'Pause Rotation' : 'Auto Rotate'}
              className={`rounded p-1.5 transition-colors ${
                autoSpin ? 'text-accent bg-accent/15' : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
              }`}
            >
              {autoSpin ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setWireframe(!wireframe)}
              title={wireframe ? 'Shaded View' : 'Wireframe'}
              className={`rounded p-1.5 transition-colors ${
                wireframe ? 'text-accent-2 bg-accent-2/15' : 'text-text-2 hover:bg-bg-1 hover:text-text-1'
              }`}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 pointer-events-none text-[10px] sm:text-[11px] font-mono text-text-2 bg-bg-0/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-border/40 backdrop-blur-sm">
            <span className="hidden sm:inline">Scroll / pinch to zoom • Drag to rotate</span>
            <span className="sm:hidden">Touch to rotate • Pinch to zoom</span>
          </div>
        </div>

        {/* Right: Technical Inspector Specs & Telemetry */}
        <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-border bg-surface/50 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto flex-1">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                {category}
              </span>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-text-2 hover:bg-surface hover:text-text-1 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-text-1 mb-1">{projectTitle}</h3>
            <p className="text-xs text-text-2 mb-6 font-mono">
              SYSTEM INSPECTOR // HARDWARE-IN-THE-LOOP
            </p>

            {/* Camera View Angle Presets */}
            <div className="mb-6">
              <div className="text-xs font-mono text-text-2 mb-2 font-semibold flex items-center justify-between">
                <span>VIEWPORT CAMERA ANGLE:</span>
                <span className="text-accent uppercase">{currentView}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                <button
                  onClick={() => setCameraView('iso')}
                  className={`py-1.5 px-2 rounded border text-center transition-all ${
                    currentView === 'iso'
                      ? 'bg-accent/15 border-accent text-accent font-bold'
                      : 'border-border bg-surface text-text-2 hover:text-text-1'
                  }`}
                >
                  Isometric
                </button>
                <button
                  onClick={() => setCameraView('top')}
                  className={`py-1.5 px-2 rounded border text-center transition-all ${
                    currentView === 'top'
                      ? 'bg-accent-2/15 border-accent-2 text-accent-2 font-bold'
                      : 'border-border bg-surface text-text-2 hover:text-text-1'
                  }`}
                >
                  Top (2D)
                </button>
                <button
                  onClick={() => setCameraView('front')}
                  className={`py-1.5 px-2 rounded border text-center transition-all ${
                    currentView === 'front'
                      ? 'bg-success/15 border-success text-success font-bold'
                      : 'border-border bg-surface text-text-2 hover:text-text-1'
                  }`}
                >
                  Front
                </button>
              </div>
            </div>

            {/* Fabrication Tech Stack */}
            <div className="mb-6">
              <div className="text-xs font-mono text-text-2 mb-2 font-semibold">
                FABRICATION & CODE STACK:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-bg-0 px-2 py-0.5 text-xs font-mono text-accent-2 border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Live Telemetry Card */}
            <div className="rounded-lg border border-border/80 bg-bg-1/80 p-3.5 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-text-2">
                <span>Model Source:</span>
                <span className="text-accent-2 font-semibold">
                  {isCustomModel ? 'Custom glTF Asset' : 'Procedural CAD Mesh'}
                </span>
              </div>
              <div className="flex justify-between text-text-2">
                <span>Shading Topology:</span>
                <span className="text-text-1">{wireframe ? 'Wireframe Lines' : 'PBR Solid Mesh'}</span>
              </div>
              <div className="flex justify-between text-text-2">
                <span>Auto Rotation:</span>
                <span className={autoSpin ? 'text-success' : 'text-text-2'}>
                  {autoSpin ? 'Active' : 'Locked'}
                </span>
              </div>
              <div className="flex justify-between text-text-2">
                <span>Engine Pipeline:</span>
                <span className="text-accent">Three.js WebGL</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between mt-6">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-mono text-accent-2 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Camera</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-accent px-5 py-2 text-xs font-semibold text-bg-0 hover:bg-accent-hover shadow transition-colors"
            >
              Close Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
