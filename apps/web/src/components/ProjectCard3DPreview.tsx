'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Box } from 'lucide-react';

interface ProjectCard3DPreviewProps {
  category: string;
  slug?: string;
  title?: string;
}

export function ProjectCard3DPreview({ category }: ProjectCard3DPreviewProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer | null = null;
    let group: THREE.Group;
    let animId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let isVisible = false;

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotX = 0.35;
    let rotY = -0.4;
    let targetRotX = 0.35;
    let targetRotY = -0.4;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      targetRotY += dx * 0.015;
      targetRotX += dy * 0.015;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchMode: 'undecided' | 'rotate' | 'scroll' = 'undecided';

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchMode = 'undecided';
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;

      if (touchMode === 'undecided') {
        const totalDx = Math.abs(currentX - touchStartX);
        const totalDy = Math.abs(currentY - touchStartY);
        if (totalDx < 6 && totalDy < 6) return;
        if (totalDy > totalDx) {
          touchMode = 'scroll';
          isDragging = false;
          return;
        } else {
          touchMode = 'rotate';
          isDragging = true;
        }
      }

      if (touchMode === 'rotate') {
        const dx = currentX - prevX;
        const dy = currentY - prevY;
        targetRotY += dx * 0.015;
        targetRotX += dy * 0.005;
        targetRotX = Math.max(-0.6, Math.min(0.8, targetRotX));
        prevX = currentX;
        prevY = currentY;
      }
    };

    const onTouchEnd = () => {
      touchMode = 'undecided';
      isDragging = false;
    };

    const animate = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        targetRotY += 0.008;
      }

      rotX += (targetRotX - rotX) * 0.1;
      rotY += (targetRotY - rotY) * 0.1;

      if (group) {
        group.rotation.x = rotX;
        group.rotation.y = rotY;
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    const initRenderer = () => {
      if (renderer) return;

      try {
        scene = new THREE.Scene();

        const w = mount.clientWidth || 300;
        const h = mount.clientHeight || 140;

        camera = new THREE.PerspectiveCamera(40, w / (h || 1), 0.1, 100);
        camera.position.set(0, 2.5, 7.5);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        mount.appendChild(renderer.domElement);

        group = new THREE.Group();
        scene.add(group);

        // Procedural 3D Model based on Project Category
        if (category === 'HYBRID') {
          // AUTONOMOUS ROVER CHASSIS & LIDAR
          const bodyGeo = new THREE.BoxGeometry(3.0, 0.8, 2.0);
          const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            metalness: 0.85,
            roughness: 0.25,
          });
          const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
          group.add(bodyMesh);

          const edgeGeo = new THREE.EdgesGeometry(bodyGeo);
          const edgeMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
          group.add(new THREE.LineSegments(edgeGeo, edgeMat));

          // 4 Off-road Wheels
          const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
          const rimMat = new THREE.MeshStandardMaterial({ color: 0xff9f1c, metalness: 0.9 });
          const wheelCoords = [
            [-1.5, -0.4, 1.2],
            [1.5, -0.4, 1.2],
            [-1.5, -0.4, -1.2],
            [1.5, -0.4, -1.2],
          ];

          wheelCoords.forEach(([x, y, z]) => {
            const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.35, 14);
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.x = Math.PI / 2;
            wheel.position.set(x, y, z);
            group.add(wheel);

            const rimGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.38, 10);
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.rotation.x = Math.PI / 2;
            rim.position.set(x, y, z);
            group.add(rim);
          });

          // Top LiDAR Turret
          const lidarBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.35, 0.35, 0.45, 16),
            new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9 })
          );
          lidarBase.position.set(0, 0.65, 0);
          group.add(lidarBase);

          const lidarDome = new THREE.Mesh(
            new THREE.SphereGeometry(0.28, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
          );
          lidarDome.position.set(0, 0.95, 0);
          group.add(lidarDome);
        } else if (category === 'HARDWARE') {
          // MULTI-LAYER PCB WITH SILICON CHIP & SMD
          const pcbGeo = new THREE.BoxGeometry(3.6, 0.2, 2.6);
          const pcbMat = new THREE.MeshStandardMaterial({
            color: 0x064e3b,
            roughness: 0.35,
            metalness: 0.4,
          });
          const pcb = new THREE.Mesh(pcbGeo, pcbMat);
          group.add(pcb);

          const edgeGeo = new THREE.EdgesGeometry(pcbGeo);
          const edgeMat = new THREE.LineBasicMaterial({ color: 0xd97706 });
          group.add(new THREE.LineSegments(edgeGeo, edgeMat));

          const mcu = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.3, 1.4),
            new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 })
          );
          mcu.position.set(0, 0.18, 0);
          group.add(mcu);

          const pinMat = new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.95 });
          for (let i = -1.3; i <= 1.3; i += 0.45) {
            const pinTop = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.1), pinMat);
            pinTop.position.set(i, 0.16, 1.1);
            group.add(pinTop);

            const pinBottom = pinTop.clone();
            pinBottom.position.set(i, 0.16, -1.1);
            group.add(pinBottom);
          }

          const capMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.85 });
          const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.45, 12), capMat);
          cap1.position.set(1.1, 0.3, 0.3);
          group.add(cap1);

          const cap2 = cap1.clone();
          cap2.position.set(1.1, 0.3, -0.4);
          group.add(cap2);
        } else {
          // GROUND STATION TELEMETRY DISH
          const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.7, 0.9, 0.3, 14),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
          );
          base.position.set(0, -0.6, 0);
          group.add(base);

          const mast = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 1.2, 10),
            new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 })
          );
          mast.position.set(0, 0, 0);
          group.add(mast);

          const dishGeo = new THREE.SphereGeometry(1.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.2);
          const dishMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            metalness: 0.85,
            roughness: 0.2,
            side: THREE.DoubleSide,
          });
          const dish = new THREE.Mesh(dishGeo, dishMat);
          dish.position.set(0, 0.6, 0);
          dish.rotation.x = Math.PI / 3;
          group.add(dish);

          const horn = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8),
            new THREE.MeshBasicMaterial({ color: 0xff9f1c })
          );
          horn.position.set(0, 0.9, 0.5);
          horn.rotation.x = Math.PI / 3;
          group.add(horn);
        }

        // Studio Lighting
        const ambLight = new THREE.AmbientLight(0xffffff, 1.4);
        scene.add(ambLight);

        const dirLight = new THREE.DirectionalLight(0xff9f1c, 2.5);
        dirLight.position.set(5, 7, 5);
        scene.add(dirLight);

        const fillLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
        fillLight.position.set(-5, -4, -4);
        scene.add(fillLight);

        const updateSize = () => {
          if (!mount || !renderer || !camera) return;
          const newW = mount.clientWidth || 300;
          const newH = mount.clientHeight || 140;
          camera.aspect = newW / (newH || 1);
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        };

        resizeObserver = new ResizeObserver(() => {
          updateSize();
        });
        resizeObserver.observe(mount);

        mount.style.touchAction = 'pan-y';

        mount.addEventListener('mousedown', onMouseDown);
        mount.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('touchend', onTouchEnd);

        animate();
      } catch {
        return;
      }
    };

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
            if (!renderer) {
              initRenderer();
            } else if (!animId) {
              animate();
            }
          } else {
            isVisible = false;
            if (animId) {
              cancelAnimationFrame(animId);
              animId = 0;
            }
          }
        });
      },
      { threshold: 0.15 }
    );
    intersectionObserver.observe(mount);

    return () => {
      if (intersectionObserver) intersectionObserver.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (animId) cancelAnimationFrame(animId);
      if (renderer) {
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, [category]);

  return (
    <div
      className="relative w-full h-[140px] sm:h-[150px] rounded-lg border border-border/60 bg-gradient-to-b from-bg-1/80 to-bg-0/90 overflow-hidden mb-4 cursor-grab active:cursor-grabbing select-none shadow-inner"
      style={{ touchAction: 'pan-y' }}
    >
      <div ref={mountRef} className="w-full h-full" style={{ touchAction: 'pan-y' }} />
      <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-surface/80 border border-border/80 px-2 py-0.5 text-[10px] font-mono text-accent-2 pointer-events-none backdrop-blur-sm">
        <Box className="h-3 w-3" />
        <span>3D CAD VIEW</span>
      </div>
      <div className="absolute bottom-1.5 left-2 text-[9px] font-mono text-text-2 pointer-events-none opacity-70">
        Drag / swipe to rotate
      </div>
    </div>
  );
}
