'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { throttle } from '@/lib/throttle';

const SmokeCanvas = ({ dynamicHeight = '100dvh' }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const scene = new THREE.Scene();
    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(27, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const smokeGeometry = new THREE.PlaneGeometry(
      1,
      1,
      width < 768 ? 26 : 32,
      width < 768 ? 78 : 96
    );
    smokeGeometry.translate(0, 0.5, 0);
    smokeGeometry.scale(2.8, 6.5, 2.0);

    let baseCamY = 10;

    const textureLoader = new THREE.TextureLoader();
    let perlinTexture;
    let smokeMeshes = [];
    let smoke1, smoke2, smoke3;

    textureLoader.load('/images/perlin.png', (texture) => {
      perlinTexture = texture;
      perlinTexture.wrapS = THREE.RepeatWrapping;
      perlinTexture.wrapT = THREE.RepeatWrapping;

      const baseMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uPerlinTexture: { value: perlinTexture },
          uUvOffset: { value: new THREE.Vector2(0, 0) },
          uUvScale: { value: new THREE.Vector2(1, 1) },
          uStrength: { value: 1.0 },
        },
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
      });

      smoke1 = new THREE.Mesh(smokeGeometry, baseMaterial.clone());
      smoke1.material.uniforms.uUvOffset.value.set(0.0, 0.0);
      smoke1.material.uniforms.uUvScale.value.set(1.0, 1.0);
      scene.add(smoke1);

      smoke2 = new THREE.Mesh(smokeGeometry, baseMaterial.clone());
      smoke2.material.uniforms.uUvOffset.value.set(0.43, 0.19);
      smoke2.material.uniforms.uUvScale.value.set(1.35, 0.82);
      scene.add(smoke2);

      smoke3 = new THREE.Mesh(smokeGeometry, baseMaterial.clone());
      smoke3.material.uniforms.uUvOffset.value.set(0.76, -0.27);
      smoke3.material.uniforms.uUvScale.value.set(0.88, 1.18);
      scene.add(smoke3);

      smokeMeshes = [smoke1, smoke2, smoke3];

      // Ensure first responsive layout after meshes exist
      updateResponsive();
    });

    const getConfig = (w) => {
      if (w < 420)
        return {
          xShift: 1.05,
          baseScale: 0.76,
          strengths: [1.19, 1.07, 0.92],
          camX: 4.15,
          camZ: 14.2,
          camY: 11.5,
        };
      if (w < 640)
        return {
          xShift: 1.75,
          baseScale: 0.69,
          strengths: [1.08, 0.98, 0.84],
          camX: 5.15,
          camZ: 13.8,
          camY: 11.25,
        };
      if (w < 768)
        return {
          xShift: 2.25,
          baseScale: 0.72,
          strengths: [1.05, 0.96, 0.82],
          camX: 5.65,
          camZ: 13.5,
          camY: 11.05,
        };
      if (w < 1024)
        return {
          xShift: 2.55,
          baseScale: 0.75,
          strengths: [1.1, 1.0, 0.86],
          camX: 6.15,
          camZ: 13.2,
          camY: 10.75,
        };
      if (w < 1400)
        return {
          xShift: 2.85,
          baseScale: 0.78,
          strengths: [1.15, 1.04, 0.89],
          camX: 6.45,
          camZ: 13.0,
          camY: 10.45,
        };
      return {
        xShift: 4.95,
        baseScale: 0.825,
        strengths: [1.22, 1.08, 0.92],
        camX: 7.85,
        camZ: 13.1,
        camY: 10.15,
      };
    };

    const updateResponsive = () => {
      if (!containerRef.current) return;

      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;
      const aspect = width / height;

      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      const cfg = getConfig(width);
      const aspectFactor = Math.max(0.7, Math.min(1.12, aspect / 1.7));

      if (smoke1 && smoke2 && smoke3) {
        smoke1.position.set(cfg.xShift, 0.08, 0);
        smoke1.scale.set(cfg.baseScale * aspectFactor * 1.06, 1.035, 1);
        smoke1.material.uniforms.uStrength.value = cfg.strengths[0];

        smoke2.position.set(cfg.xShift - 0.27, -0.4, -1.33);
        smoke2.scale.set(cfg.baseScale * 1.2 * aspectFactor, 1.095, 1);
        smoke2.material.uniforms.uStrength.value = cfg.strengths[1];

        smoke3.position.set(cfg.xShift + 0.37, 0.55, 2.0);
        smoke3.scale.set(cfg.baseScale * 0.85 * aspectFactor, 0.935, 1);
        smoke3.material.uniforms.uStrength.value = cfg.strengths[2];
      }

      camera.position.set(cfg.camX, cfg.camY, cfg.camZ);
      camera.lookAt(cfg.xShift * 0.2, 3.35, 0);

      baseCamY = cfg.camY;
    };

    // Initial layout (safe even before meshes exist)
    updateResponsive();

    const timer = new THREE.Timer();
    let req;
    const animate = (time) => {
      timer.update(time);
      const elapsed = timer.getElapsed();

      if (smokeMeshes.length) {
        smokeMeshes.forEach((mesh, i) => {
          mesh.material.uniforms.uTime.value = elapsed + i * 2.1;
        });
      }

      camera.position.y = baseCamY + Math.sin(elapsed * 0.06) * 0.2;
      renderer.render(scene, camera);

      req = requestAnimationFrame(animate);
    };
    req = requestAnimationFrame(animate);

    const handleResize = throttle(updateResponsive, 80);
    window.addEventListener('resize', handleResize);
    const handleOrientationChange = () => setTimeout(updateResponsive, 160);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      cancelAnimationFrame(req);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      renderer.dispose();
      smokeGeometry.dispose();
      if (perlinTexture) perlinTexture.dispose();
      smokeMeshes.forEach((m) => {
        m.material.dispose();
        m.geometry.dispose();
      });
    };
  }, [dynamicHeight]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto bg-black overflow-hidden"
      style={{ height: dynamicHeight }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default SmokeCanvas;
