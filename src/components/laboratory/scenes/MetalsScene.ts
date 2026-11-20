/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export class MetalsScene {
  public group: THREE.Group;
  private hammerGroup: THREE.Group;
  private metalBowl: THREE.Mesh;
  private metalType: 'copper' | 'silver' = 'copper';
  private hammerSwing = 0; // 0 = ready, 1 = strike
  private isSwinging = false;
  private bulbMesh: THREE.Mesh;
  private circuitClosed = false;

  constructor() {
    this.group = new THREE.Group();

    // 1. Blacksmith / Lab Heavy Anvil Base
    const anvilMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.35,
    });
    const anvilTopGeo = new THREE.BoxGeometry(3.2, 0.6, 1.8);
    const anvilTop = new THREE.Mesh(anvilTopGeo, anvilMat);
    anvilTop.position.set(0, -1.2, 0);
    this.group.add(anvilTop);

    const anvilPedestalGeo = new THREE.CylinderGeometry(0.8, 1.2, 1.0, 16);
    const anvilPedestal = new THREE.Mesh(anvilPedestalGeo, anvilMat);
    anvilPedestal.position.set(0, -1.8, 0);
    this.group.add(anvilPedestal);

    // 2. Malleable Metal Vessel / Bowl (Hammered Copper or Silver like HMH p. 44)
    const bowlGeo = new THREE.SphereGeometry(0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Rich hammered copper reddish-brown
      metalness: 0.92,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });
    this.metalBowl = new THREE.Mesh(bowlGeo, copperMat);
    this.metalBowl.rotation.x = Math.PI;
    this.metalBowl.position.set(0, -0.85, 0);
    this.group.add(this.metalBowl);

    // 3. Blacksmith / Artisan Hammer (Composite model: wooden handle, steel head)
    this.hammerGroup = new THREE.Group();
    const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = 0.9;
    this.hammerGroup.add(handle);

    const headGeo = new THREE.BoxGeometry(0.5, 0.35, 0.35);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.2 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.8;
    this.hammerGroup.add(head);

    this.hammerGroup.position.set(1.4, 0.5, 0);
    this.hammerGroup.rotation.z = Math.PI / 4;
    this.group.add(this.hammerGroup);

    // 4. Electrical Conductivity Test Circuit (HMH p. 45: copper/silver conduct electricity)
    const circuitGroup = new THREE.Group();
    circuitGroup.position.set(-2.0, -0.6, 0);

    // Battery cell
    const battGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const battMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.6 });
    const batt = new THREE.Mesh(battGeo, battMat);
    batt.position.y = -0.2;
    circuitGroup.add(batt);

    // Test Light Bulb
    const bulbGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xca8a04,
      emissiveIntensity: 0.1,
    });
    this.bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    this.bulbMesh.position.set(0, 0.6, 0);
    circuitGroup.add(this.bulbMesh);

    this.group.add(circuitGroup);
  }

  public setMetalType(type: 'copper' | 'silver') {
    this.metalType = type;
    const mat = this.metalBowl.material as THREE.MeshStandardMaterial;
    if (type === 'copper') {
      mat.color.setHex(0xb45309); // Reddish-brown copper
    } else {
      mat.color.setHex(0xe2e8f0); // Shiny gray silver
    }
  }

  public strikeHammer() {
    this.isSwinging = true;
    this.hammerSwing = 0;
  }

  public toggleCircuit(): boolean {
    this.circuitClosed = !this.circuitClosed;
    const bMat = this.bulbMesh.material as THREE.MeshStandardMaterial;
    if (this.circuitClosed) {
      bMat.emissive.setHex(0xfef08a);
      bMat.emissiveIntensity = 1.0;
    } else {
      bMat.emissive.setHex(0xca8a04);
      bMat.emissiveIntensity = 0.1;
    }
    return this.circuitClosed;
  }

  public update(time: number, dt: number) {
    if (this.isSwinging) {
      this.hammerSwing += dt * 4;
      if (this.hammerSwing < 1.0) {
        // Strike down towards the bowl
        const angle = Math.PI / 4 - this.hammerSwing * (Math.PI / 2.2);
        this.hammerGroup.rotation.z = angle;
      } else if (this.hammerSwing < 1.5) {
        // Recoil back up
        const recoilT = (this.hammerSwing - 1.0) / 0.5;
        this.hammerGroup.rotation.z = -Math.PI / 4.4 + recoilT * (Math.PI / 2.2);
      } else {
        this.isSwinging = false;
        this.hammerGroup.rotation.z = Math.PI / 4;
      }
    }
  }
}
