'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, Sparkles } from 'lucide-react';

export function ThreeHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer | null = null;
    let particlesMesh: THREE.Points;
    let chipMesh: THREE.Group;
    let cornerLeds: THREE.Mesh[] = [];
    let animationFrameId: number;
    let resizeObserver: ResizeObserver | null = null;

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotX = 0.35;
    let rotY = -0.45;
    let targetRotX = 0.35;
    let targetRotY = -0.45;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    try {
      scene = new THREE.Scene();

      const initialWidth = container.clientWidth || 320;
      const initialHeight = container.clientHeight || 280;

      camera = new THREE.PerspectiveCamera(
        42,
        initialWidth / (initialHeight || 1),
        0.1,
        1000
      );
      // Adaptive mobile camera distance
      if (initialWidth < 640 || (initialWidth / initialHeight) < 1.0) {
        camera.position.set(0, 1.4, 16.5);
      } else {
        camera.position.set(0, 2.2, 13.5);
      }
      camera.lookAt(0, 0, 0);

      // Robust WebGL renderer initialization for iOS Safari & Android
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'default',
        precision: 'mediump',
      });
      renderer.setSize(initialWidth, initialHeight);
      renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.25));
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.touchAction = 'pan-y'; // Allow vertical page scrolling
      container.appendChild(renderer.domElement);

      // PARTICLE CIRCUIT DUST
      const particleCount = 180;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const colorAccent = new THREE.Color('#FF9F1C');
      const colorCyan = new THREE.Color('#38BDF8');

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 26;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

        const c = Math.random() > 0.4 ? colorCyan : colorAccent;
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.22,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
      });

      particlesMesh = new THREE.Points(particleGeo, particleMat);
      scene.add(particlesMesh);

      // SILICON CHIP PACKAGE
      chipMesh = new THREE.Group();
      scene.add(chipMesh);

      const isLightMode = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light';

      // 1. Ceramic / Matte Titanium Silicon Die Base
      const dieGeo = new THREE.BoxGeometry(6.4, 0.55, 6.4);
      const dieMat = new THREE.MeshStandardMaterial({
        color: isLightMode ? 0x1e293b : 0x0f172a,
        roughness: 0.35,
        metalness: 0.8,
      });
      const die = new THREE.Mesh(dieGeo, dieMat);
      chipMesh.add(die);

      // Edge wireframe accent
      const dieEdgeGeo = new THREE.EdgesGeometry(dieGeo);
      const dieEdgeMat = new THREE.LineBasicMaterial({
        color: isLightMode ? 0xd97706 : 0x38bdf8,
        linewidth: 1.5,
      });
      chipMesh.add(new THREE.LineSegments(dieEdgeGeo, dieEdgeMat));

      // 2. Metallic Heat Spreader Center Plate
      const heatSpreaderGeo = new THREE.BoxGeometry(4.4, 0.28, 4.4);
      const heatSpreaderMat = new THREE.MeshStandardMaterial({
        color: isLightMode ? 0x475569 : 0x1e293b,
        metalness: 0.95,
        roughness: 0.15,
      });
      const heatSpreader = new THREE.Mesh(heatSpreaderGeo, heatSpreaderMat);
      heatSpreader.position.y = 0.38;
      chipMesh.add(heatSpreader);

      // 3. Gold Wire-Bonding Connection Pins (40 Peripheral Pins)
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xffb703,
        metalness: 0.95,
        roughness: 0.2,
      });
      const pinCoords: [number, number, number][] = [];
      const pinOffset = 3.35;
      const pinSpacing = 0.58;

      for (let i = -4.5; i <= 4.5; i += 1.0) {
        pinCoords.push([i * pinSpacing, 0, pinOffset]);
        pinCoords.push([i * pinSpacing, 0, -pinOffset]);
        pinCoords.push([pinOffset, 0, i * pinSpacing]);
        pinCoords.push([-pinOffset, 0, i * pinSpacing]);
      }

      pinCoords.forEach(([x, y, z]) => {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.45), pinMat);
        pin.position.set(x, y, z);
        if (Math.abs(x) > Math.abs(z)) {
          pin.rotation.y = Math.PI / 2;
        }
        chipMesh.add(pin);
      });

      // 4. Glowing Bus Traces (Gold & Cyan Micro-Traces)
      const traceGeo = new THREE.PlaneGeometry(3.6, 3.6);
      const traceMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85,
        wireframe: true,
      });
      const traces = new THREE.Mesh(traceGeo, traceMat);
      traces.rotation.x = -Math.PI / 2;
      traces.position.y = 0.54;
      chipMesh.add(traces);

      // 5. Pulsing Status LEDs on 4 Corners
      const ledColors = [0x22c55e, 0x38bdf8, 0xf59e0b, 0xef4444];
      const ledPositions = [
        [-2.7, 0.32, -2.7],
        [2.7, 0.32, -2.7],
        [-2.7, 0.32, 2.7],
        [2.7, 0.32, 2.7],
      ];

      ledPositions.forEach(([x, y, z], idx) => {
        const ledGeo = new THREE.SphereGeometry(0.18, 12, 12);
        const ledMat = new THREE.MeshBasicMaterial({ color: ledColors[idx] });
        const ledMesh = new THREE.Mesh(ledGeo, ledMat);
        ledMesh.position.set(x, y, z);
        chipMesh.add(ledMesh);
        cornerLeds.push(ledMesh);
      });

      // Lighting Setup
      const ambientLight = new THREE.AmbientLight(0xffffff, isLightMode ? 1.6 : 1.1);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xff9f1c, 2.6);
      keyLight.position.set(8, 12, 10);
      scene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
      fillLight.position.set(-8, -6, -8);
      scene.add(fillLight);

      // Theme Change Observer
      const handleThemeChange = () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        dieMat.color.setHex(isLight ? 0x1e293b : 0x0f172a);
        dieEdgeMat.color.setHex(isLight ? 0xd97706 : 0x38bdf8);
        heatSpreaderMat.color.setHex(isLight ? 0x475569 : 0x1e293b);
        ambientLight.intensity = isLight ? 1.6 : 1.1;
      };

      const themeObserver = new MutationObserver(handleThemeChange);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
      window.addEventListener('traic-theme-change', handleThemeChange);

      // ROCK-SOLID TOUCH & DRAG EVENT HANDLING FOR IPHONE, ANDROID & DESKTOP
      const dom = renderer.domElement;

      let touchStartX = 0;
      let touchStartY = 0;
      let touchPrevX = 0;
      let touchPrevY = 0;
      let touchMode: 'none' | 'rotate' | 'scroll' = 'none';

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchPrevX = touchStartX;
        touchPrevY = touchStartY;
        touchMode = 'none';
        isDragging = true;
      };

      const onTouchMove = (e: TouchEvent) => {
        if (!isDragging || e.touches.length !== 1) return;
        const curX = e.touches[0].clientX;
        const curY = e.touches[0].clientY;

        const dx = curX - touchPrevX;
        const dy = curY - touchPrevY;

        if (touchMode === 'none') {
          const totalDx = Math.abs(curX - touchStartX);
          const totalDy = Math.abs(curY - touchStartY);
          if (totalDx < 6 && totalDy < 6) return; // small gesture threshold
          if (totalDy > totalDx * 1.25) {
            // Primarily vertical swipe: let the page scroll freely on mobile!
            touchMode = 'scroll';
            isDragging = false;
            return;
          } else {
            // Primarily horizontal swipe: user is rotating the 3D chip!
            touchMode = 'rotate';
          }
        }

        if (touchMode === 'rotate') {
          if (e.cancelable) {
            e.preventDefault(); // Stop iOS Safari from canceling touch or scrolling
          }
          targetRotY += dx * 0.012;
          targetRotX += dy * 0.006;
          targetRotX = Math.max(-0.6, Math.min(0.8, targetRotX));
          touchPrevX = curX;
          touchPrevY = curY;
        }
      };

      const onTouchEnd = () => {
        isDragging = false;
        touchMode = 'none';
      };

      // Mouse Drag Controls for Desktop
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevX = e.clientX;
        prevY = e.clientY;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        targetRotY += dx * 0.012;
        targetRotX += dy * 0.006;
        targetRotX = Math.max(-0.6, Math.min(0.8, targetRotX));
        prevX = e.clientX;
        prevY = e.clientY;
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      dom.addEventListener('touchstart', onTouchStart, { passive: true });
      dom.addEventListener('touchmove', onTouchMove, { passive: false });
      dom.addEventListener('touchend', onTouchEnd, { passive: true });
      dom.addEventListener('touchcancel', onTouchEnd, { passive: true });

      dom.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      // Resize handling
      const updateDimensions = () => {
        if (!container || !renderer || !camera) return;
        const w = Math.max(container.clientWidth, 320);
        const h = Math.max(container.clientHeight, 280);
        camera.aspect = w / h;
        if (w < 640 || w / h < 1.0) {
          camera.position.set(0, 1.4, 16.5);
        } else {
          camera.position.set(0, 2.2, 13.5);
        }
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(container);

      // Animation Loop
      const clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        if (!isDragging && !prefersReducedMotion) {
          targetRotY += 0.005;
        }

        rotX += (targetRotX - rotX) * 0.08;
        rotY += (targetRotY - rotY) * 0.08;

        chipMesh.rotation.x = rotX + Math.sin(elapsedTime * 0.9) * 0.04;
        chipMesh.rotation.y = rotY;
        chipMesh.position.y = Math.sin(elapsedTime * 1.4) * 0.2;

        particlesMesh.rotation.y = elapsedTime * 0.025;

        if (cornerLeds.length >= 4) {
          cornerLeds[0].scale.setScalar(1 + Math.sin(elapsedTime * 4.0) * 0.2);
          cornerLeds[1].scale.setScalar(1 + Math.cos(elapsedTime * 3.5) * 0.2);
          cornerLeds[2].scale.setScalar(1 + Math.sin(elapsedTime * 5.0) * 0.2);
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };
      animate();

      return () => {
        themeObserver.disconnect();
        window.removeEventListener('traic-theme-change', handleThemeChange);
        if (resizeObserver) resizeObserver.disconnect();
        dom.removeEventListener('touchstart', onTouchStart);
        dom.removeEventListener('touchmove', onTouchMove);
        dom.removeEventListener('touchend', onTouchEnd);
        dom.removeEventListener('touchcancel', onTouchEnd);
        dom.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        cancelAnimationFrame(animationFrameId);
        if (renderer) {
          if (renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
          renderer.dispose();
          renderer.forceContextLoss(); // Guarantees iOS Safari reclaims GPU WebGL context
        }
      };
    } catch (e) {
      console.warn('ThreeHeroScene WebGL initialization error:', e);
      setWebGLSupported(false);
      return undefined;
    }
  }, []);

  if (!webGLSupported) {
    // If WebGL fails, render the high-res 3D CAD render image so design matches perfectly!
    return (
      <div className="relative w-full h-full p-3 select-none flex items-center justify-center">
        <div className="relative z-10 w-full h-full max-h-[360px] rounded-xl overflow-hidden border border-border/60 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-hardware-core.jpg"
            alt="TRAIC H7 Advanced Robotics Hardware Computing Core"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded bg-bg-0/80 border border-accent/40 px-2 py-0.5 text-[9px] font-mono text-accent backdrop-blur-md">
              <Activity className="h-3 w-3 animate-pulse" />
              <span>CORE ACTIVE // 480 MHz</span>
            </span>
          </div>
          <div className="absolute bottom-3 right-3 pointer-events-none">
            <span className="rounded bg-bg-0/85 border border-accent-2/40 px-2 py-0.5 text-[9px] font-mono text-accent-2 backdrop-blur-md flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-accent" />
              <span>ARM CORTEX-M7 ROBOTICS NODE</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[280px] select-none relative cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
      aria-label="Interactive 3D STM32 Silicon Chip Node"
    />
  );
}
