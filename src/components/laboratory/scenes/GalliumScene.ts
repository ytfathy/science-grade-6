/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export class GalliumScene {
  public group: THREE.Group;
  private galliumSolid: THREE.Mesh;
  private galliumLiquid: THREE.Mesh;
  private temperature = 20; // Starts at room temp (20°C)
  private meltProgress = 0; // 0 = fully solid ingot, 1 = fully liquid puddle

  constructor() {
    this.group = new THREE.Group();

    // 1. Stylized Anatomical Laboratory Hand (Palm + Finger Segments)
    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.6, 0);

    const handMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887, // Natural skin tone
      roughness: 0.55,
      metalness: 0.05,
    });

    // Palm base
    const palmGeo = new THREE.BoxGeometry(2.4, 0.4, 2.2);
    const palm = new THREE.Mesh(palmGeo, handMat);
    handGroup.add(palm);

    // 4 Fingers extending forward
    for (let f = 0; f < 4; f++) {
      const fingerGeo = new THREE.CylinderGeometry(0.2, 0.22, 1.3, 16);
      const finger = new THREE.Mesh(fingerGeo, handMat);
      finger.rotation.x = Math.PI / 2.3; // slightly curled cup
      finger.position.set(-0.85 + f * 0.55, 0.1, 1.4);
      handGroup.add(finger);
    }

    // Thumb angled to the side
    const thumbGeo = new THREE.CylinderGeometry(0.22, 0.24, 1.0, 16);
    const thumb = new THREE.Mesh(thumbGeo, handMat);
    thumb.position.set(-1.4, 0.1, 0.3);
    thumb.rotation.z = Math.PI / 4;
    thumb.rotation.x = Math.PI / 6;
    handGroup.add(thumb);

    this.group.add(handGroup);

    // 2. Solid Gallium Ingot
    // A clean rectangular silvery metallic ingot
    const ingotGeo = new THREE.BoxGeometry(1.4, 0.35, 0.8);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Brilliant silvery metal
      metalness: 0.95,
      roughness: 0.18,
    });
    this.galliumSolid = new THREE.Mesh(ingotGeo, metalMat);
    this.galliumSolid.position.set(0, -0.22, 0.2);
    this.group.add(this.galliumSolid);

    // 3. Liquid Gallium Puddle (Smooth molten mercury-like dome)
    const puddleGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.15, 32);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.05,
    });
    this.galliumLiquid = new THREE.Mesh(puddleGeo, liquidMat);
    this.galliumLiquid.position.set(0, -0.32, 0.2);
    this.galliumLiquid.scale.set(0.01, 0.01, 0.01);
    this.group.add(this.galliumLiquid);

    // 4. Lab Bench Surface
    const benchGeo = new THREE.BoxGeometry(6.5, 0.4, 4.5);
    const benchMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.2,
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.y = -1.5;
    this.group.add(bench);
  }

  public setTemperature(tempC: number) {
    this.temperature = tempC;
  }

  public getTemperature(): number {
    return this.temperature;
  }

  public update(time: number, dt: number) {
    // If temperature > 29.8°C (gallium melting point), melt towards 1
    // If below, freeze back towards 0
    const targetMelt = this.temperature >= 29.8 ? 1.0 : 0.0;
    this.meltProgress += (targetMelt - this.meltProgress) * Math.min(dt * 2.5, 1);

    // Ingot softens, flattens, and sinks
    const solidScaleY = Math.max(0.02, 1.0 - this.meltProgress * 0.9);
    const solidScaleXZ = 1.0 + this.meltProgress * 0.3;
    this.galliumSolid.scale.set(solidScaleXZ, solidScaleY, solidScaleXZ);
    this.galliumSolid.position.y = -0.22 - this.meltProgress * 0.1;

    // Liquid puddle expands
    const liquidScale = Math.max(0.01, this.meltProgress);
    this.galliumLiquid.scale.set(liquidScale * 1.2, 0.8 + this.meltProgress * 0.2, liquidScale * 1.2);

    // Subtle liquid surface ripple when molten
    if (this.meltProgress > 0.5) {
      this.galliumLiquid.scale.x = liquidScale * 1.2 + Math.sin(time * 6) * 0.02;
      this.galliumLiquid.scale.z = liquidScale * 1.2 + Math.cos(time * 5) * 0.02;
    }
  }
}
