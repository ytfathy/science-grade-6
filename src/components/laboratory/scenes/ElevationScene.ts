/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export interface ElevationPoint {
  name: string;
  altitudeM: number;
  pressureAtm: number;
  boilingPtC: number;
  eggCookTime: string;
}

export const ELEVATION_DATA: ElevationPoint[] = [
  { name: 'San Francisco, CA', altitudeM: 0, pressureAtm: 1.0, boilingPtC: 100.0, eggCookTime: '3 min 11 s' },
  { name: 'Denver, CO', altitudeM: 1609, pressureAtm: 0.82, boilingPtC: 95.0, eggCookTime: '4 min 00 s' },
  { name: 'Quito, Ecuador', altitudeM: 2850, pressureAtm: 0.71, boilingPtC: 90.0, eggCookTime: '4 min 35 s' },
  { name: 'Mount Everest', altitudeM: 8848, pressureAtm: 0.31, boilingPtC: 76.5, eggCookTime: '7 min 15 s' },
];

export class ElevationScene {
  public group: THREE.Group;
  private airParticles: THREE.InstancedMesh;
  private particleCount = 80;
  private dummy = new THREE.Object3D();
  private particlePositions: THREE.Vector3[] = [];
  private currentElevationIdx = 0;
  private mountainPeak: THREE.Mesh;
  private boilingBubbles: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();

    // 1. Mountain Peak Model (Composite terrain with snow cap)
    const mountainGeo = new THREE.ConeGeometry(3.5, 4.0, 7);
    const mountainMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Rugged rock
      roughness: 0.9,
      flatShading: true,
    });
    const mountain = new THREE.Mesh(mountainGeo, mountainMat);
    mountain.position.set(0, -1.0, -1.5);
    this.group.add(mountain);

    // Snow cap
    const snowGeo = new THREE.ConeGeometry(1.6, 1.8, 7);
    const snowMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      flatShading: true,
    });
    this.mountainPeak = new THREE.Mesh(snowGeo, snowMat);
    this.mountainPeak.position.set(0, 0.2, -1.5);
    this.group.add(this.mountainPeak);

    // 2. High-Altitude Field Station Boiling Beaker
    const beakerGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.6, 24, 1, true);
    const beakerMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.4,
      transmission: 0.85,
      depthWrite: false,
    });
    const beaker = new THREE.Mesh(beakerGeo, beakerMat);
    beaker.position.set(1.5, -0.2, 1.0);
    this.group.add(beaker);

    // Liquid inside beaker
    const waterGeo = new THREE.CylinderGeometry(0.68, 0.68, 1.2, 24);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(1.5, -0.4, 1.0);
    this.group.add(water);

    // Boiling bubbles inside water
    const bubbleGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    for (let b = 0; b < 12; b++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      bubble.position.set(
        1.5 + (Math.random() - 0.5) * 0.5,
        -0.8 + Math.random() * 0.8,
        1.0 + (Math.random() - 0.5) * 0.5
      );
      this.boilingBubbles.push(bubble);
      this.group.add(bubble);
    }

    // 3. Air Particles in Atmosphere (Density changes with altitude!)
    const airGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const airMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.6,
    });
    this.airParticles = new THREE.InstancedMesh(airGeo, airMat, this.particleCount);
    this.group.add(this.airParticles);

    for (let i = 0; i < this.particleCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        -1.5 + Math.random() * 4,
        (Math.random() - 0.5) * 4
      );
      this.particlePositions.push(pos);
      this.dummy.position.copy(pos);
      this.dummy.updateMatrix();
      this.airParticles.setMatrixAt(i, this.dummy.matrix);
    }
    this.airParticles.instanceMatrix.needsUpdate = true;
  }

  public setElevationIndex(idx: number) {
    this.currentElevationIdx = Math.max(0, Math.min(ELEVATION_DATA.length - 1, idx));
  }

  public getElevationData(): ElevationPoint {
    return ELEVATION_DATA[this.currentElevationIdx];
  }

  public update(time: number, dt: number) {
    const data = this.getElevationData();
    // At high elevation (Everest: 0.31 atm), fewer visible air particles exist in the volume
    const activeParticleCount = Math.round(this.particleCount * data.pressureAtm);

    for (let i = 0; i < this.particleCount; i++) {
      const pos = this.particlePositions[i];
      if (i < activeParticleCount) {
        pos.x += Math.sin(time * 2 + i) * 0.005;
        pos.y += Math.cos(time * 1.5 + i) * 0.005;
        this.dummy.position.copy(pos);
        this.dummy.scale.set(1, 1, 1);
      } else {
        // Hide particles that are absent at lower density
        this.dummy.scale.set(0.0001, 0.0001, 0.0001);
      }
      this.dummy.updateMatrix();
      this.airParticles.setMatrixAt(i, this.dummy.matrix);
    }
    this.airParticles.instanceMatrix.needsUpdate = true;

    // Bubbles rise faster and more vigorously at lower pressure (Everest boils easily!)
    const bubbleSpeed = 1.2 + (1.0 - data.pressureAtm) * 2.0;
    this.boilingBubbles.forEach((b, idx) => {
      b.position.y += dt * (0.4 * bubbleSpeed + idx * 0.05);
      if (b.position.y > 0.2) {
        b.position.y = -0.9;
        b.position.x = 1.5 + (Math.random() - 0.5) * 0.5;
        b.position.z = 1.0 + (Math.random() - 0.5) * 0.5;
      }
    });
  }
}
