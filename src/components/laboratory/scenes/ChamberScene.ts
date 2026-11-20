/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

/**
 * 3D Microscopic State Chamber
 * Solid: Vibrating cubic lattice
 * Liquid: Flowing, sliding particles at bottom of chamber
 * Gas: Freely bouncing particles filling 3D space with high velocity
 */
export class ChamberScene {
  public group: THREE.Group;
  private particles: THREE.InstancedMesh;
  private particleCount = 125; // 5x5x5 grid
  private dummy = new THREE.Object3D();
  private basePositions: THREE.Vector3[] = [];
  private velocities: THREE.Vector3[] = [];
  private currentMode: 'solid' | 'liquid' | 'gas' = 'solid';
  private boxBounds = { x: 3.0, y: 3.0, z: 3.0 };

  constructor() {
    this.group = new THREE.Group();

    // 1. Chamber glass enclosure (composite model: base, metal pillars, glass cube)
    const baseGeo = new THREE.CylinderGeometry(3.8, 4.0, 0.4, 32);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.25,
    });
    const base = new THREE.Mesh(baseGeo, metalMat);
    base.position.y = -2.2;
    this.group.add(base);

    // Chamber glass cube
    const glassGeo = new THREE.BoxGeometry(4.2, 4.2, 4.2);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      depthWrite: false,
    });
    const chamber = new THREE.Mesh(glassGeo, glassMat);
    chamber.position.y = 0;
    this.group.add(chamber);

    // Wireframe cage
    const wireGeo = new THREE.BoxGeometry(4.22, 4.22, 4.22);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.y = 0;
    this.group.add(wire);

    // Top cap
    const topCapGeo = new THREE.CylinderGeometry(3.4, 3.6, 0.3, 32);
    const topCap = new THREE.Mesh(topCapGeo, metalMat);
    topCap.position.y = 2.25;
    this.group.add(topCap);

    // Particles: Instanced sphere mesh for 60fps performance
    const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.2,
      metalness: 0.4,
    });
    this.particles = new THREE.InstancedMesh(sphereGeo, particleMat, this.particleCount);
    this.particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.group.add(this.particles);

    // Initialize particle data (5x5x5 grid)
    let idx = 0;
    const spacing = 0.55;
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        for (let z = -2; z <= 2; z++) {
          const pos = new THREE.Vector3(x * spacing, y * spacing, z * spacing);
          this.basePositions.push(pos.clone());
          const vel = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          );
          this.velocities.push(vel);

          this.dummy.position.copy(pos);
          this.dummy.updateMatrix();
          this.particles.setMatrixAt(idx++, this.dummy.matrix);
        }
      }
    }
    this.particles.instanceMatrix.needsUpdate = true;
  }

  public setMode(mode: 'solid' | 'liquid' | 'gas') {
    this.currentMode = mode;
    const mat = this.particles.material as THREE.MeshStandardMaterial;
    if (mode === 'solid') {
      mat.color.setHex(0x38bdf8); // Ice blue
    } else if (mode === 'liquid') {
      mat.color.setHex(0x2563eb); // Water royal blue
    } else {
      mat.color.setHex(0xf97316); // Energetic gas amber
    }
  }

  public update(time: number, dt: number) {
    const lim = 1.8;
    const floorY = -1.8;

    for (let i = 0; i < this.particleCount; i++) {
      const base = this.basePositions[i];
      const vel = this.velocities[i];

      if (this.currentMode === 'solid') {
        // High attractive forces, low kinetic energy: vibrate rapidly around lattice site
        const vibAmp = 0.05;
        const vibSpeed = 14;
        const x = base.x + Math.sin(time * vibSpeed + i * 1.3) * vibAmp;
        const y = base.y + Math.cos(time * vibSpeed + i * 1.7) * vibAmp;
        const z = base.z + Math.sin(time * vibSpeed + i * 0.9) * vibAmp;
        this.dummy.position.set(x, y, z);
      } else if (this.currentMode === 'liquid') {
        // Medium kinetic energy, slide past each other, pool at bottom
        base.x += vel.x * dt * 0.8;
        base.y += vel.y * dt * 0.5;
        base.z += vel.z * dt * 0.8;

        // Pull towards bottom (gravity)
        vel.y -= 2.0 * dt;

        // Bounce bounds
        if (base.x > lim) { base.x = lim; vel.x *= -1; }
        if (base.x < -lim) { base.x = -lim; vel.x *= -1; }
        if (base.z > lim) { base.z = lim; vel.z *= -1; }
        if (base.z < -lim) { base.z = -lim; vel.z *= -1; }
        if (base.y > 0.2) { base.y = 0.2; vel.y *= -1; }
        if (base.y < floorY) { base.y = floorY; vel.y = Math.abs(vel.y) * 0.8; }

        this.dummy.position.copy(base);
      } else {
        // Gas: High kinetic energy, rapid collisions, fills entire chamber
        const gasSpeed = 2.4;
        base.x += vel.x * dt * gasSpeed;
        base.y += vel.y * dt * gasSpeed;
        base.z += vel.z * dt * gasSpeed;

        if (base.x > lim) { base.x = lim; vel.x *= -1; }
        if (base.x < -lim) { base.x = -lim; vel.x *= -1; }
        if (base.y > lim) { base.y = lim; vel.y *= -1; }
        if (base.y < -lim) { base.y = -lim; vel.y *= -1; }
        if (base.z > lim) { base.z = lim; vel.z *= -1; }
        if (base.z < -lim) { base.z = -lim; vel.z *= -1; }

        this.dummy.position.copy(base);
      }

      this.dummy.updateMatrix();
      this.particles.setMatrixAt(i, this.dummy.matrix);
    }
    this.particles.instanceMatrix.needsUpdate = true;
  }
}
