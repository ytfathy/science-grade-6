/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SimMode } from '../../game/types.ts';

export interface SceneBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  grounded: boolean;
}

export interface FramingOptions {
  bohrElementIdx?: number;
  allotropesMode?: 'diamond' | 'graphite' | 'both';
}

export interface CameraFrameResult {
  target: { x: number; y: number; z: number };
  distance: number;
  pitchRad: number;
  yawRad: number;
}

export function getSceneBounds(mode: SimMode, options: FramingOptions = {}): SceneBounds {
  switch (mode) {
    case 'chamber':
      return {
        minX: -4.0,
        maxX: 4.0,
        minY: -2.45,
        maxY: 2.45,
        minZ: -4.0,
        maxZ: 4.0,
        grounded: true,
      };
    case 'displacement':
      return {
        minX: -1.85,
        maxX: 1.85,
        minY: -2.45,
        maxY: 3.2,
        minZ: -1.85,
        maxZ: 1.85,
        grounded: true,
      };
    case 'diffusion':
      return {
        minX: -3.5,
        maxX: 3.5,
        minY: -2.0,
        maxY: 0.5,
        minZ: -2.0,
        maxZ: 2.0,
        grounded: true,
      };
    case 'thermal':
      return {
        minX: -1.45,
        maxX: 1.45,
        minY: -2.0,
        maxY: 1.65,
        minZ: -1.45,
        maxZ: 1.45,
        grounded: true,
      };
    case 'gallium':
      return {
        minX: -3.25,
        maxX: 3.25,
        minY: -1.7,
        maxY: 0.3,
        minZ: -2.25,
        maxZ: 2.25,
        grounded: true,
      };
    case 'elevation':
      return {
        minX: -3.5,
        maxX: 3.5,
        minY: -3.0,
        maxY: 2.5,
        minZ: -5.0,
        maxZ: 2.0,
        grounded: true,
      };
    case 'bohr': {
      const idx = options.bohrElementIdx ?? 1;
      // Copper (idx=3) has 4 shells up to r=3.8 tilted at 0.9 rad
      if (idx === 3) {
        return {
          minX: -3.95,
          maxX: 3.95,
          minY: -3.2,
          maxY: 3.2,
          minZ: -3.95,
          maxZ: 3.95,
          grounded: false,
        };
      }
      if (idx === 0) {
        return {
          minX: -1.3,
          maxX: 1.3,
          minY: -0.9,
          maxY: 0.9,
          minZ: -1.3,
          maxZ: 1.3,
          grounded: false,
        };
      }
      return {
        minX: -2.2,
        maxX: 2.2,
        minY: -1.3,
        maxY: 1.3,
        minZ: -2.2,
        maxZ: 2.2,
        grounded: false,
      };
    }
    case 'moseley':
      return {
        minX: -2.95,
        maxX: 2.95,
        minY: -0.75,
        maxY: 2.65,
        minZ: -0.9,
        maxZ: 0.9,
        grounded: false,
      };
    case 'metals':
      return {
        minX: -2.45,
        maxX: 2.85,
        minY: -2.3,
        maxY: 2.3,
        minZ: -1.0,
        maxZ: 1.0,
        grounded: true,
      };
    case 'molecules':
      return {
        minX: -2.2,
        maxX: 2.2,
        minY: -1.5,
        maxY: 1.5,
        minZ: -1.6,
        maxZ: 1.6,
        grounded: false,
      };
    case 'allotropes': {
      const viewMode = options.allotropesMode ?? 'both';
      if (viewMode === 'diamond') {
        return {
          minX: -1.4,
          maxX: 1.4,
          minY: -1.1,
          maxY: 1.1,
          minZ: -1.4,
          maxZ: 1.4,
          grounded: false,
        };
      }
      if (viewMode === 'graphite') {
        return {
          minX: -2.4,
          maxX: 2.4,
          minY: -1.15,
          maxY: 1.15,
          minZ: -2.4,
          maxZ: 2.4,
          grounded: false,
        };
      }
      return {
        minX: -3.2,
        maxX: 4.2,
        minY: -1.15,
        maxY: 1.15,
        minZ: -2.4,
        maxZ: 2.4,
        grounded: false,
      };
    }
    case 'salt':
      return {
        minX: -1.65,
        maxX: 1.65,
        minY: -1.65,
        maxY: 1.65,
        minZ: -1.65,
        maxZ: 1.65,
        grounded: false,
      };
  }
}

export interface ComputeFramingInput {
  bounds: SceneBounds;
  fovDeg: number;
  aspect: number;
  rotX: number;
  rotY: number;
  basePitch?: number;
  paddingFactor?: number;
  minDistance?: number;
}

/**
 * Computes a camera target & distance that keeps all 8 corners of `bounds`
 * strictly within [-1/paddingFactor, +1/paddingFactor] NDC horizontally and vertically
 * so the 3D model never extends over/under the bottom experiment bar or top audio bar.
 */
export function computeFramedCamera({
  bounds,
  fovDeg,
  aspect,
  rotX,
  rotY,
  basePitch = 0.16,
  paddingFactor = 1.2,
  minDistance = 4.6,
}: ComputeFramingInput): CameraFrameResult {
  const safeAspect = Math.max(0.25, aspect);
  const pitchRad = Math.max(-0.65, Math.min(0.65, basePitch + rotX));
  const yawRad = rotY;

  const target = {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
    z: (bounds.minZ + bounds.maxZ) / 2,
  };

  const tanVFov = Math.tan(((fovDeg * Math.PI) / 180) / 2);
  const tanHFov = tanVFov * safeAspect;

  // Unit vector pointing from target toward camera
  const cosP = Math.cos(pitchRad);
  const sinP = Math.sin(pitchRad);
  const sinY = Math.sin(yawRad);
  const cosY = Math.cos(yawRad);

  const camBack = {
    x: sinY * cosP,
    y: sinP,
    z: cosY * cosP,
  };

  // Camera right vector = normalize(worldUp x camBack) -> (cosY, 0, -sinY)
  const camRight = {
    x: cosY,
    y: 0,
    z: -sinY,
  };

  // Camera up vector = camBack x camRight
  const camUp = {
    x: -sinY * sinP,
    y: cosP,
    z: -cosY * sinP,
  };

  const xs = [bounds.minX - target.x, bounds.maxX - target.x];
  const ys = [bounds.minY - target.y, bounds.maxY - target.y];
  const zs = [bounds.minZ - target.z, bounds.maxZ - target.z];

  let requiredDistance = minDistance;

  for (const vx of xs) {
    for (const vy of ys) {
      for (const vz of zs) {
        const rx = vx * camRight.x + vy * camRight.y + vz * camRight.z;
        const ry = vx * camUp.x + vy * camUp.y + vz * camUp.z;
        const rz = vx * camBack.x + vy * camBack.y + vz * camBack.z;

        const dHoriz = rz + (Math.abs(rx) * paddingFactor) / tanHFov;
        const dVert = rz + (Math.abs(ry) * paddingFactor) / tanVFov;

        if (dHoriz > requiredDistance) requiredDistance = dHoriz;
        if (dVert > requiredDistance) requiredDistance = dVert;
      }
    }
  }

  return {
    target,
    distance: requiredDistance,
    pitchRad,
    yawRad,
  };
}

/**
 * Helper to compute the NDC coordinates [-1..1] of a world point under the framed camera.
 * Used by unit tests to verify zero clipping / zero overlap with the bottom experiment bar.
 */
export function projectPointNDC(
  point: { x: number; y: number; z: number },
  frame: CameraFrameResult,
  fovDeg: number,
  aspect: number
): { ndcX: number; ndcY: number; depth: number } {
  const safeAspect = Math.max(0.25, aspect);
  const cosP = Math.cos(frame.pitchRad);
  const sinP = Math.sin(frame.pitchRad);
  const sinY = Math.sin(frame.yawRad);
  const cosY = Math.cos(frame.yawRad);

  const camBack = { x: sinY * cosP, y: sinP, z: cosY * cosP };
  const camRight = { x: cosY, y: 0, z: -sinY };
  const camUp = { x: -sinY * sinP, y: cosP, z: -cosY * sinP };

  const vx = point.x - frame.target.x;
  const vy = point.y - frame.target.y;
  const vz = point.z - frame.target.z;

  const rx = vx * camRight.x + vy * camRight.y + vz * camRight.z;
  const ry = vx * camUp.x + vy * camUp.y + vz * camUp.z;
  const rz = vx * camBack.x + vy * camBack.y + vz * camBack.z;

  const depth = frame.distance - rz;
  const tanVFov = Math.tan(((fovDeg * Math.PI) / 180) / 2);
  const tanHFov = tanVFov * safeAspect;

  return {
    ndcX: rx / (depth * tanHFov),
    ndcY: ry / (depth * tanVFov),
    depth,
  };
}
