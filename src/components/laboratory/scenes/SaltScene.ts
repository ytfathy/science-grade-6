/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export class SaltScene {
  public group: THREE.Group;
  private crystalGroup: THREE.Group;
  private isHighlightCoordination = false;
  private bondsGroup: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.crystalGroup = new THREE.Group();
    this.bondsGroup = new THREE.Group();

    this.group.add(this.crystalGroup);
    this.group.add(this.bondsGroup);

    this.buildLattice();
  }

  private buildLattice() {
    // 3x3x3 Alternating Na+ (Purple) and Cl- (Green)
    const naMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, // Violet sodium ion (Na+)
      roughness: 0.2,
      metalness: 0.3,
    });
    const clMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e, // Bright green chloride ion (Cl-)
      roughness: 0.2,
      metalness: 0.3,
    });
    const bondMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.4,
      metalness: 0.5,
    });

    const naGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const clGeo = new THREE.SphereGeometry(0.24, 16, 16); // Cl- has larger ionic radius!

    const step = 0.85;
    const atoms: { pos: THREE.Vector3; isNa: boolean; mesh: THREE.Mesh }[] = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const isNa = (x + y + z) % 2 === 0;
          const pos = new THREE.Vector3(x * step, y * step, z * step);
          const mesh = new THREE.Mesh(isNa ? naGeo : clGeo, isNa ? naMat : clMat);
          mesh.position.copy(pos);
          this.crystalGroup.add(mesh);
          atoms.push({ pos, isNa, mesh });
        }
      }
    }

    // Grid Bonds between adjacent opposite ions
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const d = atoms[i].pos.distanceTo(atoms[j].pos);
        if (Math.abs(d - step) < 0.05 && atoms[i].isNa !== atoms[j].isNa) {
          const dir = new THREE.Vector3().subVectors(atoms[j].pos, atoms[i].pos);
          const bondGeo = new THREE.CylinderGeometry(0.035, 0.035, d, 8);
          const bond = new THREE.Mesh(bondGeo, bondMat);
          bond.position.copy(atoms[i].pos).addScaledVector(dir, 0.5);
          bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
          this.bondsGroup.add(bond);
        }
      }
    }
  }

  public toggleCoordination(): boolean {
    this.isHighlightCoordination = !this.isHighlightCoordination;
    return this.isHighlightCoordination;
  }

  public update(time: number, dt: number) {
    this.group.rotation.y = time * 0.4;
    this.group.rotation.x = Math.sin(time * 0.25) * 0.15;
  }
}
