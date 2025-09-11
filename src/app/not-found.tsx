"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Minimal TS declarations for window-bound data used by the original script
declare global {
  interface Window {
    dataCCD?: any;
    textRings?: THREE.Group[];
  }
}

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0015);

    const sizes = { width: containerRef.current.clientWidth, height: containerRef.current.clientHeight };
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100000);
    camera.position.set(0, 20, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.enabled = false;
    controls.target.set(0, 0, 0);
    controls.enablePan = false;
    controls.minDistance = 15;
    controls.maxDistance = 300;
    controls.zoomSpeed = 0.3;
    controls.rotateSpeed = 0.3;
    controls.update();

    // Helpers
    function createGlowMaterial(color: string, size = 128, opacity = 0.55) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) return new THREE.Sprite(new THREE.SpriteMaterial());
      const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Sprite(material);
    }

    // Central glow and nebulas
    const centralGlow = createGlowMaterial("rgba(255,255,255,0.8)", 156, 0.25);
    centralGlow.scale.set(8, 8, 1);
    scene.add(centralGlow);

    for (let i = 0; i < 12; i++) {
      const hue = Math.random() * 360;
      const color = `hsla(${hue}, 80%, 50%, 0.6)`;
      const nebula = createGlowMaterial(color, 256);
      nebula.scale.set(100, 100, 1);
      nebula.position.set((Math.random() - 0.5) * 175, (Math.random() - 0.5) * 175, (Math.random() - 0.5) * 175);
      scene.add(nebula);
    }

    // Galaxy base field
    const galaxyParameters = {
      count: 100000,
      arms: 6,
      radius: 100,
      spin: 0.5,
      randomness: 0.2,
      randomnessPower: 20,
      insideColor: new THREE.Color(0xd63ed6),
      outsideColor: new THREE.Color(0x48b8b8),
    };

    const positions = new Float32Array(galaxyParameters.count * 3);
    const colors = new Float32Array(galaxyParameters.count * 3);
    let pointIdx = 0;
    for (let i = 0; i < galaxyParameters.count; i++) {
      const radius = Math.pow(Math.random(), galaxyParameters.randomnessPower) * galaxyParameters.radius;
      const branchAngle = ((i % galaxyParameters.arms) / galaxyParameters.arms) * Math.PI * 2;
      const spinAngle = radius * galaxyParameters.spin;
      const randomX = (Math.random() - 0.5) * galaxyParameters.randomness * radius;
      const randomY = (Math.random() - 0.5) * galaxyParameters.randomness * radius * 1.2;
      const randomZ = (Math.random() - 0.5) * galaxyParameters.randomness * radius;
      if (radius < 30 && Math.random() < 0.8) continue;
      const totalAngle = branchAngle + spinAngle;
      const i3 = pointIdx * 3;
      positions[i3] = Math.cos(totalAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(totalAngle) * radius + randomZ;
      const mixedColor = new THREE.Color(0xff66ff);
      mixedColor.lerp(new THREE.Color(0x66ffff), radius / galaxyParameters.radius);
      mixedColor.multiplyScalar(0.7 + 0.3 * Math.random());
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      pointIdx++;
    }

    const galaxyGeometry = new THREE.BufferGeometry();
    galaxyGeometry.setAttribute("position", new THREE.BufferAttribute(positions.slice(0, pointIdx * 3), 3));
    galaxyGeometry.setAttribute("color", new THREE.BufferAttribute(colors.slice(0, pointIdx * 3), 3));

    const galaxyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uSize: { value: 50.0 * renderer.getPixelRatio() },
        uRippleTime: { value: -1.0 },
        uRippleSpeed: { value: 40.0 },
        uRippleWidth: { value: 20.0 },
      },
      vertexShader: `
        uniform float uSize;\n        uniform float uTime;\n        uniform float uRippleTime;\n        uniform float uRippleSpeed;\n        uniform float uRippleWidth;\n        varying vec3 vColor;\n        void main() {\n          vColor = color;\n          vec4 modelPosition = modelMatrix * vec4(position, 1.0);\n          if (uRippleTime > 0.0) {\n            float rippleRadius = (uTime - uRippleTime) * uRippleSpeed;\n            float particleDist = length(modelPosition.xyz);\n            float strength = 1.0 - smoothstep(rippleRadius - uRippleWidth, rippleRadius + uRippleWidth, particleDist);\n            strength *= smoothstep(rippleRadius + uRippleWidth, rippleRadius - uRippleWidth, particleDist);\n            if (strength > 0.0) { vColor += vec3(strength * 2.0); }\n          }\n          vec4 viewPosition = viewMatrix * modelPosition;\n          gl_Position = projectionMatrix * viewPosition;\n          gl_PointSize = uSize / -viewPosition.z;\n        }\n      `,
      fragmentShader: `
        varying vec3 vColor;\n        void main() {\n          float dist = length(gl_PointCoord - vec2(0.5));\n          if (dist > 0.5) discard;\n          gl_FragColor = vec4(vColor, 1.0);\n        }\n      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true,
    });
    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxy);

    // Stars background
    const starCount = 20000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 900;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 900;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 900;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true, opacity: 0.7, depthWrite: false });
    const starField = new THREE.Points(starGeometry, starMaterial);
    starField.name = "starfield";
    starField.renderOrder = 999;
    scene.add(starField);

    // Planet + shader
    function createPlanetTexture(size = 512) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);
      const gradient = ctx.createRadialGradient(size / 2, size / 2, size / 8, size / 2, size / 2, size / 2);
      gradient.addColorStop(0.0, "#f8bbd0");
      gradient.addColorStop(0.12, "#f48fb1");
      gradient.addColorStop(0.22, "#f06292");
      gradient.addColorStop(0.35, "#ffffff");
      gradient.addColorStop(0.5, "#e1aaff");
      gradient.addColorStop(0.62, "#a259f7");
      gradient.addColorStop(0.75, "#b2ff59");
      gradient.addColorStop(1.0, "#3fd8c7");
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * size; const y = Math.random() * size;
        const radius = 30 + Math.random() * 120; const color = ["#f8bbd0","#f8bbd0","#f48fb1","#f48fb1","#f06292","#f06292","#ffffff","#e1aaff","#a259f7","#b2ff59"][Math.floor(Math.random()*10)];
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius); g.addColorStop(0, color + "cc"); g.addColorStop(1, color + "00"); ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
      }
      if ((ctx as any).filter !== undefined) { (ctx as any).filter = "blur(2px)"; ctx.drawImage(canvas, 0, 0); (ctx as any).filter = "none"; }
      return new THREE.CanvasTexture(canvas);
    }

    const stormShader = {
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform float time; uniform sampler2D baseTexture; varying vec2 vUv; void main(){ vec2 uv=vUv; float angle=length(uv-vec2(0.5))*3.0; float twist=sin(angle*3.0+time)*0.1; uv.x += twist * sin(time*0.5); uv.y += twist * cos(time*0.5); vec4 texColor=texture2D(baseTexture,uv); float noise=sin(uv.x*10.0+time)*sin(uv.y*10.0+time)*0.1; texColor.rgb += noise*vec3(0.8,0.4,0.2); gl_FragColor=texColor; }`,
    } as const;

    const planetRadius = 10;
    const planetGeometry = new THREE.SphereGeometry(planetRadius, 48, 48);
    const planetTexture = createPlanetTexture();
  const planetMaterial = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0.0 }, baseTexture: { value: planetTexture } },
      vertexShader: stormShader.vertexShader,
      fragmentShader: stormShader.fragmentShader,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(0, 0, 0);
    planet.name = "main-planet";
    scene.add(planet);
    centralGlow.name = "main-glow";

    // Text rings (canvas texture on cylinders)
    const ringTexts: string[] = [
      "404 Not Found",
      "Error: Not Found",
      "Page not found",
    ];

    function createTextRings() {
      const numRings = ringTexts.length;
      const baseRingRadius = planetRadius * 1.1;
      const ringSpacing = 5;
      window.textRings = [];
      for (let i = 0; i < numRings; i++) {
        const text = ringTexts[i % ringTexts.length] + "   ";
        const ringRadius = baseRingRadius + i * ringSpacing;
        const textureHeight = 150;
        const fontSize = Math.max(130, 0.8 * textureHeight);
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d")!;
        tempCtx.font = `bold ${fontSize}px Arial, sans-serif`;
        const single = ringTexts[i % ringTexts.length];
        const sep = "   ";
        const seg = single + sep;
        const segWidth = tempCtx.measureText(seg).width;
        const textureWidthCircumference = 2 * Math.PI * ringRadius * 180;
        const repeatCount = Math.ceil(textureWidthCircumference / segWidth);
        let fullText = new Array(Math.max(1, repeatCount)).fill(seg).join("");
        let finalTextureWidth = Math.max(1, segWidth * Math.max(1, repeatCount));

        const textCanvas = document.createElement("canvas");
        textCanvas.width = Math.ceil(finalTextureWidth);
        textCanvas.height = textureHeight;
        const ctx = textCanvas.getContext("2d")!;
        ctx.clearRect(0, 0, textCanvas.width, textureHeight);
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.shadowColor = "#e0b3ff"; ctx.shadowBlur = 18; ctx.lineWidth = 7; ctx.strokeStyle = "#fff"; ctx.strokeText(fullText, 0, textureHeight * 0.82);
        ctx.shadowColor = "#ffb3de"; ctx.shadowBlur = 24; ctx.fillStyle = "#fff"; ctx.fillText(fullText, 0, textureHeight * 0.84);
        const ringTexture = new THREE.CanvasTexture(textCanvas);
        ringTexture.wrapS = THREE.RepeatWrapping;
        ringTexture.repeat.x = finalTextureWidth / textureWidthCircumference;
        ringTexture.needsUpdate = true;
        const ringGeometry = new THREE.CylinderGeometry(ringRadius, ringRadius, 1, 128, 1, true);
        const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, transparent: true, side: THREE.DoubleSide, alphaTest: 0.01, opacity: 1, depthWrite: false });
        const textRingMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        textRingMesh.position.set(0, 0, 0);
        textRingMesh.rotation.y = Math.PI / 2;
        const ringGroup = new THREE.Group();
        ringGroup.add(textRingMesh);
        ringGroup.userData = { ringRadius, angleOffset: 0.15 * Math.PI * 0.5, speed: 0.002 + 0.00025, tiltSpeed: 0, rollSpeed: 0, pitchSpeed: 0, tiltAmplitude: Math.PI / 3, rollAmplitude: Math.PI / 6, pitchAmplitude: Math.PI / 8, tiltPhase: Math.PI * 2, rollPhase: Math.PI * 2, pitchPhase: Math.PI * 2, isTextRing: true };
        const initialRotationX = (i / numRings) * (Math.PI / 1);
        ringGroup.rotation.x = initialRotationX;
        scene.add(ringGroup);
        window.textRings.push(ringGroup);
      }
    }
    createTextRings();

    function updateTextRingsRotation() {
      if (!window.textRings) return;
      window.textRings.forEach((ringGroup) => {
        ringGroup.children.forEach((child: any) => {
          if (child.userData.initialAngle !== undefined) {
            const angle = child.userData.initialAngle + ringGroup.userData.angleOffset;
            const x = Math.cos(angle) * child.userData.ringRadius;
            const z = Math.sin(angle) * child.userData.ringRadius;
            child.position.set(x, 0, z);
            const worldPos = new THREE.Vector3();
            child.getWorldPosition(worldPos);
            const lookAtVector = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
            const rotationY = Math.atan2(lookAtVector.x, lookAtVector.z);
            child.rotation.y = rotationY;
          }
        });
      });
    }

    function animatePlanetSystem() {
      if (!window.textRings) return;
      const time = Date.now() * 0.001;
      window.textRings.forEach((ringGroup, index) => {
        const userData = ringGroup.userData as any;
        userData.angleOffset += userData.speed;
        const tilt = Math.sin(time * userData.tiltSpeed + userData.tiltPhase) * userData.tiltAmplitude;
        const roll = Math.cos(time * userData.rollSpeed + userData.rollPhase) * userData.rollAmplitude;
        const pitch = Math.sin(time * userData.pitchSpeed + userData.pitchPhase) * userData.pitchAmplitude;
        ringGroup.rotation.x = (index / window.textRings!.length) * (Math.PI / 1) + tilt;
        ringGroup.rotation.z = roll;
        ringGroup.rotation.y = userData.angleOffset + pitch;
        const textMesh = ringGroup.children[0] as THREE.Mesh;
        if ((textMesh.material as any)?.opacity !== undefined) {
          (textMesh.material as any).opacity = 0.9;
        }
      });
      updateTextRingsRotation();
    }

    // Shooting stars (lightweight)
  const shootingStars: THREE.Group[] = [];
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let introStarted = false;
    let fadeOpacity = 0.1;
    let fadeInProgress = false;

    // Photo textures to cycle on each planet click (uses files under /public)
    const planetPhotos = [
      "/afin.jpg",
      "/afin1.jpg",
      "/flood.jpg",
      "/flood1.jpg",
      "/flood2.jpg",
      "/flood3.jpg",
      "/flood4.jpg",
      "/rievan1.png",
    ];
    const textureLoader = new THREE.TextureLoader();
    const textureCache = new Map<string, THREE.Texture>();
    let photoIdx = 0;

    function swapPlanetTexture(url: string) {
      if (!url) return;
      let tex = textureCache.get(url);
      if (!tex) {
        tex = textureLoader.load(url);
        tex.colorSpace = THREE.SRGBColorSpace;
        textureCache.set(url, tex);
      }
      (planet.material as THREE.ShaderMaterial).uniforms.baseTexture.value = tex;
      (planet.material as THREE.ShaderMaterial).uniformsNeedUpdate = true;
    }

    function createRandomCurve() {
      const startPoint = new THREE.Vector3(-200 + Math.random() * 100, -100 + Math.random() * 200, -100 + Math.random() * 200);
      const endPoint = new THREE.Vector3(600 + Math.random() * 200, startPoint.y + (-100 + Math.random() * 200), startPoint.z + (-100 + Math.random() * 200));
      const controlPoint1 = new THREE.Vector3(startPoint.x + 200 + Math.random() * 100, startPoint.y + (-50 + Math.random() * 100), startPoint.z + (-50 + Math.random() * 100));
      const controlPoint2 = new THREE.Vector3(endPoint.x - 200 + Math.random() * 100, endPoint.y + (-50 + Math.random() * 100), endPoint.z + (-50 + Math.random() * 100));
      return new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
    }

    function createShootingStar() {
      const trailLength = 100;
      const headGeometry = new THREE.SphereGeometry(2, 32, 32);
      const headMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      const curve = createRandomCurve();
      const trailPoints: THREE.Vector3[] = [];
      for (let i = 0; i < trailLength; i++) { trailPoints.push(curve.getPoint(i / (trailLength - 1))); }
      const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
      const trailMaterial = new THREE.LineBasicMaterial({ color: 0x99eaff, transparent: true, opacity: 0.7 });
      const trail = new THREE.Line(trailGeometry, trailMaterial);
      const group = new THREE.Group();
      (group as any).userData = { curve, progress: 0, speed: 0.001 + Math.random() * 0.001, life: 0, maxLife: 300, head, trail, trailLength, trailPoints };
      group.add(head); group.add(trail);
      scene.add(group);
      shootingStars.push(group);
    }

    // Planet hint text
    let hintText: THREE.Mesh | null = null;
  function createHintText() {
      const canvasSize = 512;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = canvasSize;
      const context = canvas.getContext("2d")!;
      const fontSize = 50;
  const text = "I Love Bubub ♡ ";
      context.font = `bold ${fontSize}px Arial, sans-serif`;
      context.textAlign = "center"; context.textBaseline = "middle";
      context.shadowColor = "#ffb3de"; context.shadowBlur = 5; context.lineWidth = 2; context.strokeStyle = "rgba(255, 200, 220, 0.8)"; context.strokeText(text, canvasSize / 2, canvasSize / 2);
      context.shadowColor = "#e0b3ff"; context.shadowBlur = 5; context.lineWidth = 2; context.strokeStyle = "rgba(220, 180, 255, 0.5)"; context.strokeText(text, canvasSize / 2, canvasSize / 2);
      context.shadowColor = "transparent"; context.shadowBlur = 0; context.fillStyle = "white"; context.fillText(text, canvasSize / 2, canvasSize / 2);
      const textTexture = new THREE.CanvasTexture(canvas); textTexture.needsUpdate = true;
      const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true, side: THREE.DoubleSide });
      const planeGeometry = new THREE.PlaneGeometry(16, 8);
      hintText = new THREE.Mesh(planeGeometry, textMaterial);
      hintText.position.set(0, 15, 0);
      scene.add(hintText);
    }
    createShootingStar();
    createHintText();

    // Click to start intro and enable controls
  const onCanvasClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planet);
      if (intersects.length > 0) {
    // Always change planet texture on each click
    swapPlanetTexture(planetPhotos[photoIdx % planetPhotos.length]);
    photoIdx++;

    // Start intro only on first click
    if (introStarted) return;
        introStarted = true; fadeInProgress = true;
        document.body.classList.add("intro-started");
        // small camera move
        const startPos = camera.position.clone();
        const endPos = new THREE.Vector3(-40, 100, 100);
        let t = 0;
        const animatePath = () => {
          if (t >= 1) { camera.position.copy(endPos); camera.lookAt(0, 0, 0); controls.target.set(0, 0, 0); controls.update(); controls.enabled = true; return; }
          t += 0.01; const ease = 0.5 - 0.5 * Math.cos(Math.PI * t);
          camera.position.lerpVectors(startPos, endPos, ease); camera.lookAt(0, 0, 0);
          requestAnimationFrame(animatePath);
        };
        controls.enabled = false; animatePath();
      }
    };
    renderer.domElement.addEventListener("click", onCanvasClick);

    // Resize
    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth; const h = containerRef.current.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      controls.target.set(0, 0, 0); controls.update();
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      controls.update();
      (planet.material as THREE.ShaderMaterial).uniforms.time.value = time * 0.5;

      if (fadeInProgress && fadeOpacity < 1) { fadeOpacity += 0.025; if (fadeOpacity > 1) fadeOpacity = 1; }
      if (!introStarted) {
        fadeOpacity = 0.1; planet.visible = true; centralGlow.visible = true;
      }

      // Update shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const group: any = shootingStars[i];
        group.userData.life++;
        let opacity = 1.0; if (group.userData.life < 30) opacity = group.userData.life / 30; else if (group.userData.life > group.userData.maxLife - 30) opacity = (group.userData.maxLife - group.userData.life) / 30;
        group.userData.progress += group.userData.speed;
        if (group.userData.progress > 1) { scene.remove(group); shootingStars.splice(i, 1); continue; }
        const currentPos = group.userData.curve.getPoint(group.userData.progress);
        group.position.copy(currentPos);
        (group.userData.head.material as THREE.Material as any).opacity = opacity;
        const trail = group.userData.trail as THREE.Line<THREE.BufferGeometry, THREE.Material>;
        const trailPoints = group.userData.trailPoints as THREE.Vector3[];
        trailPoints[0].copy(currentPos);
        for (let j = 1; j < group.userData.trailLength; j++) {
          const trailProgress = Math.max(0, group.userData.progress - j * 0.01);
          trailPoints[j].copy(group.userData.curve.getPoint(trailProgress));
        }
        trail.geometry.setFromPoints(trailPoints);
        (trail.material as any).opacity = opacity * 0.7;
      }
      if (shootingStars.length < 3 && Math.random() < 0.02) createShootingStar();

      planet.lookAt(camera.position);
      animatePlanetSystem();
      if ((starField.material as any).opacity !== undefined) { (starField.material as any).opacity = 1.0; (starField.material as any).transparent = false; }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("click", onCanvasClick);
      controls.dispose();
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "fixed", inset: 0 }}>
      <div id="container" ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
      <div id="dark-overlay" style={{ position: "absolute", inset: 0, background: "rgba(10,10,30,0.92)", pointerEvents: "none", transition: "opacity 0.6s", opacity: 1 }} />
      <div style={{ position: "fixed", bottom: 10, right: 10, fontSize: 18, fontFamily: "Arial, sans-serif", color: "white", background: "rgba(0,0,0,0.4)", padding: "6px 12px", borderRadius: 8, zIndex: 9999 }}>Create by Rievan</div>
      <style>{`
        html, body { margin:0; padding:0; overflow:hidden; }
        body.intro-started #dark-overlay { opacity: 0; transition: opacity 1.2s; }
        canvas { position: fixed; top: 0; left: 0; z-index: 11; }
      `}</style>
    </div>
  );
}
