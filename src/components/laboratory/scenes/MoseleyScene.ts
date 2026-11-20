/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export interface MoseleyTarget {
  name: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: number;
  xrayFreq10_18Hz: number;
  color: number;
}

export const MOSELEY_TARGETS: MoseleyTarget[] = [
  { name: 'Iron', symbol: 'Fe', atomicNumber: 26, atomicMass: 55.85, xrayFreq10_18Hz: 1.55, color: 0x94a3b8 },
  { name: 'Cobalt', symbol: 'Co', atomicNumber: 27, atomicMass: 58.93, xrayFreq10_18Hz: 1.68, color: 0x64748b },
  { name: 'Nickel', symbol: 'Ni', atomicNumber: 28, atomicMass: 58.69, xrayFreq10_18Hz: 1.82, color: 0xcbd5e1 },
  { name: 'Copper', symbol: 'Cu', atomicNumber: 29, atomicMass: 63.55, xrayFreq10_18Hz: 1.95, color: 0xd97706 },
];

export class MoseleyScene {
  public group: THREE.Group;
  private electronBeam: THREE.Mesh;
  private targetMesh: THREE.Mesh;
  private xrayWaveLine: THREE.Line;
  private currentTargetIdx = 1; // Cobalt default (showcases the Co/Ni dilemma!)
  private wavePoints = 120;
  private wavePositions: Float32Array;

  constructor() {
    this.group = new THREE.Group();

    // 1. Cathode Ray Tube Emitter (left)
    const cathodeGroup = new THREE.Group();
    cathodeGroup.position.set(-2.4, 0, 0);

    const emitterBaseGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.8, 16);
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const emitterBase = new THREE.Mesh(emitterBaseGeo, darkMetal);
    emitterBase.rotation.z = Math.PI / 2;
    cathodeGroup.add(emitterBase);

    const nozzleGeo = new THREE.ConeGeometry(0.3, 0.6, 16);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.2 });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.rotation.z = -Math.PI / 2;
    nozzle.position.x = 0.5;
    cathodeGroup.add(nozzle);

    this.group.add(cathodeGroup);

    // 2. High-Energy Electron Beam (Glowing Cyan/Violet Cylinder)
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.3, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });
    this.electronBeam = new THREE.Mesh(beamGeo, beamMat);
    this.electronBeam.rotation.z = Math.PI / 2;
    this.electronBeam.position.set(-0.8, 0, 0);
    this.group.add(this.electronBeam);

    // 3. Target Anode Plate (Center, tilted 45 degrees to deflect X-rays)
    const targetGeo = new THREE.BoxGeometry(0.2, 1.2, 1.2);
    const targetMat = new THREE.MeshStandardMaterial({
      color: MOSELEY_TARGETS[this.currentTargetIdx].color,
      metalness: 0.9,
      roughness: 0.2,
    });
    this.targetMesh = new THREE.Mesh(targetGeo, targetMat);
    this.targetMesh.rotation.y = Math.PI / 4;
    this.targetMesh.position.set(0.6, 0, 0);
    this.group.add(this.targetMesh);

    // 4. X-Ray Spectrometer Detector (Top-Right)
    const detectorGeo = new THREE.CylinderGeometry(0.6, 0.7, 0.8, 16);
    const detector = new THREE.Mesh(detectorGeo, darkMetal);
    detector.position.set(2.2, 1.8, 0);
    detector.rotation.z = -Math.PI / 4;
    this.group.add(detector);

    // 5. Emitted Sinusoidal X-Ray Wave Line
    const waveGeo = new THREE.BufferGeometry();
    this.wavePositions = new Float32Array(this.wavePoints * 3);
    waveGeo.setAttribute('position', new THREE.BufferAttribute(this.wavePositions, 3));

    const waveMat = new THREE.LineBasicMaterial({
      color: 0xa855f7, // High-energy purple/UV
      linewidth: 2,
    });
    this.xrayWaveLine = new THREE.Line(waveGeo, waveMat);
    this.group.add(this.xrayWaveLine);
  }

  public setTargetIndex(idx: number) {
    this.currentTargetIdx = Math.max(0, Math.min(MOSELEY_TARGETS.length - 1, idx));
    const target = MOSELEY_TARGETS[this.currentTargetIdx];
    (this.targetMesh.material as THREE.MeshStandardMaterial).color.setHex(target.color);
  }

  public getTarget(): MoseleyTarget {
    return MOSELEY_TARGETS[this.currentTargetIdx];
  }

  public update(time: number, dt: number) {
    // Pulse electron beam opacity
    (this.electronBeam.material as THREE.MeshBasicMaterial).opacity = 0.75 + Math.sin(time * 30) * 0.2;

    // Propagate emitted X-ray wave from target (0.6, 0, 0) to detector (2.2, 1.8, 0)
    const target = this.getTarget();
    const freq = target.xrayFreq10_18Hz * 4.0; // wave frequency scales with atomic number!

    const startX = 0.6;
    const startY = 0;
    const endX = 2.2;
    const endY = 1.8;

    for (let i = 0; i < this.wavePoints; i++) {
      const t = i / (this.wavePoints - 1);
      const bx = startX + (endX - startX) * t;
      const by = startY + (endY - startY) * t;

      // Perpendicular wave displacement
      const waveOffset = Math.sin(t * freq * 10 - time * 20) * 0.18;
      const perpX = -0.707 * waveOffset;
      const perpY = 0.707 * waveOffset;

      this.wavePositions[i * 3] = bx + perpX;
      this.wavePositions[i * 3 + 1] = by + perpY;
      this.wavePositions[i * 3 + 2] = 0;
    }
    this.xrayWaveLine.geometry.attributes.position.needsUpdate = true;
  }
}
