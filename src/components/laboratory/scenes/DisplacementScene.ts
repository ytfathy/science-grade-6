/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export class DisplacementScene {
  public group: THREE.Group;
  private waterMesh: THREE.Mesh;
  private rockGroup: THREE.Group;
  private wireMesh: THREE.Mesh;
  private rockY = 2.2;
  private targetRockY = 2.2;
  private isSubmerged = false;

  constructor() {
    this.group = new THREE.Group();

    // 1. Digital Laboratory Scale (Base)
    const scaleBaseGeo = new THREE.BoxGeometry(3.6, 0.5, 3.6);
    const scaleMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.5,
      roughness: 0.3,
    });
    const scaleBase = new THREE.Mesh(scaleBaseGeo, scaleMat);
    scaleBase.position.y = -2.2;
    this.group.add(scaleBase);

    // Digital readout panel
    const screenGeo = new THREE.PlaneGeometry(1.4, 0.4);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, -2.1, 1.81);
    this.group.add(screen);

    // Scale platter
    const platterGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.08, 32);
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.15,
    });
    const platter = new THREE.Mesh(platterGeo, platterMat);
    platter.position.y = -1.91;
    this.group.add(platter);

    // 2. Graduated Cylinder Base (Hexagonal blue plastic base like HMH p. 1)
    const cylBaseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.35, 6);
    const cylBaseMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Vibrant lab cyan/blue
      roughness: 0.4,
    });
    const cylBase = new THREE.Mesh(cylBaseGeo, cylBaseMat);
    cylBase.position.y = -1.7;
    this.group.add(cylBase);

    // 3. Graduated Cylinder Glass Tube (calibrated 100 mL)
    const glassCylGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.4, 32, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.85,
      depthWrite: false,
    });
    const glassTube = new THREE.Mesh(glassCylGeo, glassMat);
    glassTube.position.y = 0.5;
    this.group.add(glassTube);

    // Calibrated graduation tick rings (from 10mL to 100mL)
    const tickMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    for (let i = 1; i <= 10; i++) {
      const y = -1.5 + i * 0.36;
      const ringGeo = new THREE.RingGeometry(0.79, 0.805, 32);
      const ring = new THREE.Mesh(ringGeo, tickMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      this.group.add(ring);
    }

    // 4. Liquid Water Column
    // Starts at 50 mL (height ~ 1.8), rises to 75 mL (height ~ 2.7) when submerged
    const waterGeo = new THREE.CylinderGeometry(0.77, 0.77, 1.8, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1,
    });
    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.position.y = -0.6;
    this.group.add(this.waterMesh);

    // 5. Irregular 20g Rock Object (attached to wire/tongs)
    this.rockGroup = new THREE.Group();
    // Procedural multi-faced rock geometry
    const rockGeo = new THREE.DodecahedronGeometry(0.42, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.85,
      metalness: 0.15,
    });
    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    rockMesh.scale.set(1.1, 0.85, 1.2);
    this.rockGroup.add(rockMesh);

    // Top suspension anchor eyelet at y = 3.1
    const eyeletGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.25 });
    const eyelet = new THREE.Mesh(eyeletGeo, wireMat);
    eyelet.position.set(0, 3.1, 0);
    this.group.add(eyelet);

    // Dynamic suspension wire spanning cleanly from rock top up to y = 3.1
    const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 1, 8);
    this.wireMesh = new THREE.Mesh(wireGeo, wireMat);
    this.group.add(this.wireMesh);

    this.rockGroup.position.set(0, this.rockY, 0);
    this.group.add(this.rockGroup);
    this.syncWireTransform();
  }

  private syncWireTransform() {
    const wireTopY = 3.1;
    const wireBottomY = this.rockGroup.position.y + 0.25;
    const wireLength = Math.max(0.05, wireTopY - wireBottomY);
    this.wireMesh.scale.set(1, wireLength, 1);
    this.wireMesh.position.set(0, wireBottomY + wireLength / 2, 0);
  }

  public setSubmerged(submerged: boolean) {
    this.isSubmerged = submerged;
    this.targetRockY = submerged ? -0.9 : 2.2;
  }

  public toggleSubmerged(): boolean {
    this.setSubmerged(!this.isSubmerged);
    return this.isSubmerged;
  }

  public getSubmerged(): boolean {
    return this.isSubmerged;
  }

  public update(time: number, dt: number) {
    // Smooth exponential damping transition
    this.rockY += (this.targetRockY - this.rockY) * Math.min(dt * 4, 1);
    this.rockGroup.position.y = this.rockY;

    // Rock subtle bobbing
    if (this.isSubmerged) {
      this.rockGroup.position.y += Math.sin(time * 3) * 0.02;
    }

    this.syncWireTransform();

    // Water level scale and position
    // Submerging expands volume from 50mL to 75mL (1.0 -> 1.5 ratio)
    const submersionFactor = Math.max(0, Math.min(1, (2.2 - this.rockY) / 3.1));
    const targetScaleY = 1.0 + submersionFactor * 0.5;
    this.waterMesh.scale.y = targetScaleY;
    this.waterMesh.position.y = -1.5 + (1.8 * targetScaleY) / 2;
  }
}
