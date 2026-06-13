'use client'
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometry
    const geometry = new THREE.IcosahedronGeometry(1.15, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0xFF6B00,
      wireframe: true,
      transparent: true,
      opacity: 0.68,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = window.innerWidth > 900 ? 1.4 : 0;
    scene.add(mesh);

    const ringGeometry = new THREE.TorusGeometry(1.65, 0.008, 12, 120);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.6;
    ring.position.copy(mesh.position);
    scene.add(ring);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 700 : 1800;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.006,
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.7,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xFF6B00, 2);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const coolLight = new THREE.PointLight(0xffffff, 0.8);
    coolLight.position.set(-4, -2, 2);
    scene.add(coolLight);

    camera.position.z = 3;

    // Mouse movement
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let frameId = 0;
    const targetPosition = { x: mesh.position.x, y: mesh.position.y };

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.002;
        ring.rotation.z -= 0.0015;
        particlesMesh.rotation.y = mouseX * 0.5;
        particlesMesh.rotation.x = -mouseY * 0.5;
        targetPosition.x = (window.innerWidth > 900 ? 1.4 : 0) + mouseX * 0.5;
        targetPosition.y = -mouseY * 0.5;
        mesh.position.x += (targetPosition.x - mesh.position.x) * 0.04;
        mesh.position.y += (targetPosition.y - mesh.position.y) * 0.04;
        ring.position.copy(mesh.position);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mesh.position.x = window.innerWidth > 900 ? 1.4 : 0;
      ring.position.copy(mesh.position);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 -z-10 pointer-events-none" />;
};

export default HeroCanvas;
