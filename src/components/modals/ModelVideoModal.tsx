/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Pause, Play, RotateCcw, X, Box as BoxIcon, Volume2, VolumeX } from 'lucide-react';
import { Unit4LessonId, getUnit4Lesson } from '../../game/unit4.ts';
import { sound } from '../../game/audio.ts';
import { speech } from '../../game/speech.ts';
import {
  ATOM_STYLE,
  Q2_MODEL_VIDEOS,
  ModelVideoSpec,
  SoundCue,
  captionAt,
  countAtoms,
  positionAt,
  soundCues,
  speakable,
  valueAt,
  visibility,
} from '../../game/q2Models.ts';

/* Plays a Quarter 2 lesson's time-driven 3D molecule animation like a video (play, pause, scrub, drag to rotate),
   with spoken narration of each caption and sound effects for bonds, flashes and energy flow. */

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const NARRATION_HOLD_MAX_MS = 20000; // never freeze the timeline forever if speech never reports "ended"

function playCue(kind: SoundCue['kind']) {
  if (kind === 'break') sound.playTone(520, 160, 0.18, 'triangle', 0.14);
  else if (kind === 'form') sound.playTone(300, 780, 0.16, 'sine', 0.14);
  else if (kind === 'flash') {
    sound.playTone(160, 55, 0.7, 'sawtooth', 0.06);
    sound.playTone(900, 1900, 0.35, 'sine', 0.05);
  } else if (kind === 'energyIn') sound.playTone(950, 280, 0.8, 'sine', 0.08);
  else sound.playTone(260, 950, 0.8, 'sine', 0.08);
}

const captionIndexAt = (spec: ModelVideoSpec, t: number) => {
  let idx = 0;
  spec.captions.forEach((c, i) => { if (t >= c.t) idx = i; });
  return idx;
};

/** Builds the Three.js scene for a spec and returns a function that poses everything at time t. */
function buildScene(spec: ModelVideoSpec, scene: THREE.Scene) {
  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

  const atomMeshes = spec.atoms.map((a, i) => {
    const st = ATOM_STYLE[a.el];
    const mat = track(new THREE.MeshStandardMaterial({ color: st.color, roughness: 0.35, metalness: 0.1, transparent: true }));
    const mesh = new THREE.Mesh(track(new THREE.SphereGeometry(st.radius, 28, 20)), mat);
    scene.add(mesh);
    return { spec: a, mesh, mat, seed: i * 1.37 };
  });
  const byId = new Map(atomMeshes.map((m) => [m.spec.id, m]));

  const bondGeo = track(new THREE.CylinderGeometry(0.09, 0.09, 1, 12));
  const bondMat = track(new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5, transparent: true }));
  const bonds = spec.bonds.map((b) => {
    const mesh = new THREE.Mesh(bondGeo, bondMat.clone());
    track(mesh.material as THREE.Material);
    scene.add(mesh);
    return { spec: b, mesh };
  });

  const boxes = spec.boxes.map((b) => {
    const geo = track(new THREE.BoxGeometry(...b.size));
    const fill = track(new THREE.MeshBasicMaterial({ color: b.color, transparent: true, opacity: 0.08, depthWrite: false }));
    const lineMat = track(new THREE.LineBasicMaterial({ color: b.color, transparent: true }));
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, fill), new THREE.LineSegments(track(new THREE.EdgesGeometry(geo)), lineMat));
    g.position.set(...b.at);
    scene.add(g);
    return { spec: b, g, fill, lineMat };
  });

  const flashLight = new THREE.PointLight(0xffffff, 0, 30);
  scene.add(flashLight);
  const flashes = spec.flashes.map((f) => {
    const mat = track(new THREE.MeshBasicMaterial({ color: f.color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    const mesh = new THREE.Mesh(track(new THREE.SphereGeometry(1, 32, 16)), mat);
    mesh.position.set(...f.at);
    scene.add(mesh);
    return { spec: f, mesh, mat };
  });

  const dummy = new THREE.Object3D();
  const streams = spec.streams.map((s) => {
    const mat = track(new THREE.MeshBasicMaterial({ color: s.color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    const mesh = new THREE.InstancedMesh(track(new THREE.SphereGeometry(0.09, 8, 6)), mat, s.count);
    // Evenly spread directions on a sphere (Fibonacci lattice).
    const dirs = Array.from({ length: s.count }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / s.count, r = Math.sqrt(1 - y * y), th = i * 2.39996;
      return new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r);
    });
    scene.add(mesh);
    return { spec: s, mesh, mat, dirs };
  });

  const a = new THREE.Vector3(), b = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

  // w = wall-clock seconds: keeps thermal jiggle and energy streams moving while the timeline holds for narration.
  const pose = (t: number, w: number) => {
    for (const m of atomMeshes) {
      const p = positionAt(m.spec.keys, t), j = m.spec.jiggle ?? 0;
      m.mesh.position.set(p[0] + j * Math.sin(w * 9 + m.seed), p[1] + j * Math.sin(w * 7.3 + m.seed * 2), p[2] + j * Math.sin(w * 8.1 + m.seed * 3));
      const v = visibility(m.spec.show, t);
      m.mesh.visible = v > 0;
      m.mesh.scale.setScalar(0.3 + 0.7 * v);
      m.mat.opacity = v;
    }
    for (const bd of bonds) {
      const v = visibility(bd.spec.show, t, 0.4);
      const A = byId.get(bd.spec.a)!, B = byId.get(bd.spec.b)!;
      const vis = Math.min(v, visibility(A.spec.show, t), visibility(B.spec.show, t));
      bd.mesh.visible = vis > 0;
      if (!bd.mesh.visible) continue;
      a.copy(A.mesh.position); b.copy(B.mesh.position);
      const len = a.distanceTo(b);
      bd.mesh.position.copy(a).add(b).multiplyScalar(0.5);
      bd.mesh.quaternion.setFromUnitVectors(up, b.sub(a).normalize());
      bd.mesh.scale.set(vis, len, vis);
      (bd.mesh.material as THREE.MeshStandardMaterial).opacity = vis;
    }
    for (const bx of boxes) {
      const v = visibility([bx.spec.t0, bx.spec.t1], t);
      bx.g.visible = v > 0;
      bx.fill.opacity = 0.08 * v;
      bx.lineMat.opacity = 0.7 * v;
    }
    let light = 0;
    for (const f of flashes) {
      const k = t < f.spec.t0 || t > f.spec.t1 ? 0 : Math.sin((Math.PI * (t - f.spec.t0)) / (f.spec.t1 - f.spec.t0));
      f.mesh.visible = k > 0;
      f.mesh.scale.setScalar(Math.max(0.01, f.spec.size * k));
      f.mat.opacity = 0.16 * k;
      flashLight.color.setHex(f.spec.color);
      light = Math.max(light, k * 40);
    }
    flashLight.intensity = light;
    for (const s of streams) {
      const v = visibility([s.spec.t0, s.spec.t1], t);
      s.mesh.visible = v > 0;
      s.mat.opacity = v;
      if (!s.mesh.visible) continue;
      s.dirs.forEach((d, i) => {
        const phase = (w * 0.7 + (i * 0.618) % 1) % 1;
        const r = s.spec.dir === 'out' ? 0.6 + phase * 5 : 5.6 - phase * 5;
        dummy.position.set(s.spec.at[0] + d.x * r, s.spec.at[1] + d.y * r, s.spec.at[2] + d.z * r);
        dummy.updateMatrix();
        s.mesh.setMatrixAt(i, dummy.matrix);
      });
      s.mesh.instanceMatrix.needsUpdate = true;
    }
  };

  return { pose, dispose: () => disposables.forEach((d) => d.dispose()) };
}

interface ModelVideoModalProps {
  lessonId: Unit4LessonId;
  onClose: () => void;
}

export const ModelVideoModal: React.FC<ModelVideoModalProps> = ({ lessonId, onClose }) => {
  const spec = Q2_MODEL_VIDEOS[lessonId];
  const lesson = getUnit4Lesson(lessonId);
  const mountRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timeRef = useRef(0);
  const playingRef = useRef(true);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [glError, setGlError] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(() => !sound.getMuted());
  const soundRef = useRef(soundOn);
  const narratedIdxRef = useRef(-1); // caption already narrated; -1 = narrate the current one next frame
  const narratingRef = useRef(false);

  const setPlay = (p: boolean) => {
    if (p && timeRef.current >= spec.duration) {
      timeRef.current = 0;
      narratedIdxRef.current = -1;
    }
    playingRef.current = p;
    setPlaying(p);
    if (p) speech.resume();
    else speech.pause();
  };

  /** Jump the timeline; narration restarts from the caption at the new time. */
  const seek = (t: number) => {
    speech.stop();
    narratingRef.current = false;
    narratedIdxRef.current = -1;
    timeRef.current = t;
    setTime(t);
  };

  const toggleSound = () => {
    const on = !soundRef.current;
    soundRef.current = on;
    setSoundOn(on);
    speech.stop();
    narratingRef.current = false;
    narratedIdxRef.current = -1;
  };

  useEffect(() => {
    // Only a finished narration reaches 100%; an interrupted previous one doesn't, so it can't end the hold early.
    const unsubscribe = speech.subscribe((s) => {
      if (s.progressPercent >= 100) narratingRef.current = false;
    });
    return () => {
      unsubscribe();
      speech.stop();
    };
  }, []);

  useEffect(() => {
    const mount = mountRef.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch (e) {
      setGlError('3D is not supported on this device/browser (WebGL unavailable).');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 8);
    scene.add(key);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.6, 11.5);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 20;

    const built = buildScene(spec, scene);

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / Math.max(h, 1);
      // Pull back on narrow (portrait) screens so the whole model fits.
      camera.position.setLength(camera.aspect < 1 ? 16 : 11.6);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    const cues = soundCues(spec);
    let last = performance.now(), raf = 0, holdStart = 0;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (playingRef.current) {
        const prev = timeRef.current;
        let next = Math.min(spec.duration, prev + dt);
        if (soundRef.current) {
          const idx = captionIndexAt(spec, prev);
          if (idx !== narratedIdxRef.current) {
            narratedIdxRef.current = idx;
            const c = spec.captions[idx];
            speech.speak(speakable(`${c.title}. ${c.text}`), 1.05);
            narratingRef.current = true;
            holdStart = now;
          }
          // Wait at the next caption (or the end) until the narration has finished.
          const boundary = spec.captions[idx + 1]?.t ?? spec.duration;
          if (narratingRef.current && next >= boundary && now - holdStart < NARRATION_HOLD_MAX_MS) {
            next = Math.max(prev, boundary - 0.001);
          }
          for (const c of cues) if (c.t > prev && c.t <= next) playCue(c.kind);
        }
        timeRef.current = next;
        if (next >= spec.duration) {
          playingRef.current = false;
          setPlaying(false);
        }
        setTime(next);
      }
      built.pose(timeRef.current, now / 1000);
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      built.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [spec]);

  useEffect(() => {
    closeRef.current?.focus();
    // Capture phase so these keys don't also reach the app's own shortcuts (pause menu etc.).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      } else if (e.key === ' ' && !(e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        e.stopPropagation();
        setPlay(!playingRef.current);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const caption = captionAt(spec, time);
  const counts = countAtoms(spec, time);
  const temp = spec.temperature ? valueAt(spec.temperature, time) : null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-slate-950/90 backdrop-blur-sm overflow-y-auto p-2 sm:p-6 flex items-start sm:items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${lesson.title} 3D model video`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-700">
          <div className="min-w-0">
            <p className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
              <BoxIcon className="w-4 h-4 shrink-0" /> Quarter 2 · Lesson {lesson.id} · 3D Model Video
            </p>
            <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">{spec.title}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Close 3D model video"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="relative h-[52vh] sm:h-[58vh] min-h-[300px] bg-[#0b1220]">
          <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" aria-hidden="true" />
          {glError && <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-rose-200 font-bold">{glError}</p>}

          {spec.showCounts && (
            <div className="absolute top-3 left-3 px-3 py-2 rounded-xl bg-slate-950/85 border border-slate-700 text-sm font-mono font-bold text-white pointer-events-none">
              <div className="text-xs text-slate-400 font-sans mb-0.5">Atom counter</div>
              <span className="text-slate-300">C {counts.C}</span> · <span className="text-slate-100">H {counts.H}</span> ·{' '}
              <span className="text-red-400">O {counts.O}</span>
            </div>
          )}

          {temp !== null && (
            <div className="absolute top-3 right-3 bottom-24 w-9 flex flex-col items-center gap-1 pointer-events-none" aria-label={`Temperature ${Math.round(temp * 100)}%`}>
              <span className="text-xs font-bold text-slate-300">Temp</span>
              <div className="relative flex-1 w-3 rounded-full bg-slate-800 border border-slate-600 overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-full"
                  style={{ height: `${temp * 100}%`, background: `linear-gradient(to top, #38bdf8, ${temp > 0.6 ? '#f97316' : '#a5b4fc'})` }}
                />
              </div>
              <span className="w-5 h-5 rounded-full border border-slate-600" style={{ background: temp > 0.6 ? '#f97316' : '#38bdf8' }} />
            </div>
          )}

          <div className="absolute left-3 right-14 bottom-3 px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-700 pointer-events-none" aria-live="polite">
            <p className="text-base sm:text-lg font-extrabold text-amber-300 leading-snug">{caption.title}</p>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed">{caption.text}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-700">
          <button
            type="button"
            onClick={() => setPlay(!playing)}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center cursor-pointer shrink-0"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
          <button
            type="button"
            onClick={() => {
              seek(0);
              setPlay(true);
            }}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Replay from start"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <input
            type="range"
            min={0}
            max={spec.duration}
            step={0.05}
            value={time}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1 min-w-0 accent-cyan-400 cursor-pointer"
            aria-label="Seek"
          />
          <span className="text-sm font-mono font-bold tabular-nums text-slate-200 shrink-0">
            {fmt(time)} / {fmt(spec.duration)}
          </span>
          <button
            type="button"
            onClick={toggleSound}
            className={`min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center cursor-pointer shrink-0 ${
              soundOn
                ? 'bg-emerald-950/75 hover:bg-emerald-900/80 border-emerald-400/50 text-emerald-200'
                : 'bg-rose-950/85 hover:bg-rose-900 border-rose-400/60 text-rose-200'
            }`}
            aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
            aria-pressed={soundOn}
            title={soundOn ? 'Sound ON (narration + effects)' : 'Sound OFF'}
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
        <p className="px-4 pb-3 text-xs text-slate-400">
          Drag to rotate · scroll to zoom · Space = play/pause · with sound on, the video waits for the narrator at each step
        </p>
      </div>
    </div>
  );
};
