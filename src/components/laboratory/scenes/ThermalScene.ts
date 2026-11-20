/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export class ThermalScene {
  public group: THREE.Group;
  private flameCore: THREE.Mesh;
  private flameOuter: THREE.Mesh;
  private particles: THREE.InstancedMesh;
  private particleCount = 64;
  private dummy = new THREE.Object3D();
  private particlePositions: THREE.Vector3[] = [];
  private particleVels: THREE.Vector3[] = [];
  private currentTemp: number = 25; // °C (-20 to 150)
  private flameLight: THREE.PointLight;

  constructor() {
    this.group = new THREE.Group();

    // 1. Lab Tripod Stand with Wire Gauze
    const standMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.85,
      roughness: 0.25,
    });

    // Ring top
    const ringGeo = new THREE.TorusGeometry(1.2, 0.08, 16, 32);
    const ring = new THREE.Mesh(ringGeo, standMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.1;
    this.group.add(ring);

    // 3 Legs
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.0, 12);
      const leg = new THREE.Mesh(legGeo, standMat);
      leg.position.set(Math.cos(angle) * 1.1, -1.0, Math.sin(angle) * 1.1);
      leg.rotation.z = Math.cos(angle) * 0.15;
      leg.rotation.x = Math.sin(angle) * 0.15;
      this.group.add(leg);
    }

    // Wire Gauze ceramic center
    const gauzeGeo = new THREE.CircleGeometry(1.15, 32);
    const gauzeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.8,
      wireframe: true,
    });
    const gauze = new THREE.Mesh(gauzeGeo, gauzeMat);
    gauze.rotation.x = -Math.PI / 2;
    gauze.position.y = -0.08;
    this.group.add(gauze);

    // 2. Bunsen Burner below the stand
    const burnerBaseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.2, 24);
    const burnerBase = new THREE.Mesh(burnerBaseGeo, standMat);
    burnerBase.position.y = -1.9;
    this.group.add(burnerBase);

    const tubeGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.0, 16);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Brass collar
      metalness: 0.9,
      roughness: 0.2,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.y = -1.3;
    this.group.add(tube);

    // Procedural Flame: Inner Blue Core + Outer Orange Mantle
    const innerGeo = new THREE.ConeGeometry(0.16, 0.6, 16);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.flameCore = new THREE.Mesh(innerGeo, innerMat);
    this.flameCore.position.y = -0.5;
    this.group.add(this.flameCore);

    const outerGeo = new THREE.ConeGeometry(0.28, 0.9, 16);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.75,
    });
    this.flameOuter = new THREE.Mesh(outerGeo, outerMat);
    this.flameOuter.position.y = -0.35;
    this.group.add(this.flameOuter);

    // Point Light for realistic dynamic flicker
    this.flameLight = new THREE.PointLight(0xf97316, 1.5, 4);
    this.flameLight.position.set(0, -0.4, 0);
    this.group.add(this.flameLight);

    // 3. Erlenmeyer Glass Flask resting on gauze
    const flaskGeo = new THREE.CylinderGeometry(0.35, 1.1, 1.6, 32);
    const flaskMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      depthWrite: false,
    });
    const flask = new THREE.Mesh(flaskGeo, flaskMat);
    flask.position.y = 0.75;
    this.group.add(flask);

    // 4. Instanced Particles inside the flask
    const particleGeo = new THREE.SphereGeometry(0.09, 12, 12);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.3,
    });
    this.particles = new THREE.InstancedMesh(particleGeo, particleMat, this.particleCount);
    this.group.add(this.particles);

    for (let i = 0; i < this.particleCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 0.9,
        0.15 + Math.random() * 0.8,
        (Math.random() - 0.5) * 0.9
      );
      this.particlePositions.push(pos);
      this.particleVels.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        )
      );
      this.dummy.position.copy(pos);
      this.dummy.updateMatrix();
      this.particles.setMatrixAt(i, this.dummy.matrix);
    }
    this.particles.instanceMatrix.needsUpdate = true;
  }

  public setTemperature(tempC: number) {
    this.currentTemp = Math.max(-20, Math.min(150, tempC));

    // Flame intensity scales with temperature above 0
    const flameFactor = Math.max(0, (this.currentTemp - 0) / 100);
    this.flameOuter.scale.set(1 + flameFactor * 0.5, 0.4 + flameFactor * 0.8, 1 + flameFactor * 0.5);
    this.flameCore.scale.set(1 + flameFactor * 0.3, 0.4 + flameFactor * 0.6, 1 + flameFactor * 0.3);
    this.flameLight.intensity = flameFactor * 2.5;

    // Color of particles shifts with kinetic energy: ice blue -> water royal -> fiery orange steam
    const pMat = this.particles.material as THREE.MeshStandardMaterial;
    if (this.currentTemp < 0) {
      pMat.color.setHex(0x7dd3fc); // Ice solid
    } else if (this.currentTemp < 100) {
      pMat.color.setHex(0x2563eb); // Liquid water
    } else {
      pMat.color.setHex(0xe11d48); // Boiling steam
    }
  }

  public getTemperature(): number {
    return this.currentTemp;
  }

  public update(time: number, dt: number) {
    // Flame flicker
    const flicker = 1 + Math.sin(time * 24) * 0.08 + Math.cos(time * 33) * 0.05;
    this.flameOuter.scale.x = flicker;
    this.flameOuter.scale.z = flicker;

    // Particle velocity scales with temperature
    // Kelvin-equivalent speed factor
    const kelvinFactor = Math.max(0.1, (this.currentTemp + 273.15) / 298);

    for (let i = 0; i < this.particleCount; i++) {
      const pos = this.particlePositions[i];
      const vel = this.particleVels[i];

      if (this.currentTemp < 0) {
        // Solid: Vibrate tightly
        const x = pos.x + Math.sin(time * 12 + i) * 0.02;
        const y = pos.y + Math.cos(time * 12 + i) * 0.02;
        const z = pos.z + Math.sin(time * 10 + i) * 0.02;
        this.dummy.position.set(x, y, z);
      } else if (this.currentTemp < 100) {
        // Liquid: Flow in bottom half of flask
        pos.x += vel.x * dt * 0.4 * kelvinFactor;
        pos.y += vel.y * dt * 0.3 * kelvinFactor;
        pos.z += vel.z * dt * 0.4 * kelvinFactor;

        // Flask boundary containment (conical)
        const currentR = 0.85 - (pos.y - 0.1) * 0.3;
        const dist = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        if (dist > currentR) {
          pos.x = (pos.x / dist) * currentR;
          pos.z = (pos.z / dist) * currentR;
          vel.x *= -1;
          vel.z *= -1;
        }
        if (pos.y < 0.1) { pos.y = 0.1; vel.y = Math.abs(vel.y); }
        if (pos.y > 0.8) { pos.y = 0.8; vel.y = -Math.abs(vel.y); }

        this.dummy.position.copy(pos);
      } else {
        // Steam/Gas: High speed, escaping upwards and bouncing
        pos.x += vel.x * dt * 1.5 * kelvinFactor;
        pos.y += (vel.y + 1.2) * dt * 1.5 * kelvinFactor; // Thermal buoyant rise
        pos.z += vel.z * dt * 1.5 * kelvinFactor;

        if (pos.y > 1.6) {
          // Recycle back to bottom as new bubble
          pos.y = 0.1;
          pos.x = (Math.random() - 0.5) * 0.7;
          pos.z = (Math.random() - 0.5) * 0.7;
        }

        this.dummy.position.copy(pos);
      }

      this.dummy.updateMatrix();
      this.particles.setMatrixAt(i, this.dummy.matrix);
    }
    this.particles.instanceMatrix.needsUpdate = true;
  }
}
