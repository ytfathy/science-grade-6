/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SimMode } from '../../game/types.ts';
import { ChamberScene } from './scenes/ChamberScene.ts';
import { DisplacementScene } from './scenes/DisplacementScene.ts';
import { DiffusionScene } from './scenes/DiffusionScene.ts';
import { ThermalScene } from './scenes/ThermalScene.ts';
import { GalliumScene } from './scenes/GalliumScene.ts';
import { ElevationScene } from './scenes/ElevationScene.ts';
import { BohrScene } from './scenes/BohrScene.ts';
import { MoseleyScene } from './scenes/MoseleyScene.ts';
import { MetalsScene } from './scenes/MetalsScene.ts';
import { MoleculesScene } from './scenes/MoleculesScene.ts';
import { AllotropesScene } from './scenes/AllotropesScene.ts';
import { SaltScene } from './scenes/SaltScene.ts';

export interface LabCanvasProps {
  mode: SimMode;
  onSceneReady?: () => void;
  // Specific interactive props
  chamberState?: 'solid' | 'liquid' | 'gas';
  displacementSubmerged?: boolean;
  thermalTemp?: number;
  galliumTemp?: number;
  elevationIdx?: number;
  bohrElementIdx?: number;
  moseleyTargetIdx?: number;
  metalsType?: 'copper' | 'silver';
  metalHammerTrigger?: number;
  metalCircuitTrigger?: number;
  moleculeType?: 'h2o' | 'co2' | 'ch4' | 'o3';
  allotropesMode?: 'diamond' | 'graphite' | 'both';
  allotropesSlideTrigger?: number;
  saltCoordTrigger?: number;
}

export const LabCanvas: React.FC<LabCanvasProps> = ({
  mode,
  chamberState = 'solid',
  displacementSubmerged = false,
  thermalTemp = 25,
  galliumTemp = 20,
  elevationIdx = 0,
  bohrElementIdx = 1,
  moseleyTargetIdx = 1,
  metalsType = 'copper',
  metalHammerTrigger,
  metalCircuitTrigger,
  moleculeType = 'h2o',
  allotropesMode = 'both',
  allotropesSlideTrigger,
  saltCoordTrigger,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<{
    chamber: ChamberScene;
    displacement: DisplacementScene;
    diffusion: DiffusionScene;
    thermal: ThermalScene;
    gallium: GalliumScene;
    elevation: ElevationScene;
    bohr: BohrScene;
    moseley: MoseleyScene;
    metals: MetalsScene;
    molecules: MoleculesScene;
    allotropes: AllotropesScene;
    salt: SaltScene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
  } | null>(null);

  const modeRef = useRef(mode);
  modeRef.current = mode;

  // Track props in refs for lossless 60fps loop
  const propsRef = useRef({
    chamberState,
    displacementSubmerged,
    thermalTemp,
    galliumTemp,
    elevationIdx,
    bohrElementIdx,
    moseleyTargetIdx,
    metalsType,
    moleculeType,
    allotropesMode,
  });
  propsRef.current = {
    chamberState,
    displacementSubmerged,
    thermalTemp,
    galliumTemp,
    elevationIdx,
    bohrElementIdx,
    moseleyTargetIdx,
    metalsType,
    moleculeType,
    allotropesMode,
  };

  // Mount Three.js once
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
      preserveDrawingBuffer: isSoftwareGl,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16); // Deep space laboratory dark navy
    scene.fog = new THREE.FogExp2(0x090d16, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 6.2);
    camera.lookAt(0, 0, 0);

    // 4. Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig: Warm key light vs Cool fill
    const keyLight = new THREE.DirectionalLight(0xffedd5, 1.8); // Warm key
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.camera.left = -4;
      keyLight.shadow.camera.right = 4;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 1.0); // Cool sky / dark ground fill
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    // 6. Ground contact shadow plane
    const shadowGeo = new THREE.CircleGeometry(3.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.25;
    scene.add(shadowPlane);

    // 7. Instantiate all 12 Curriculum 3D Scenes
    const chamber = new ChamberScene();
    const displacement = new DisplacementScene();
    const diffusion = new DiffusionScene();
    const thermal = new ThermalScene();
    const gallium = new GalliumScene();
    const elevation = new ElevationScene();
    const bohr = new BohrScene();
    const moseley = new MoseleyScene();
    const metals = new MetalsScene();
    const molecules = new MoleculesScene();
    const allotropes = new AllotropesScene();
    const salt = new SaltScene();

    scene.add(chamber.group);
    scene.add(displacement.group);
    scene.add(diffusion.group);
    scene.add(thermal.group);
    scene.add(gallium.group);
    scene.add(elevation.group);
    scene.add(bohr.group);
    scene.add(moseley.group);
    scene.add(metals.group);
    scene.add(molecules.group);
    scene.add(allotropes.group);
    scene.add(salt.group);

    // Software WebGL optimization: skip multi-pass transmission shader while keeping glass opacity
    if (isSoftwareGl) {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mat = (obj as THREE.Mesh).material;
          const mats = Array.isArray(mat) ? mat : [mat];
          for (const m of mats) {
            if (m && 'transmission' in m && typeof (m as THREE.MeshPhysicalMaterial).transmission === 'number' && (m as THREE.MeshPhysicalMaterial).transmission > 0) {
              const phys = m as THREE.MeshPhysicalMaterial;
              phys.transmission = 0;
              phys.transparent = true;
              phys.opacity = Math.max(0.25, Math.min(phys.opacity || 0.35, 0.38));
              phys.needsUpdate = true;
            }
          }
        }
      });
    }

    sceneManagerRef.current = {
      chamber,
      displacement,
      diffusion,
      thermal,
      gallium,
      elevation,
      bohr,
      moseley,
      metals,
      molecules,
      allotropes,
      salt,
      camera,
      renderer,
    };

    // 8. Interactive Mouse Orbit / Drag
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotY = 0;
    let rotX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevMouseX;
      const dy = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      rotY += dx * 0.008;
      rotX = Math.max(-0.6, Math.min(0.6, rotX + dy * 0.008));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    domEl.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domEl.addEventListener('touchstart', handlePointerDown, { passive: true });
    domEl.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 10. 60 FPS Render Loop with software WebGL afterDraw guard
    let frameId = 0;
    let isDisposed = false;
    let lastTime = performance.now();
    let clockTime = 0;

    const afterDraw = (cb: () => void) => {
      if (isDisposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (isDisposed) return;
      const now = performance.now();
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);
      clockTime += dt;

      // Update visible scenes based on current mode
      const activeMode = modeRef.current;

      chamber.group.visible = activeMode === 'chamber';
      displacement.group.visible = activeMode === 'displacement';
      diffusion.group.visible = activeMode === 'diffusion';
      thermal.group.visible = activeMode === 'thermal';
      gallium.group.visible = activeMode === 'gallium';
      elevation.group.visible = activeMode === 'elevation';
      bohr.group.visible = activeMode === 'bohr';
      moseley.group.visible = activeMode === 'moseley';
      metals.group.visible = activeMode === 'metals';
      molecules.group.visible = activeMode === 'molecules';
      allotropes.group.visible = activeMode === 'allotropes';
      salt.group.visible = activeMode === 'salt';

      // Update active scene simulation
      switch (activeMode) {
        case 'chamber':
          chamber.update(clockTime, dt);
          break;
        case 'displacement':
          displacement.update(clockTime, dt);
          break;
        case 'diffusion':
          diffusion.update(clockTime, dt);
          break;
        case 'thermal':
          thermal.update(clockTime, dt);
          break;
        case 'gallium':
          gallium.update(clockTime, dt);
          break;
        case 'elevation':
          elevation.update(clockTime, dt);
          break;
        case 'bohr':
          bohr.update(clockTime, dt);
          break;
        case 'moseley':
          moseley.update(clockTime, dt);
          break;
        case 'metals':
          metals.update(clockTime, dt);
          break;
        case 'molecules':
          molecules.update(clockTime, dt);
          break;
        case 'allotropes':
          allotropes.update(clockTime, dt);
          break;
        case 'salt':
          salt.update(clockTime, dt);
          break;
      }

      // Smooth camera orbit framed per-scene so models stay centered and clear of bottom controls
      const camFraming: Record<SimMode, { radius: number; lookAtY: number; camElev: number }> = {
        chamber: { radius: 9.6, lookAtY: -0.1, camElev: 0.7 },
        displacement: { radius: 8.8, lookAtY: 0.15, camElev: 0.6 },
        diffusion: { radius: 7.0, lookAtY: -0.7, camElev: 0.5 },
        thermal: { radius: 7.6, lookAtY: -0.2, camElev: 0.5 },
        gallium: { radius: 6.4, lookAtY: -0.7, camElev: 0.5 },
        elevation: { radius: 9.0, lookAtY: -0.8, camElev: 0.5 },
        bohr: { radius: 6.8, lookAtY: 0.0, camElev: 0.5 },
        moseley: { radius: 6.8, lookAtY: 0.4, camElev: 0.4 },
        metals: { radius: 8.2, lookAtY: -0.1, camElev: 0.5 },
        molecules: { radius: 5.8, lookAtY: -0.1, camElev: 0.4 },
        allotropes: { radius: 6.8, lookAtY: 0.0, camElev: 0.5 },
        salt: { radius: 6.0, lookAtY: 0.0, camElev: 0.5 },
      };
      const framing = camFraming[activeMode] || { radius: 6.5, lookAtY: 0, camElev: 0.6 };
      const camX = Math.sin(rotY) * framing.radius * Math.cos(rotX);
      const camY = framing.lookAtY + framing.camElev + Math.sin(rotX) * framing.radius;
      const camZ = Math.cos(rotY) * framing.radius * Math.cos(rotX);
      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, framing.lookAtY, 0);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('mousedown', handlePointerDown);
      domEl.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('touchstart', handlePointerDown);
      domEl.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      renderer.dispose();
      if (domEl.parentNode) {
        domEl.parentNode.removeChild(domEl);
      }
    };
  }, []);

  // Sync props to active scenes
  useEffect(() => {
    const mgr = sceneManagerRef.current;
    if (!mgr) return;

    mgr.chamber.setMode(chamberState);
    mgr.displacement.setSubmerged(displacementSubmerged);
    mgr.thermal.setTemperature(thermalTemp);
    mgr.gallium.setTemperature(galliumTemp);
    mgr.elevation.setElevationIndex(elevationIdx);
    mgr.bohr.setElementIndex(bohrElementIdx);
    mgr.moseley.setTargetIndex(moseleyTargetIdx);
    mgr.metals.setMetalType(metalsType);
    mgr.molecules.setMoleculeType(moleculeType);
    mgr.allotropes.setViewMode(allotropesMode);
  }, [
    chamberState,
    displacementSubmerged,
    thermalTemp,
    galliumTemp,
    elevationIdx,
    bohrElementIdx,
    moseleyTargetIdx,
    metalsType,
    moleculeType,
    allotropesMode,
  ]);

  // Handle transient trigger actions
  useEffect(() => {
    if (metalHammerTrigger !== undefined && sceneManagerRef.current) {
      sceneManagerRef.current.metals.strikeHammer();
    }
  }, [metalHammerTrigger]);

  useEffect(() => {
    if (metalCircuitTrigger !== undefined && sceneManagerRef.current) {
      sceneManagerRef.current.metals.toggleCircuit();
    }
  }, [metalCircuitTrigger]);

  useEffect(() => {
    if (allotropesSlideTrigger !== undefined && sceneManagerRef.current) {
      sceneManagerRef.current.allotropes.slideGraphiteLayer();
    }
  }, [allotropesSlideTrigger]);

  useEffect(() => {
    if (saltCoordTrigger !== undefined && sceneManagerRef.current) {
      sceneManagerRef.current.salt.toggleCoordination();
    }
  }, [saltCoordTrigger]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full overflow-hidden select-none" />;
};
