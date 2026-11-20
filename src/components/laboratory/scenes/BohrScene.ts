/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export interface BohrElement {
  name: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: number;
  protons: number;
  neutrons: number;
  shells: number[]; // electrons per shell [n=1, n=2, n=3, n=4]
}

export const BOHR_ELEMENTS: BohrElement[] = [
  { name: 'Hydrogen', symbol: 'H', atomicNumber: 1, atomicMass: 1.008, protons: 1, neutrons: 0, shells: [1] },
  { name: 'Carbon', symbol: 'C', atomicNumber: 6, atomicMass: 12.01, protons: 6, neutrons: 6, shells: [2, 4] },
  { name: 'Oxygen', symbol: 'O', atomicNumber: 8, atomicMass: 16.00, protons: 8, neutrons: 8, shells: [2, 6] },
  { name: 'Copper', symbol: 'Cu', atomicNumber: 29, atomicMass: 63.55, protons: 29, neutrons: 35, shells: [2, 8, 18, 1] },
];

export class BohrScene {
  public group: THREE.Group;
  private nucleusGroup: THREE.Group;
  private electronsGroup: THREE.Group;
  private shellRingsGroup: THREE.Group;
  private currentElementIdx = 1; // Carbon default
  private electronMeshes: { mesh: THREE.Mesh; shellRadius: number; speed: number; angle: number; tilt: number }[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.nucleusGroup = new THREE.Group();
    this.electronsGroup = new THREE.Group();
    this.shellRingsGroup = new THREE.Group();

    this.group.add(this.nucleusGroup);
    this.group.add(this.shellRingsGroup);
    this.group.add(this.electronsGroup);

    this.rebuildElement(1);
  }

  public setElementIndex(idx: number) {
    this.currentElementIdx = Math.max(0, Math.min(BOHR_ELEMENTS.length - 1, idx));
    this.rebuildElement(this.currentElementIdx);
  }

  public getElement(): BohrElement {
    return BOHR_ELEMENTS[this.currentElementIdx];
  }

  private rebuildElement(idx: number) {
    const el = BOHR_ELEMENTS[idx];

    // Clear previous children
    while (this.nucleusGroup.children.length > 0) {
      this.nucleusGroup.remove(this.nucleusGroup.children[0]);
    }
    while (this.shellRingsGroup.children.length > 0) {
      this.shellRingsGroup.remove(this.shellRingsGroup.children[0]);
    }
    while (this.electronsGroup.children.length > 0) {
      this.electronsGroup.remove(this.electronsGroup.children[0]);
    }
    this.electronMeshes = [];

    // 1. Build Multi-Particle Nucleus (Protons = Red, Neutrons = Steel Gray)
    const protonGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const protonMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red proton
      roughness: 0.3,
      metalness: 0.3,
    });
    const neutronGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const neutronMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Slate neutron
      roughness: 0.4,
      metalness: 0.4,
    });

    const totalNucleons = Math.min(30, el.protons + el.neutrons);
    for (let i = 0; i < totalNucleons; i++) {
      const isProton = i < el.protons;
      const mesh = new THREE.Mesh(isProton ? protonGeo : neutronGeo, isProton ? protonMat : neutronMat);

      // Fibonacci sphere packing for dense nucleus
      const phi = Math.acos(-1 + (2 * i) / totalNucleons);
      const theta = Math.sqrt(totalNucleons * Math.PI) * phi;
      const r = 0.22 + (totalNucleons > 12 ? 0.25 : 0.05);

      mesh.position.set(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
      this.nucleusGroup.add(mesh);
    }

    // 2. Build Orbiting Electron Shells
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });

    const electronGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const electronMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan electron
      emissive: 0x0891b2,
      emissiveIntensity: 0.6,
      roughness: 0.1,
    });

    el.shells.forEach((count, sIdx) => {
      const radius = 1.1 + sIdx * 0.9;

      // Shell track ring
      const ringGeo = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (sIdx * 0.3); // slight inclination
      this.shellRingsGroup.add(ring);

      // Place electrons in shell
      for (let e = 0; e < count; e++) {
        const electronMesh = new THREE.Mesh(electronGeo, electronMat);
        const startAngle = (e * Math.PI * 2) / count;
        this.electronsGroup.add(electronMesh);
        this.electronMeshes.push({
          mesh: electronMesh,
          shellRadius: radius,
          speed: 2.2 - sIdx * 0.4,
          angle: startAngle,
          tilt: sIdx * 0.3,
        });
      }
    });
  }

  public update(time: number, dt: number) {
    // Rotate the nucleus gently
    this.nucleusGroup.rotation.y = time * 0.4;
    this.nucleusGroup.rotation.x = time * 0.2;

    // Orbit electrons along tilted shells
    this.electronMeshes.forEach((el) => {
      el.angle += el.speed * dt;
      const x = Math.cos(el.angle) * el.shellRadius;
      const z = Math.sin(el.angle) * el.shellRadius;

      // Apply tilt rotation
      const tiltedY = z * Math.sin(el.tilt);
      const tiltedZ = z * Math.cos(el.tilt);

      el.mesh.position.set(x, tiltedY, tiltedZ);
    });
  }
}
