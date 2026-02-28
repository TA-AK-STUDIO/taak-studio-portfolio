"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
// Post-procesado
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

interface UniverseSceneProps {
  zoom: number;
}

interface RotatingUserData {
  rotationSpeed: {
    x: number;
    y: number;
    z: number;
  };
}

const UniverseScene: React.FC<UniverseSceneProps> = ({ zoom }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);

  // Actualiza el zoom
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current; // Copia del ref para usar en cleanup

    /*** ESCENA, CÁMARA Y RENDERIZADOR ***/
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    camera.position.set(0, 100, 400);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);

    /*** POST-PROCESADO ***/
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Bloom (ligeramente atenuado para mayor claridad)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0,
      0.2,
      0.45
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 0.8;
    bloomPass.radius = 0.5;
    composer.addPass(bloomPass);

    // FXAA para suavizar bordes sin perder detalle
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    composer.addPass(fxaaPass);

    // Shader personalizado de Sharpen para realzar detalles
    const SharpenShader = {
      uniforms: {
        tDiffuse: { value: null },
        resolution: { value: new THREE.Vector2(1 / window.innerWidth, 1 / window.innerHeight) },
        strength: { value: 0.3 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float strength;
        varying vec2 vUv;
        
        void main() {
          vec2 offset = resolution;
          vec4 color = texture2D(tDiffuse, vUv);
          vec4 north = texture2D(tDiffuse, vUv + vec2(0.0, offset.y));
          vec4 south = texture2D(tDiffuse, vUv - vec2(0.0, offset.y));
          vec4 east = texture2D(tDiffuse, vUv + vec2(offset.x, 0.0));
          vec4 west = texture2D(tDiffuse, vUv - vec2(offset.x, 0.0));
          vec4 edge = (color * 4.0 - north - south - east - west);
          gl_FragColor = mix(color, edge, strength);
        }
      `
    };
    const sharpenPass = new ShaderPass(SharpenShader);
    composer.addPass(sharpenPass);

    /*** STARFIELD (Campo de Estrellas) ***/
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 2000;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    /*** NEBULOSAS (Sprites) ***/
    const createNebulaTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 110;
      canvas.height = 110;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      // Paleta fría sin tonos rojos
      gradient.addColorStop(0, "rgba(150, 180, 255, 0.8)");
      gradient.addColorStop(0.7, "rgba(40, 20, 60, 0.3)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      return new THREE.CanvasTexture(canvas);
    };

    const createNebulaSprite = (): THREE.Sprite => {
      const texture = createNebulaTexture();
      const material = new THREE.SpriteMaterial({
        map: texture,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(100, 100, 1);
      return sprite;
    };

    const nebulaGroup = new THREE.Group();
    const numNebulas = 30;
    for (let i = 0; i < numNebulas; i++) {
      const nebula = createNebulaSprite();
      // Ubicar las nebulosas más cercanas (rango reducido)
      const radius = 400 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      nebula.position.set(x, y, z);
      (nebula.material as THREE.SpriteMaterial).rotation = Math.random() * Math.PI * 2;
      nebulaGroup.add(nebula);
    }
    scene.add(nebulaGroup);

    /*** PLANETA CON ANILLO (ESTILO SATURNO) ***/
    // Planeta con tonos cálidos y arenosos
    const planetGeometry = new THREE.SphereGeometry(50, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4e1c1,
      emissive: 0x220e0e,
      metalness: 0.3,
      roughness: 0.7,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(200, -50, -300);
    scene.add(planet);

    // Anillo de Saturno más amplio y realista
    const ringGeometry = new THREE.RingGeometry(60, 100, 64);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      metalness: 0.0,
      roughness: 1.0,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.copy(planet.position);
    scene.add(ring);

    /*** CINTURÓN DE ASTEROIDES CON ROTACIÓN INDIVIDUAL ***/
    const asteroidBelt = new THREE.Group();
    const numAsteroids = 200;
    for (let i = 0; i < numAsteroids; i++) {
      const angle = Math.random() * Math.PI * 2;
      const beltRadius = 100 + Math.random() * 50;
      const x = planet.position.x + Math.cos(angle) * beltRadius;
      const z = planet.position.z + Math.sin(angle) * beltRadius;
      const y = planet.position.y + (Math.random() - 0.5) * 20;
      const asteroidGeo = new THREE.SphereGeometry(Math.random() * 2 + 0.5, 8, 8);
      const asteroidMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
      const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
      asteroid.position.set(x, y, z);
      // Asignar velocidades de rotación aleatorias
      asteroid.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
      };
      asteroidBelt.add(asteroid);
    }
    scene.add(asteroidBelt);

    /*** GALAXIA EN ESPIRAL CON COLORES VIBRANTES ***/
    const createGalaxy = () => {
      const parameters = {
        count: 10000,
        size: 0.6,
        radius: 250,
        branches: 4,
        spin: 1,
        randomness: 0.2,
        randomnessPower: 3,
        insideColor: new THREE.Color(0xfff5e1), // centro cálido
        outsideColor: new THREE.Color(0x1b3984), // bordes azules profundos
      };

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const branchAngle =
          ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
        const spinAngle = radius * parameters.spin;
        const randomX =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;
        const randomY =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;
        const randomZ =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const mixedColor = parameters.insideColor.clone();
        mixedColor.lerp(parameters.outsideColor, radius / parameters.radius);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({
        size: parameters.size,
        vertexColors: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });
      return new THREE.Points(geometry, material);
    };

    const galaxy = createGalaxy();
    galaxy.position.set(-250, 0, 0);
    scene.add(galaxy);

    /*** COMETA ***/
    const cometGeometry = new THREE.SphereGeometry(8, 14, 14);
    const cometMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffee,
      metalness: 0.6,
      roughness: 0.1,
    });
    const comet = new THREE.Mesh(cometGeometry, cometMaterial);
    comet.position.set(-400, 100, 500);
    scene.add(comet);
    let cometAngle = 0;

    /*** ILUMINACIÓN (Más brillante para realzar colores) ***/
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(50, 100, 50);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xffd700, 1.0, 200);
    pointLight.position.set(0, 50, 0);
    scene.add(pointLight);

    /*** ANIMACIÓN ***/
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Efecto sutil en el starfield
      starMaterial.opacity = 0.8 + 0.2 * Math.sin(elapsed * 0.5);
      starField.rotation.y += 0.0005;

      nebulaGroup.rotation.y += 0.0003;
      nebulaGroup.rotation.x += 0.0002;
      galaxy.rotation.y += 0.0002;
      ring.rotation.z += 0.001;
      asteroidBelt.rotation.y += 0.001;

      // Actualiza la rotación individual de cada asteroide
      asteroidBelt.children.forEach((asteroid: THREE.Object3D) => {
        const rotationSpeed = (asteroid.userData as RotatingUserData).rotationSpeed;
        asteroid.rotation.x += rotationSpeed.x;
        asteroid.rotation.y += rotationSpeed.y;
        asteroid.rotation.z += rotationSpeed.z;
      });
      
      cometAngle += 0.005;
      const cometRadius = 600;
      comet.position.set(
        cometRadius * Math.cos(cometAngle) - 400,
        100 + 20 * Math.sin(elapsed * 0.5),
        cometRadius * Math.sin(cometAngle) + 500
      );
      
      // Ajuste dinámico de la cámara (con deriva sutil y zoom)
      camera.position.z = 400 - zoomRef.current * 200;
      camera.position.x = 10 * Math.sin(elapsed * 0.1);
      camera.lookAt(0, 0, 0);
      
      composer.render();
    };
    animate();

    /*** MANEJO DEL REDIMENSIONAMIENTO ***/
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
      fxaaPass.uniforms["resolution"].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
      sharpenPass.uniforms["resolution"].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
    };
    window.addEventListener("resize", handleResize);

    // Limpieza al desmontar
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default UniverseScene;
