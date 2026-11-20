/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export class DiffusionScene {
  public group: THREE.Group;
  private liquidDyeParticles: THREE.Points;
  private iceDyeMesh: THREE.Mesh;
  private dyePositions: Float32Array;
  private dyeVelocities: Float32Array;
  private particleCount = 200;
  private diffusionTime = 0;

  constructor() {
    this.group = new THREE.Group();

    // 1. Lab Table Surface
    const tableGeo = new THREE.BoxGeometry(7, 0.4, 4);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.7,
      metalness: 0.1,
    });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -1.8;
    this.group.add(table);

    // ==========================================
    // LEFT VESSEL: Beaker with Liquid Water
    // ==========================================
    const leftGroup = new THREE.Group();
    leftGroup.position.set(-1.8, -0.6, 0);

    // Beaker glass
    const beakerGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.0, 32, 1, true);
    const beakerMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      depthWrite: false,
    });
    const beaker = new THREE.Mesh(beakerGeo, beakerMat);
    leftGroup.add(beaker);

    // Liquid water volume
    const waterGeo = new THREE.CylinderGeometry(0.88, 0.88, 1.6, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = -0.15;
    leftGroup.add(water);

    // Liquid Dye Particles: Diffusion in action!
    const dyeGeo = new THREE.BufferGeometry();
    this.dyePositions = new Float32Array(this.particleCount * 3);
    this.dyeVelocities = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      // Start in a tight drop at top of water
      this.dyePositions[i * 3] = (Math.random() - 0.5) * 0.15;
      this.dyePositions[i * 3 + 1] = 0.6 + (Math.random() - 0.5) * 0.1;
      this.dyePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;

      this.dyeVelocities[i * 3] = (Math.random() - 0.5) * 0.6;
      this.dyeVelocities[i * 3 + 1] = -0.4 - Math.random() * 0.5; // sinking
      this.dyeVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }

    dyeGeo.setAttribute('position', new THREE.BufferAttribute(this.dyePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x1d4ed8, // Deep cobalt blue dye
      size: 0.08,
      transparent: true,
      opacity: 0.85,
    });
    this.liquidDyeParticles = new THREE.Points(dyeGeo, particleMat);
    leftGroup.add(this.liquidDyeParticles);
    this.group.add(leftGroup);

    // ==========================================
    // RIGHT VESSEL: Petri Dish with Ice Cube
    // ==========================================
    const rightGroup = new THREE.Group();
    rightGroup.position.set(1.8, -0.6, 0);

    // Ceramic Petri Dish / Plate
    const dishGeo = new THREE.CylinderGeometry(1.2, 1.0, 0.25, 32);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.3,
      metalness: 0.1,
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.y = -0.8;
    rightGroup.add(dish);

    // Ice Cube (Frosted crystal appearance)
    const iceGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
    const iceMat = new THREE.MeshPhysicalMaterial({
      color: 0xbfdbfe,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8,
      transmission: 0.6,
    });
    const iceCube = new THREE.Mesh(iceGeo, iceMat);
    iceCube.position.y = -0.2;
    rightGroup.add(iceCube);

    // Localized food coloring droplet on top of the ice cube!
    const spotGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.06, 24);
    const spotMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.3,
    });
    this.iceDyeMesh = new THREE.Mesh(spotGeo, spotMat);
    this.iceDyeMesh.position.set(0, 0.38, 0);
    rightGroup.add(this.iceDyeMesh);

    this.group.add(rightGroup);
  }

  public resetDye() {
    this.diffusionTime = 0;
    for (let i = 0; i < this.particleCount; i++) {
      this.dyePositions[i * 3] = (Math.random() - 0.5) * 0.15;
      this.dyePositions[i * 3 + 1] = 0.6 + (Math.random() - 0.5) * 0.1;
      this.dyePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;

      this.dyeVelocities[i * 3] = (Math.random() - 0.5) * 0.6;
      this.dyeVelocities[i * 3 + 1] = -0.4 - Math.random() * 0.5;
      this.dyeVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    this.liquidDyeParticles.geometry.attributes.position.needsUpdate = true;
  }

  public update(time: number, dt: number) {
    this.diffusionTime += dt;
    const rLim = 0.75;
    const bottomY = -0.85;
    const topY = 0.6;

    for (let i = 0; i < this.particleCount; i++) {
      let x = this.dyePositions[i * 3];
      let y = this.dyePositions[i * 3 + 1];
      let z = this.dyePositions[i * 3 + 2];

      const vx = this.dyeVelocities[i * 3];
      const vy = this.dyeVelocities[i * 3 + 1];
      const vz = this.dyeVelocities[i * 3 + 2];

      // Dye moves down and outward (Brownian swirl)
      x += (vx + Math.sin(time * 2 + i) * 0.2) * dt;
      y += (vy + Math.cos(time * 1.5 + i) * 0.1) * dt;
      z += (vz + Math.cos(time * 2 + i) * 0.2) * dt;

      // Cylinder collision constraint
      const dist = Math.sqrt(x * x + z * z);
      if (dist > rLim) {
        x = (x / dist) * rLim;
        z = (z / dist) * rLim;
        this.dyeVelocities[i * 3] *= -0.8;
        this.dyeVelocities[i * 3 + 2] *= -0.8;
      }
      if (y < bottomY) {
        y = bottomY;
        this.dyeVelocities[i * 3 + 1] = Math.abs(vy) * 0.3; // rebound
      }
      if (y > topY) {
        y = topY;
        this.dyeVelocities[i * 3 + 1] = -Math.abs(vy);
      }

      this.dyePositions[i * 3] = x;
      this.dyePositions[i * 3 + 1] = y;
      this.dyePositions[i * 3 + 2] = z;
    }
    this.liquidDyeParticles.geometry.attributes.position.needsUpdate = true;
  }
}
