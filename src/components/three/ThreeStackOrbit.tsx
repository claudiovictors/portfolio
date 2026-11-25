import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface OrbitTechNode {
  id: string;
  label: string;
  color: string;
  categoryLabel: string;
}

const ORBIT_NODES: OrbitTechNode[] = [
  { id: 'go', label: 'Go', color: '#00ADD8', categoryLabel: 'Systems & Frameworks' },
  { id: 'php', label: 'PHP', color: '#8892BF', categoryLabel: 'MVC & Web Apps' },
  { id: 'typescript', label: 'TypeScript', color: '#3178C6', categoryLabel: 'Web & Mobile' },
  { id: 'python', label: 'Python', color: '#EAB308', categoryLabel: 'Scripting & ML' },
  { id: 'postgresql', label: 'PostgreSQL', color: '#10B981', categoryLabel: 'Relational Data' },
];

interface ThreeStackOrbitProps {
  selectedId: string;
  onSelectTech: (id: string) => void;
}

function isSoftwareRenderer(): boolean {
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

export function ThreeStackOrbit({
  selectedId,
  onSelectTech,
}: ThreeStackOrbitProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [contextLost, setContextLost] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const selectedRef = useRef(selectedId);
  const onSelectRef = useRef(onSelectTech);

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    onSelectRef.current = onSelectTech;
  }, [onSelectTech]);

  useEffect(() => {
    if (reducedMotion || contextLost) return;
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = isSoftwareRenderer();
    let frameId = 0;
    let disposed = false;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextLost(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2),
    );
    renderer.setClearColor(0x0c0c10, 1);

    const w = container.clientWidth || 560;
    const h = container.clientHeight || 260;
    renderer.setSize(w, h);

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
    scene.background = new THREE.Color(0x0c0c10);
    scene.fog = new THREE.FogExp2(0x0c0c10, 0.055);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 40);
    camera.position.set(0, 2.3, 5.4);
    camera.lookAt(0, 0, 0);

    const hemi = new THREE.HemisphereLight(0xbae6fd, 0x09090b, 0.8);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
    keyLight.position.set(4, 6, 4);
    scene.add(keyLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // Central composite kernel
    const hubGroup = new THREE.Group();
    const hubCoreGeo = new THREE.DodecahedronGeometry(0.55, 0);
    const hubCoreMat = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      metalness: 0.9,
      roughness: 0.2,
    });
    const hubCore = new THREE.Mesh(hubCoreGeo, hubCoreMat);
    hubGroup.add(hubCore);

    const hubRingGeo = new THREE.TorusGeometry(0.82, 0.025, 12, 56);
    const hubRingMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.75,
      roughness: 0.3,
    });
    const hubRing = new THREE.Mesh(hubRingGeo, hubRingMat);
    hubRing.rotation.x = Math.PI / 2;
    hubGroup.add(hubRing);
    scene.add(hubGroup);
    geometries.push(hubCoreGeo, hubRingGeo);
    materials.push(hubCoreMat, hubRingMat);

    // Orbital ring track
    const orbitTrackGeo = new THREE.TorusGeometry(2.1, 0.012, 8, 84);
    const orbitTrackMat = new THREE.MeshStandardMaterial({
      color: 0x3f3f46,
      metalness: 0.5,
      roughness: 0.6,
    });
    const orbitTrack = new THREE.Mesh(orbitTrackGeo, orbitTrackMat);
    orbitTrack.rotation.x = Math.PI / 2;
    scene.add(orbitTrack);
    geometries.push(orbitTrackGeo);
    materials.push(orbitTrackMat);

    // Orbiting composite tech nodes
    const nodeGroups: THREE.Group[] = [];
    const clickTargets: THREE.Mesh[] = [];

    ORBIT_NODES.forEach((node, idx) => {
      const group = new THREE.Group();
      const baseGeo = new THREE.IcosahedronGeometry(0.32, 0);
      const baseMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        metalness: 0.72,
        roughness: 0.28,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.layers.enable(1);
      baseMesh.userData = { id: node.id, label: node.label };
      group.add(baseMesh);

      const haloGeo = new THREE.TorusGeometry(0.46, 0.016, 10, 32);
      const haloMat = new THREE.MeshStandardMaterial({
        color: 0xf4f4f5,
        metalness: 0.85,
        roughness: 0.25,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI * 0.35;
      group.add(haloMesh);

      group.userData = {
        angle: (idx / ORBIT_NODES.length) * Math.PI * 2,
        id: node.id,
        mesh: baseMesh,
      };
      scene.add(group);
      nodeGroups.push(group);
      clickTargets.push(baseMesh);
      geometries.push(baseGeo, haloGeo);
      materials.push(baseMat, haloMat);
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const mouse = new THREE.Vector2();
    let lastRaycast = 0;

    const updateMouse = (e: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastRaycast < 50) return;
      lastRaycast = now;
      updateMouse(e);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(clickTargets, false);
      if (hits.length > 0) {
        const hit = hits[0].object;
        setHoveredLabel(String(hit.userData.label ?? ''));
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredLabel(null);
        canvas.style.cursor = 'default';
      }
    };

    const onClick = (e: MouseEvent) => {
      updateMouse(e);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(clickTargets, false);
      if (hits.length > 0) {
        const id = String(hits[0].object.userData.id);
        onSelectRef.current(id);
      }
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('click', onClick);

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
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

      hubCore.rotation.y += delta * 0.45;
      hubRing.rotation.z -= delta * 0.35;

      nodeGroups.forEach((group, i) => {
        const angle = group.userData.angle + elapsed * 0.25;
        group.position.set(
          Math.cos(angle) * 2.1,
          Math.sin(elapsed * 1.4 + i) * 0.14,
          Math.sin(angle) * 2.1,
        );
        const isSelected = group.userData.id === selectedRef.current;
        const targetScale = isSelected ? 1.28 : 1.0;
        const currentScale = THREE.MathUtils.damp(
          group.scale.x,
          targetScale,
          8,
          delta,
        );
        group.scale.setScalar(currentScale);
        const mesh = group.userData.mesh as THREE.Mesh;
        mesh.rotation.y += delta * 0.7;
      });

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
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      scene.environment?.dispose();
      renderer.dispose();
    };
  }, [reducedMotion, contextLost]);

  return (
    <div className="relative rounded-xl border border-zinc-800/80 bg-[#0c0c10] overflow-hidden">
      <div className="h-56 sm:h-64 w-full">
        {reducedMotion || contextLost ? (
          <div className="w-full h-full bg-engineering-grid flex items-center justify-center p-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {ORBIT_NODES.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => onSelectTech(node.id)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                    selectedId === node.id
                      ? 'bg-zinc-900 border-emerald-500 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div
            ref={mountRef}
            className="w-full h-full"
            aria-label="Interactive 3D technology orbit"
          />
        )}
      </div>

      {/* Minimal non-occluding bottom selector strip */}
      <div className="border-t border-zinc-800/80 px-3 py-2.5 flex flex-wrap items-center justify-between gap-2 bg-zinc-950/90">
        <span className="text-[11px] font-mono text-zinc-400">
          {hoveredLabel
            ? `Inspect: ${hoveredLabel}`
            : 'Click any 3D orbital node to inspect'}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {ORBIT_NODES.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => onSelectTech(n.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                selectedId === n.id
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
