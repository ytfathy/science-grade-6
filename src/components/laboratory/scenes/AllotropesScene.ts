/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export class AllotropesScene {
  public group: THREE.Group;
  private diamondGroup: THREE.Group;
  private graphiteGroup: THREE.Group;
  private graphiteTopLayer: THREE.Group;
  private viewMode: 'diamond' | 'graphite' | 'both' = 'both';
  private graphiteSlideOffset = 0;
  private isSliding = false;

  constructor() {
    this.group = new THREE.Group();
    this.diamondGroup = new THREE.Group();
    this.graphiteGroup = new THREE.Group();
    this.graphiteTopLayer = new THREE.Group();

    this.diamondGroup.position.set(-1.8, 0, 0);
    this.graphiteGroup.position.set(1.8, 0, 0);

    this.group.add(this.diamondGroup);
    this.group.add(this.graphiteGroup);

    this.buildDiamond();
    this.buildGraphite();
  }

  private buildDiamond() {
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Sparkling icy diamond cyan
      roughness: 0.1,
      metalness: 0.2,
    });
    const bondMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.2,
      metalness: 0.5,
    });
    const atomGeo = new THREE.SphereGeometry(0.18, 16, 16);

    const atoms: THREE.Vector3[] = [];
    const step = 0.8;

    // Build 3D tetrahedral interlocking cage
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if ((x + y + z) % 2 === 0) {
            atoms.push(new THREE.Vector3(x * step, y * step, z * step));
          }
        }
      }
    }

    // Add interstitial tetrahedral center atoms
    const quarter = step * 0.5;
    [-quarter, quarter].forEach((qx) => {
      [-quarter, quarter].forEach((qy) => {
        [-quarter, quarter].forEach((qz) => {
          atoms.push(new THREE.Vector3(qx, qy, qz));
        });
      });
    });

    atoms.forEach((pos) => {
      const mesh = new THREE.Mesh(atomGeo, carbonMat);
      mesh.position.copy(pos);
      this.diamondGroup.add(mesh);
    });

    // Tetrahedral bonds
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const d = atoms[i].distanceTo(atoms[j]);
        if (d > 0.6 && d < 0.95) {
          const dir = new THREE.Vector3().subVectors(atoms[j], atoms[i]);
          const bondGeo = new THREE.CylinderGeometry(0.04, 0.04, d, 8);
          const bond = new THREE.Mesh(bondGeo, bondMat);
          bond.position.copy(atoms[i]).addScaledVector(dir, 0.5);
          bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
          this.diamondGroup.add(bond);
        }
      }
    }
  }

  private buildGraphite() {
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Dark slate graphite
      roughness: 0.5,
      metalness: 0.3,
    });
    const intralayerBondMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.4,
    });
    const vdwBondMat = new THREE.LineDashedMaterial({
      color: 0x94a3b8,
      dashSize: 0.05,
      gapSize: 0.05,
    });

    const atomGeo = new THREE.SphereGeometry(0.14, 16, 16);

    // Build 3 stacked 2D hexagonal sheets
    const layerY = [-0.9, 0.0, 0.9];
    const r = 0.5;

    layerY.forEach((ly, layerIdx) => {
      const layerParent = layerIdx === 2 ? this.graphiteTopLayer : this.graphiteGroup;
      const layerAtoms: THREE.Vector3[] = [];

      // Hexagonal rings
      for (let ring = 0; ring < 7; ring++) {
        const center = ring === 0 ? new THREE.Vector3(0, ly, 0) :
          new THREE.Vector3(
            Math.cos(((ring - 1) * Math.PI) / 3) * (r * 1.732),
            ly,
            Math.sin(((ring - 1) * Math.PI) / 3) * (r * 1.732)
          );

        for (let v = 0; v < 6; v++) {
          const angle = (v * Math.PI) / 3;
          const pos = new THREE.Vector3(
            center.x + Math.cos(angle) * r,
            ly,
            center.z + Math.sin(angle) * r
          );
          // Only add if unique
          if (!layerAtoms.some((existing) => existing.distanceTo(pos) < 0.1)) {
            layerAtoms.push(pos);
            const mesh = new THREE.Mesh(atomGeo, carbonMat);
            mesh.position.copy(pos);
            layerParent.add(mesh);
          }
        }
      }

      // Strong intralayer covalent bonds
      for (let i = 0; i < layerAtoms.length; i++) {
        for (let j = i + 1; j < layerAtoms.length; j++) {
          const dist = layerAtoms[i].distanceTo(layerAtoms[j]);
          if (dist > 0.45 && dist < 0.55) {
            const dir = new THREE.Vector3().subVectors(layerAtoms[j], layerAtoms[i]);
            const bondGeo = new THREE.CylinderGeometry(0.03, 0.03, dist, 8);
            const bond = new THREE.Mesh(bondGeo, intralayerBondMat);
            bond.position.copy(layerAtoms[i]).addScaledVector(dir, 0.5);
            bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
            layerParent.add(bond);
          }
        }
      }
    });

    this.graphiteGroup.add(this.graphiteTopLayer);
  }

  public setViewMode(mode: 'diamond' | 'graphite' | 'both') {
    this.viewMode = mode;
    if (mode === 'diamond') {
      this.diamondGroup.position.set(0, 0, 0);
      this.diamondGroup.visible = true;
      this.graphiteGroup.visible = false;
    } else if (mode === 'graphite') {
      this.graphiteGroup.position.set(0, 0, 0);
      this.diamondGroup.visible = false;
      this.graphiteGroup.visible = true;
    } else {
      this.diamondGroup.position.set(-1.8, 0, 0);
      this.graphiteGroup.position.set(1.8, 0, 0);
      this.diamondGroup.visible = true;
      this.graphiteGroup.visible = true;
    }
  }

  public slideGraphiteLayer() {
    this.isSliding = !this.isSliding;
  }

  public update(time: number, dt: number) {
    this.diamondGroup.rotation.y = time * 0.3;
    this.graphiteGroup.rotation.y = time * 0.3;

    // Slide top layer of graphite (pencil lead exfoliation demonstration)
    const targetOffset = this.isSliding ? 0.9 : 0.0;
    this.graphiteSlideOffset += (targetOffset - this.graphiteSlideOffset) * Math.min(dt * 3, 1);
    this.graphiteTopLayer.position.x = this.graphiteSlideOffset;
  }
}
