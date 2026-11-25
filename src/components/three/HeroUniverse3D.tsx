import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function HeroUniverse3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    if (reducedMotion || contextLost) return;
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const isMobile = window.innerWidth < 768;
    let frameId = 0;
    let disposed = false;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true,
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2),
    );
    renderer.setClearColor(0x080808, 0);

    const width = container.clientWidth || 960;
    const height = container.clientHeight || 640;
    renderer.setSize(width, height);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(canvas);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.055);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(0, 0.3, isMobile ? 8.2 : 6.6);

    // Warm key, cool hemisphere fill, mint rim
    scene.add(new THREE.HemisphereLight(0xbae6fd, 0x080808, 0.75));
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x22d3a6, 1.45);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // Composite Architectural Sculpture representing multi-layer software engineering
    const universe = new THREE.Group();
    universe.position.set(isMobile ? 0 : 1.75, isMobile ? -0.35 : 0.05, 0);
    scene.add(universe);

    // 1. Dark Anodized Kernel Core
    const kernelGeo = new THREE.DodecahedronGeometry(0.92, 0);
    const kernelMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.92,
      roughness: 0.22,
    });
    const kernel = new THREE.Mesh(kernelGeo, kernelMat);
    universe.add(kernel);
    geometries.push(kernelGeo);
    materials.push(kernelMat);

    // 2. Mint Architectural Wireframe Containment
    const wireGeo = new THREE.IcosahedronGeometry(1.38, 1);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x22d3a6,
      metalness: 0.5,
      roughness: 0.45,
      wireframe: true,
      transparent: true,
      opacity: 0.34,
    });
    const wireShell = new THREE.Mesh(wireGeo, wireMat);
    universe.add(wireShell);
    geometries.push(wireGeo);
    materials.push(wireMat);

    // 3-5. Three Gyroscopic Orbital Rings
    const ringSpecs = [
      { r: 1.95, tube: 0.018, color: 0xe4e4e7, rx: 0.58, ry: 0.2 },
      { r: 2.38, tube: 0.014, color: 0x22d3a6, rx: -0.42, ry: 0.75 },
      { r: 2.82, tube: 0.012, color: 0xf59e0b, rx: 1.05, ry: -0.35 },
    ];
    const rings: THREE.Mesh[] = [];
    ringSpecs.forEach((spec) => {
      const rGeo = new THREE.TorusGeometry(spec.r, spec.tube, 12, 84);
      const rMat = new THREE.MeshStandardMaterial({
        color: spec.color,
        metalness: 0.85,
        roughness: 0.24,
      });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.set(spec.rx, spec.ry, 0);
      universe.add(ring);
      rings.push(ring);
      geometries.push(rGeo);
      materials.push(rMat);
    });

    // 6. Six Technology Satellite Polyhedra
    const satelliteColors = [
      0x00add8, // Go
      0x818cf8, // PHP
      0x3178c6, // TS
      0x22d3a6, // SQL / Core
      0xf59e0b, // REST
      0xe4e4e7, // Linux
    ];
    const satellites: { mesh: THREE.Mesh; radius: number; speed: number; phase: number; tilt: number }[] = [];
    const satGeo = new THREE.OctahedronGeometry(0.14, 0);
    geometries.push(satGeo);

    satelliteColors.forEach((hex, idx) => {
      const satMat = new THREE.MeshStandardMaterial({
        color: hex,
        metalness: 0.78,
        roughness: 0.26,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      universe.add(sat);
      materials.push(satMat);
      satellites.push({
        mesh: sat,
        radius: 1.95 + (idx % 3) * 0.44,
        speed: 0.32 + idx * 0.06,
        phase: (idx / satelliteColors.length) * Math.PI * 2,
        tilt: (idx % 2 === 0 ? 1 : -1) * 0.45,
      });
    });

    // 7. Instanced Architectural Particle Field
    const particleCount = isMobile ? 75 : 150;
    const pGeo = new THREE.BoxGeometry(0.036, 0.036, 0.036);
    const pMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.4,
    });
    const particles = new THREE.InstancedMesh(pGeo, pMat, particleCount);
    const dummy = new THREE.Object3D();
    const pPalette = [
      new THREE.Color(0x22d3a6),
      new THREE.Color(0x71717a),
      new THREE.Color(0xf59e0b),
    ];

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const dist = 3.1 + (i % 7) * 0.42;
      dummy.position.set(
        dist * Math.sin(phi) * Math.cos(theta),
        dist * Math.cos(phi) * 0.72,
        dist * Math.sin(phi) * Math.sin(theta),
      );
      dummy.scale.setScalar(0.6 + (i % 4) * 0.25);
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
      particles.setColorAt(i, pPalette[i % pPalette.length]);
    }
    particles.instanceMatrix.needsUpdate = true;
    if (particles.instanceColor) particles.instanceColor.needsUpdate = true;
    particles.computeBoundingSphere();
    universe.add(particles);
    geometries.push(pGeo);
    materials.push(pMat);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      kernel.rotation.y += delta * 0.28;
      kernel.rotation.x += delta * 0.14;
      wireShell.rotation.y -= delta * 0.16;

      rings[0].rotation.z += delta * 0.24;
      rings[1].rotation.z -= delta * 0.19;
      rings[2].rotation.z += delta * 0.14;

      satellites.forEach((s) => {
        const a = s.phase + elapsed * s.speed;
        s.mesh.position.set(
          Math.cos(a) * s.radius,
          Math.sin(a * 1.2) * s.tilt,
          Math.sin(a) * s.radius,
        );
        s.mesh.rotation.y += delta * 0.9;
      });

      particles.rotation.y = elapsed * 0.04;

      universe.rotation.y = THREE.MathUtils.damp(
        universe.rotation.y,
        pointer.x * 0.26,
        3.5,
        delta,
      );
      universe.rotation.x = THREE.MathUtils.damp(
        universe.rotation.x,
        pointer.y * 0.18,
        3.5,
        delta,
      );

      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      scene.environment?.dispose();
      renderer.dispose();
    };
  }, [reducedMotion, contextLost]);

  if (reducedMotion || contextLost) {
    return (
      <div
        className="w-full h-full bg-architectural-grid opacity-55"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      aria-label="Interactive 3D software architecture universe"
    />
  );
}
