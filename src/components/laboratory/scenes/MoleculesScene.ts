/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export type MoleculeType = 'h2o' | 'co2' | 'ch4' | 'o3';

export class MoleculesScene {
  public group: THREE.Group;
  private moleculeGroup: THREE.Group;
  private currentType: MoleculeType = 'h2o';

  constructor() {
    this.group = new THREE.Group();
    this.moleculeGroup = new THREE.Group();
    this.group.add(this.moleculeGroup);

    this.buildMolecule('h2o');
  }

  public setMoleculeType(type: MoleculeType) {
    this.currentType = type;
    this.buildMolecule(type);
  }

  public getMoleculeType(): MoleculeType {
    return this.currentType;
  }

  private buildMolecule(type: MoleculeType) {
    while (this.moleculeGroup.children.length > 0) {
      this.moleculeGroup.remove(this.moleculeGroup.children[0]);
    }

    // Material library
    const oxygenMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.1 }); // Red
    const hydrogenMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.1 }); // White
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.2 }); // Dark Slate/Black
    const bondMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.6 }); // Silver cylinder

    const oxygenGeo = new THREE.SphereGeometry(0.5, 24, 24);
    const hydrogenGeo = new THREE.SphereGeometry(0.3, 20, 20);
    const carbonGeo = new THREE.SphereGeometry(0.55, 24, 24);

    const createBond = (p1: THREE.Vector3, p2: THREE.Vector3, radius = 0.08) => {
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const bondGeo = new THREE.CylinderGeometry(radius, radius, len, 16);
      const bond = new THREE.Mesh(bondGeo, bondMat);

      bond.position.copy(p1).addScaledVector(dir, 0.5);
      bond.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      return bond;
    };

    if (type === 'h2o') {
      // Water: Bent 104.5 degrees (2:1 ratio)
      const oMesh = new THREE.Mesh(oxygenGeo, oxygenMat);
      this.moleculeGroup.add(oMesh);

      const hAngle = (104.5 * Math.PI) / 180 / 2;
      const bondDist = 1.2;

      const h1Pos = new THREE.Vector3(Math.sin(hAngle) * bondDist, -Math.cos(hAngle) * bondDist, 0);
      const h2Pos = new THREE.Vector3(-Math.sin(hAngle) * bondDist, -Math.cos(hAngle) * bondDist, 0);

      const h1 = new THREE.Mesh(hydrogenGeo, hydrogenMat);
      h1.position.copy(h1Pos);
      this.moleculeGroup.add(h1);

      const h2 = new THREE.Mesh(hydrogenGeo, hydrogenMat);
      h2.position.copy(h2Pos);
      this.moleculeGroup.add(h2);

      this.moleculeGroup.add(createBond(new THREE.Vector3(0, 0, 0), h1Pos));
      this.moleculeGroup.add(createBond(new THREE.Vector3(0, 0, 0), h2Pos));
    } else if (type === 'co2') {
      // Carbon Dioxide: Linear 180 degrees (1:2 ratio) with double bonds
      const cMesh = new THREE.Mesh(carbonGeo, carbonMat);
      this.moleculeGroup.add(cMesh);

      const o1Pos = new THREE.Vector3(1.6, 0, 0);
      const o2Pos = new THREE.Vector3(-1.6, 0, 0);

      const o1 = new THREE.Mesh(oxygenGeo, oxygenMat);
      o1.position.copy(o1Pos);
      this.moleculeGroup.add(o1);

      const o2 = new THREE.Mesh(oxygenGeo, oxygenMat);
      o2.position.copy(o2Pos);
      this.moleculeGroup.add(o2);

      // Double cylinder bonds
      [-0.1, 0.1].forEach((offsetY) => {
        this.moleculeGroup.add(createBond(new THREE.Vector3(0, offsetY, 0), new THREE.Vector3(1.6, offsetY, 0), 0.05));
        this.moleculeGroup.add(createBond(new THREE.Vector3(0, offsetY, 0), new THREE.Vector3(-1.6, offsetY, 0), 0.05));
      });
    } else if (type === 'ch4') {
      // Methane: Tetrahedral 109.5 degrees (1:4 ratio)
      const cMesh = new THREE.Mesh(carbonGeo, carbonMat);
      this.moleculeGroup.add(cMesh);

      const d = 1.3;
      const hPositions = [
        new THREE.Vector3(d, d, d).normalize().multiplyScalar(d),
        new THREE.Vector3(-d, -d, d).normalize().multiplyScalar(d),
        new THREE.Vector3(-d, d, -d).normalize().multiplyScalar(d),
        new THREE.Vector3(d, -d, -d).normalize().multiplyScalar(d),
      ];

      hPositions.forEach((pos) => {
        const h = new THREE.Mesh(hydrogenGeo, hydrogenMat);
        h.position.copy(pos);
        this.moleculeGroup.add(h);
        this.moleculeGroup.add(createBond(new THREE.Vector3(0, 0, 0), pos));
      });
    } else if (type === 'o3') {
      // Ozone: 3 Oxygen atoms in a bent arc (116.8 degrees)
      const o1 = new THREE.Mesh(oxygenGeo, oxygenMat);
      this.moleculeGroup.add(o1);

      const angle = (116.8 * Math.PI) / 180 / 2;
      const d = 1.3;
      const o2Pos = new THREE.Vector3(Math.sin(angle) * d, -Math.cos(angle) * d, 0);
      const o3Pos = new THREE.Vector3(-Math.sin(angle) * d, -Math.cos(angle) * d, 0);

      const o2 = new THREE.Mesh(oxygenGeo, oxygenMat);
      o2.position.copy(o2Pos);
      this.moleculeGroup.add(o2);

      const o3 = new THREE.Mesh(oxygenGeo, oxygenMat);
      o3.position.copy(o3Pos);
      this.moleculeGroup.add(o3);

      this.moleculeGroup.add(createBond(new THREE.Vector3(0, 0, 0), o2Pos));
      this.moleculeGroup.add(createBond(new THREE.Vector3(0, 0, 0), o3Pos));
    }
  }

  public update(time: number, dt: number) {
    // Gentle 3D turntable rotation to inspect molecular geometry
    this.moleculeGroup.rotation.y = time * 0.5;
    this.moleculeGroup.rotation.x = Math.sin(time * 0.3) * 0.2;
  }
}
