'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ThreeHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particlesMesh: THREE.Points;
    let chipMesh: THREE.Group;
    let cornerLeds: THREE.Mesh[] = [];
    let animationFrameId: number;
    let resizeObserver: ResizeObserver | null = null;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
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
      const initialHeight = container.clientHeight || 260;

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

      // Safe WebGL settings for iOS Safari & mobile devices
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: typeof window !== 'undefined' ? (window.devicePixelRatio || 1) < 2 : false,
        powerPreference: 'default',
        precision: 'mediump',
      });
      renderer.setSize(initialWidth, initialHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      container.appendChild(renderer.domElement);

      // PARTICLE CIRCUIT DUST
      const particleCount = 220;
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

      // CENTRAL SILICON CHIP NODE
      chipMesh = new THREE.Group();

      // Main chip package die
      const dieGeo = new THREE.BoxGeometry(4.8, 4.8, 0.48);
      const dieMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.22,
        metalness: 0.88,
      });
      const dieMesh = new THREE.Mesh(dieGeo, dieMat);
      chipMesh.add(dieMesh);

      // Metallic top heat spreader layer
      const topPlateGeo = new THREE.BoxGeometry(3.6, 3.6, 0.52);
      const topPlateMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.25,
        metalness: 0.92,
      });
      const topPlateMesh = new THREE.Mesh(topPlateGeo, topPlateMat);
      chipMesh.add(topPlateMesh);

      // Glowing circuit core border
      const edgeGeo = new THREE.EdgesGeometry(dieGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
      const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
      chipMesh.add(edgeLines);

      // Gold wire bonding pins on edges
      const pinMat = new THREE.MeshStandardMaterial({
        color: 0xffbe0b,
        metalness: 0.95,
        roughness: 0.15,
      });

      for (let i = -2.0; i <= 2.0; i += 0.5) {
        // Top and bottom pins
        const pinTop = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.65, 0.12), pinMat);
        pinTop.position.set(i, 2.7, 0);
        chipMesh.add(pinTop);

        const pinBottom = pinTop.clone();
        pinBottom.position.set(i, -2.7, 0);
        chipMesh.add(pinBottom);

        // Left and right pins
        const pinLeft = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.2, 0.12), pinMat);
        pinLeft.position.set(-2.7, i, 0);
        chipMesh.add(pinLeft);

        const pinRight = pinLeft.clone();
        pinRight.position.set(2.7, i, 0);
        chipMesh.add(pinRight);
      }

      // 4 Status corner LEDs
      const ledColors = [0x34d399, 0x38bdf8, 0xff9f1c, 0xf87171];
      const ledCoords = [
        [-1.6, 1.6],
        [1.6, 1.6],
        [-1.6, -1.6],
        [1.6, -1.6],
      ];
      cornerLeds = [];
      for (let j = 0; j < 4; j++) {
        const ledGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12);
        const ledMat = new THREE.MeshBasicMaterial({ color: ledColors[j] });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.rotation.x = Math.PI / 2;
        led.position.set(ledCoords[j][0], ledCoords[j][1], 0.28);
        chipMesh.add(led);
        cornerLeds.push(led);
      }

      // Ground plane grid
      const gridHelper = new THREE.GridHelper(18, 18, 0x232838, 0x141821);
      gridHelper.position.y = -3.2;
      scene.add(gridHelper);

      scene.add(chipMesh);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
      keyLight.position.set(2, 9, 11);
      scene.add(keyLight);

      const cyanPoint = new THREE.PointLight(0x38bdf8, 5.5, 40);
      cyanPoint.position.set(-8, 8, 10);
      scene.add(cyanPoint);

      const amberPoint = new THREE.PointLight(0xff9f1c, 6.0, 40);
      amberPoint.position.set(8, -6, 9);
      scene.add(amberPoint);

      // Theme-adaptive materials and studio lighting
      const applyTheme = (isLight: boolean) => {
        if (isLight) {
          // Matte ceramic charcoal chip die with steel heat spreader and gold pins
          dieMat.color.setHex(0x1e293b);
          dieMat.metalness = 0.85;
          dieMat.roughness = 0.25;
          topPlateMat.color.setHex(0x475569);
          topPlateMat.metalness = 0.9;
          topPlateMat.roughness = 0.2;
          edgeMat.color.setHex(0xd97706);
          pinMat.color.setHex(0xb45309);
          ambientLight.intensity = 2.4;
          keyLight.intensity = 3.2;
          cyanPoint.color.setHex(0x0284c7);
          cyanPoint.intensity = 5.0;
          amberPoint.color.setHex(0xd97706);
          amberPoint.intensity = 6.0;
          gridHelper.material = new THREE.LineBasicMaterial({
            color: 0x94a3b8,
            transparent: true,
            opacity: 0.6,
          });
        } else {
          // Dark Obsidian high-contrast metallic titanium
          dieMat.color.setHex(0x1e293b);
          dieMat.metalness = 0.88;
          dieMat.roughness = 0.22;
          topPlateMat.color.setHex(0x334155);
          topPlateMat.metalness = 0.95;
          edgeMat.color.setHex(0x38bdf8);
          pinMat.color.setHex(0xffbe0b);
          ambientLight.intensity = 2.0;
          keyLight.intensity = 3.2;
          cyanPoint.color.setHex(0x38bdf8);
          cyanPoint.intensity = 6.0;
          amberPoint.color.setHex(0xff9f1c);
          amberPoint.intensity = 6.5;
          gridHelper.material = new THREE.LineBasicMaterial({
            color: 0x475569,
            transparent: true,
            opacity: 0.65,
          });
        }
      };

      const checkIsLight = () =>
        typeof document !== 'undefined' &&
        (document.documentElement.classList.contains('light') ||
          document.documentElement.getAttribute('data-theme') === 'light');

      applyTheme(checkIsLight());

      const themeObserver = new MutationObserver(() => {
        applyTheme(checkIsLight());
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      });

      // Pointer drag interaction
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.012;
        targetRotX += deltaY * 0.012;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      };

      const onMouseUp = () => {
        isDragging = false;
      };

      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);

      // Mobile Touch Interaction: Disambiguate vertical page scrolling from 3D rotation
      let touchStartX = 0;
      let touchStartY = 0;
      let touchMode: 'undecided' | 'rotate' | 'scroll' = 'undecided';

      container.style.touchAction = 'pan-y';

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 1) {
          touchMode = 'undecided';
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          prevMouseX = e.touches[0].clientX;
          prevMouseY = e.touches[0].clientY;
        }
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length !== 1) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        if (touchMode === 'undecided') {
          const totalDx = Math.abs(currentX - touchStartX);
          const totalDy = Math.abs(currentY - touchStartY);
          if (totalDx < 8 && totalDy < 8) return; // small gesture threshold
          if (totalDy > totalDx) {
            // Primarily vertical swipe: let the page scroll freely!
            touchMode = 'scroll';
            isDragging = false;
            return;
          } else {
            // Primarily horizontal swipe: user wants to rotate the 3D node!
            touchMode = 'rotate';
            isDragging = true;
          }
        }

        if (touchMode === 'rotate') {
          const deltaX = currentX - prevMouseX;
          const deltaY = currentY - prevMouseY;
          targetRotY += deltaX * 0.012;
          targetRotX += deltaY * 0.005;
          targetRotX = Math.max(-0.6, Math.min(0.8, targetRotX));
          prevMouseX = currentX;
          prevMouseY = currentY;
        }
      };

      const onTouchEnd = () => {
        touchMode = 'undecided';
        isDragging = false;
      };

      container.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);

      // ResizeObserver to adapt smoothly whenever container layout changes
      const updateSize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth || 500;
        const h = container.clientHeight || 420;
        camera.aspect = w / (h || 1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(container);

      // Animation loop
      const clock = new THREE.Clock();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Idle slow spin if not dragging and motion is not reduced
        if (!isDragging && !prefersReducedMotion) {
          targetRotY += 0.005;
        }

        // Smooth damping
        rotX += (targetRotX - rotX) * 0.08;
        rotY += (targetRotY - rotY) * 0.08;

        chipMesh.rotation.x = rotX + Math.sin(elapsedTime * 0.9) * 0.04;
        chipMesh.rotation.y = rotY;
        chipMesh.position.y = Math.sin(elapsedTime * 1.4) * 0.2;

        // Particle field subtle spin
        particlesMesh.rotation.y = elapsedTime * 0.025;

        // Pulse corner status LEDs
        if (cornerLeds.length >= 4) {
          cornerLeds[0].scale.setScalar(1 + Math.sin(elapsedTime * 4.0) * 0.2);
          cornerLeds[1].scale.setScalar(1 + Math.cos(elapsedTime * 3.5) * 0.2);
          cornerLeds[2].scale.setScalar(1 + Math.sin(elapsedTime * 5.0) * 0.2);
        }

        renderer.render(scene, camera);
      };

      const updateDimensions = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth || 320;
        const h = container.clientHeight || 260;
        camera.aspect = w / (h || 1);
        if (w < 640 || camera.aspect < 1.0) {
          camera.position.set(0, 1.4, 16.5);
        } else {
          camera.position.set(0, 2.2, 13.5);
        }
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });
      resizeObserver.observe(container);
      window.addEventListener('resize', updateDimensions);
      requestAnimationFrame(updateDimensions);

      animate();

      return () => {
        themeObserver.disconnect();
        window.removeEventListener('resize', updateDimensions);
        if (resizeObserver) resizeObserver.disconnect();
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        cancelAnimationFrame(animationFrameId);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (e) {
      console.warn('ThreeHeroScene WebGL initialization error:', e);
      setWebGLSupported(false);
      return undefined;
    }
  }, []);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full min-h-[260px] flex items-center justify-center bg-bg-1 circuit-pattern">
        <div className="text-center p-6 font-mono text-xs text-text-2">
          <p className="text-accent font-bold mb-1">TRAIC HARDWARE CORE</p>
          <p>Silicon Telemetry Node Active</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[260px] select-none relative"
      style={{ minHeight: '260px', width: '100%', height: '100%' }}
      aria-label="Interactive 3D STM32 Silicon Chip Node"
    />
  );
}
