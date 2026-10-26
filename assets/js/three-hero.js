/**
 * GALAXIQURA — 3D Iridescent Crystalline Blossom & Kinetic Ripple Matrix
 * Inspired by Anchor AI, Lumen Index, and Veldara (MotionSites reference)
 * Author: Senior Creative Frontend Architect
 * Features:
 * - Bioluminescent Translucent Crystal Blossom with dual-layer blooming petals
 * - Shimmering cyan wireframe lattice veins
 * - 4 Gyroscopic orbital rings & 3D projected HUD badges (Strategy, Process, People, Performance)
 * - Concentric kinetic water/energy ripples on the reflective ground plane
 * - Breathing bloom micro-interaction linked to cursor motion
 * - Damped touch & mouse drag-to-rotate physics
 * - IntersectionObserver auto-sleep/wake (60 FPS on-demand, zero waste offscreen)
 */
(() => {
  "use strict";

  const container = document.getElementById("hero-3d-wrap");
  if (!container || typeof THREE === "undefined") return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return; // Accessible fallback preserved

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const width = container.clientWidth || 450;
  const height = container.clientHeight || 450;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 18);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
  } catch (e) {
    console.warn("WebGL not available, preserving CSS fallback:", e);
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const canvas = renderer.domElement;
  canvas.id = "hero-three-canvas";
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "auto";
  canvas.style.touchAction = "none";
  canvas.setAttribute("aria-hidden", "true");

  const cssFallback = document.getElementById("orbit");
  if (cssFallback) cssFallback.style.display = "none";
  container.appendChild(canvas);

  // 2. Cinematic Luminous Lighting
  const ambientLight = new THREE.AmbientLight(0x223c72, 2.8);
  scene.add(ambientLight);

  const cyanKeyLight = new THREE.DirectionalLight(0x3de3d0, 4.4);
  cyanKeyLight.position.set(10, 12, 10);
  scene.add(cyanKeyLight);

  const goldRimLight = new THREE.DirectionalLight(0xf5b34a, 3.8);
  goldRimLight.position.set(-10, -8, -6);
  scene.add(goldRimLight);

  const violetFillLight = new THREE.PointLight(0xa598ff, 2.8, 30);
  violetFillLight.position.set(0, 8, -4);
  scene.add(violetFillLight);

  // 3. Central Transformation Blossom Group
  const blossomGroup = new THREE.Group();
  scene.add(blossomGroup);

  // Inner Pulsing Singularity Core
  const coreLight = new THREE.PointLight(0x3de3d0, 5, 14);
  blossomGroup.add(coreLight);

  const innerSphereGeo = new THREE.SphereGeometry(0.85, 32, 32);
  const innerSphereMat = new THREE.MeshBasicMaterial({
    color: 0x3de3d0,
    transparent: true,
    opacity: 0.95
  });
  const innerCore = new THREE.Mesh(innerSphereGeo, innerSphereMat);
  blossomGroup.add(innerCore);

  // Central Faceted Seed Crystal
  const seedGeo = new THREE.IcosahedronGeometry(1.4, 0);
  const seedMat = new THREE.MeshPhysicalMaterial({
    color: 0x142c58,
    emissive: 0x12446a,
    emissiveIntensity: 0.55,
    metalness: 0.8,
    roughness: 0.1,
    transmission: 0.82,
    ior: 1.5,
    clearcoat: 1.0,
    flatShading: true
  });
  const seedMesh = new THREE.Mesh(seedGeo, seedMat);
  blossomGroup.add(seedMesh);

  // Create Petal Shape (Curved Organic Petal)
  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, 0);
  petalShape.quadraticCurveTo(0.65, 1.1, 0.45, 2.4);
  petalShape.quadraticCurveTo(0, 3.1, 0, 3.3);
  petalShape.quadraticCurveTo(0, 3.1, -0.45, 2.4);
  petalShape.quadraticCurveTo(-0.65, 1.1, 0, 0);

  const extrudeSettings = {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.03
  };
  const petalGeo = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
  petalGeo.center();

  const petalMat = new THREE.MeshPhysicalMaterial({
    color: 0x162c60,
    emissive: 0x164b78,
    emissiveIntensity: 0.45,
    metalness: 0.15,
    roughness: 0.12,
    transmission: 0.86,
    ior: 1.52,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide
  });

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x3de3d0,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });

  const petals = [];

  // Inner Layer: 6 Petals (Tilted 24 deg)
  const innerCount = 6;
  for (let i = 0; i < innerCount; i++) {
    const angle = (i / innerCount) * Math.PI * 2;
    const pivot = new THREE.Group();
    pivot.rotation.z = angle;

    const mesh = new THREE.Mesh(petalGeo, petalMat);
    mesh.position.y = 1.35;
    mesh.scale.set(0.72, 0.72, 0.72);
    mesh.rotation.x = 0.42;

    const wire = new THREE.Mesh(petalGeo, wireMat);
    wire.position.copy(mesh.position);
    wire.scale.copy(mesh.scale);
    wire.rotation.copy(mesh.rotation);

    pivot.add(mesh);
    pivot.add(wire);
    blossomGroup.add(pivot);

    petals.push({ pivot, mesh, baseRotX: 0.42, layer: 1 });
  }

  // Outer Layer: 8 Petals (Tilted 52 deg, staggered)
  const outerCount = 8;
  for (let i = 0; i < outerCount; i++) {
    const angle = (i / outerCount) * Math.PI * 2 + Math.PI / 8;
    const pivot = new THREE.Group();
    pivot.rotation.z = angle;

    const mesh = new THREE.Mesh(petalGeo, petalMat);
    mesh.position.y = 1.75;
    mesh.scale.set(0.95, 0.95, 0.95);
    mesh.rotation.x = 0.92;

    const wire = new THREE.Mesh(petalGeo, wireMat);
    wire.position.copy(mesh.position);
    wire.scale.copy(mesh.scale);
    wire.rotation.copy(mesh.rotation);

    pivot.add(mesh);
    pivot.add(wire);
    blossomGroup.add(pivot);

    petals.push({ pivot, mesh, baseRotX: 0.92, layer: 2 });
  }

  // 4. Detached Floating Crystal Petals (Drifting in space like Veldara)
  const floatingPetals = [];
  for (let i = 0; i < 4; i++) {
    const fMesh = new THREE.Mesh(petalGeo, petalMat);
    const scale = 0.45 + Math.random() * 0.25;
    fMesh.scale.set(scale, scale, scale);
    fMesh.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 5
    );
    scene.add(fMesh);
    floatingPetals.push({
      mesh: fMesh,
      rotSpeedX: 0.008 + Math.random() * 0.012,
      rotSpeedY: 0.01 + Math.random() * 0.015,
      driftY: 0.003 + Math.random() * 0.005,
      baseY: fMesh.position.y
    });
  }

  // 5. Concentric Kinetic Ground Ripples (Anchor AI reference)
  const ripplesGroup = new THREE.Group();
  ripplesGroup.position.y = -5.0;
  ripplesGroup.rotation.x = Math.PI / 2;
  scene.add(ripplesGroup);

  const rippleRings = [];
  const rippleRadii = [3.0, 4.6, 6.2, 7.8];
  rippleRadii.forEach((r, idx) => {
    const ringGeo = new THREE.TorusGeometry(r, 0.02, 8, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3de3d0,
      transparent: true,
      opacity: 0.25 - idx * 0.04
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ripplesGroup.add(ringMesh);
    rippleRings.push({ mesh: ringMesh, baseR: r, phase: idx * 1.2 });
  });

  // 6. Gyroscopic 4-Pillar Orbital Rings & Projected Badges
  const ringsGroup = new THREE.Group();
  scene.add(ringsGroup);

  const pillarData = [
    { name: "Strategy", radius: 4.2, tiltX: 1.15, tiltZ: 0.45, speed: 0.85, color: 0x3de3d0, htmlColor: "#3de3d0" },
    { name: "Process", radius: 5.3, tiltX: -0.75, tiltZ: -0.85, speed: 0.65, color: 0x38bdf8, htmlColor: "#38bdf8" },
    { name: "People", radius: 6.4, tiltX: 0.45, tiltZ: 1.15, speed: 0.50, color: 0xf5b34a, htmlColor: "#f5b34a" },
    { name: "Performance", radius: 7.5, tiltX: -1.25, tiltZ: 0.65, speed: 0.40, color: 0xff7a6b, htmlColor: "#ff7a6b" }
  ];

  const orbitalItems = [];
  let badgeOverlay = document.getElementById("hero-3d-badges");
  if (!badgeOverlay) {
    badgeOverlay = document.createElement("div");
    badgeOverlay.id = "hero-3d-badges";
    badgeOverlay.style.position = "absolute";
    badgeOverlay.style.inset = "0";
    badgeOverlay.style.pointerEvents = "none";
    badgeOverlay.style.overflow = "hidden";
    badgeOverlay.style.zIndex = "4";
    container.appendChild(badgeOverlay);
  } else {
    badgeOverlay.innerHTML = "";
  }

  pillarData.forEach((p, idx) => {
    const ringPivot = new THREE.Group();
    ringPivot.rotation.x = p.tiltX;
    ringPivot.rotation.z = p.tiltZ;
    ringsGroup.add(ringPivot);

    const ringGeo = new THREE.TorusGeometry(p.radius, 0.022, 16, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: p.color,
      transparent: true,
      opacity: 0.28
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringPivot.add(ringMesh);

    const satGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const satMat = new THREE.MeshStandardMaterial({
      color: p.color,
      emissive: p.color,
      emissiveIntensity: 1.3,
      roughness: 0.2,
      metalness: 0.8
    });
    const satMesh = new THREE.Mesh(satGeo, satMat);
    ringPivot.add(satMesh);

    const badge = document.createElement("button");
    badge.type = "button";
    badge.className = "sat-badge glass";
    badge.dataset.pillarIdx = idx;
    badge.style.position = "absolute";
    badge.style.transform = "translate(-50%, -50%)";
    badge.style.pointerEvents = "auto";
    badge.style.fontSize = "0.8rem";
    badge.style.fontFamily = "var(--head, Sora, sans-serif)";
    badge.style.fontWeight = "600";
    badge.style.letterSpacing = "-0.01em";
    badge.style.color = "#ffffff";
    badge.style.padding = "0.32rem 0.85rem";
    badge.style.borderRadius = "4px";
    badge.style.whiteSpace = "nowrap";
    badge.style.transition = "transform 0.15s ease, background 0.25s, box-shadow 0.25s";
    badge.style.border = `1px solid ${p.htmlColor}55`;
    badge.style.background = "rgba(4, 7, 14, 0.9)";
    badge.style.boxShadow = `0 4px 18px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)`;
    badge.innerHTML = `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${p.htmlColor};margin-right:7px;box-shadow:0 0 8px ${p.htmlColor}"></span>${p.name}`;

    badge.addEventListener("mouseenter", () => {
      badge.style.transform = "translate(-50%, -50%) scale(1.15)";
      badge.style.boxShadow = `0 0 25px ${p.htmlColor}aa, inset 0 1px 0 rgba(255,255,255,0.5)`;
      satMesh.scale.set(1.6, 1.6, 1.6);
    });
    badge.addEventListener("mouseleave", () => {
      badge.style.transform = "translate(-50%, -50%) scale(1)";
      badge.style.boxShadow = `0 4px 18px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)`;
      satMesh.scale.set(1, 1, 1);
    });

    // Clicking satellite badge directly opens the Pillar Deep-Dive Drawer!
    badge.addEventListener("click", () => {
      window.GX_OPEN_PILLAR && window.GX_OPEN_PILLAR(idx);
    });

    badgeOverlay.appendChild(badge);

    orbitalItems.push({
      pivot: ringPivot,
      mesh: satMesh,
      radius: p.radius,
      speed: p.speed,
      angle: (idx * Math.PI) / 2,
      badge: badge
    });
  });

  // 7. Swirling Luminous Particle Nebula
  const particleCount = 380;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const cTeal = new THREE.Color(0x3de3d0);
  const cGold = new THREE.Color(0xf5b34a);
  const cBlue = new THREE.Color(0x38bdf8);

  for (let i = 0; i < particleCount; i++) {
    const r = 2.4 + Math.random() * 8.8;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 5.0;

    positions[i * 3] = Math.cos(theta) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * r;

    const t = Math.random();
    const clr = t < 0.45 ? cTeal : t < 0.75 ? cGold : cBlue;
    colors[i * 3] = clr.r;
    colors[i * 3 + 1] = clr.g;
    colors[i * 3 + 2] = clr.b;
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.13,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 8. Interaction State & Damped Controls
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;
  let dragVelX = 0, dragVelY = 0;

  const onPointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    mouseX = (cx / rect.width - 0.5) * 2;
    mouseY = (cy / rect.height - 0.5) * 2;

    if (isDragging) {
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      dragVelX = deltaX * 0.006;
      dragVelY = deltaY * 0.006;
      targetRotationY += dragVelX;
      targetRotationX += dragVelY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    }
  };

  const onPointerDown = (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
    dragVelX = 0;
    dragVelY = 0;
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerUp, { passive: true });

  // 9. Responsive Resizing
  const onResize = () => {
    const w = container.clientWidth || 450;
    const h = container.clientHeight || 450;
    camera.aspect = w / h;
    if (w < 480) {
      camera.position.z = 24;
    } else if (w < 768) {
      camera.position.z = 21;
    } else {
      camera.position.z = 18;
    }
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize, { passive: true });
  onResize();

  // 10. Lifecycle & Intersection Observer
  let isVisible = true;
  let animFrameId = null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animFrameId) {
          clock.start();
          animate();
        }
      });
    },
    { threshold: 0.05 }
  );
  observer.observe(container);

  // 11. Animation Loop
  const clock = new THREE.Clock();
  const tempVec = new THREE.Vector3();

  const animate = () => {
    if (!isVisible) {
      animFrameId = null;
      return;
    }

    animFrameId = requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Natural idle spin + drag inertia damping
    if (!isDragging) {
      dragVelX *= 0.94;
      dragVelY *= 0.94;
      targetRotationY += dragVelX + delta * 0.22;
      targetRotationX += dragVelY;
    }

    // Parallax
    const targetCamX = mouseX * 1.6;
    const targetCamY = -mouseY * 1.6;
    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (targetCamY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    // Apply rotation to blossom
    blossomGroup.rotation.y = targetRotationY;
    blossomGroup.rotation.x = targetRotationX + Math.sin(elapsedTime * 0.4) * 0.1;

    // Organic Breathing Bloom: petals subtly open/close with mouse distance
    const bloomAmount = Math.sin(elapsedTime * 1.5) * 0.08 + Math.abs(mouseX) * 0.12;
    petals.forEach((p) => {
      p.mesh.rotation.x = p.baseRotX + bloomAmount * (p.layer === 2 ? 1.4 : 0.8);
    });

    // Pulse inner core singularity
    const pulse = 1.0 + Math.sin(elapsedTime * 3.5) * 0.16;
    innerCore.scale.set(pulse, pulse, pulse);
    seedMesh.rotation.y = -targetRotationY * 0.4;
    seedMesh.rotation.z = elapsedTime * 0.15;

    // Drifting floating petals (Veldara style)
    floatingPetals.forEach((fp, i) => {
      fp.mesh.rotation.x += fp.rotSpeedX;
      fp.mesh.rotation.y += fp.rotSpeedY;
      fp.mesh.position.y = fp.baseY + Math.sin(elapsedTime * 0.8 + i) * 0.6;
    });

    // Kinetic water/energy ripples on floor (Anchor AI style)
    rippleRings.forEach((rr) => {
      const scale = 1.0 + (Math.sin(elapsedTime * 1.6 + rr.phase) * 0.12);
      rr.mesh.scale.set(scale, scale, 1);
    });

    // Rotate particle nebula
    particleSystem.rotation.y = elapsedTime * 0.06;

    // Update gyroscopic orbital satellites & screen-space badges
    const rect = container.getBoundingClientRect();
    orbitalItems.forEach((item) => {
      item.angle += delta * item.speed;
      const x = Math.cos(item.angle) * item.radius;
      const y = Math.sin(item.angle) * item.radius;
      item.mesh.position.set(x, y, 0);

      item.mesh.getWorldPosition(tempVec);
      tempVec.project(camera);

      const screenX = (tempVec.x * 0.5 + 0.5) * rect.width;
      const screenY = (-(tempVec.y * 0.5) + 0.5) * rect.height;

      if (tempVec.z < 1.0) {
        item.badge.style.display = "block";
        item.badge.style.left = `${screenX}px`;
        item.badge.style.top = `${screenY - 26}px`;
        item.badge.style.opacity = `${Math.max(0.35, Math.min(1.0, 1.2 - tempVec.z))}`;
      } else {
        item.badge.style.display = "none";
      }
    });

    renderer.render(scene, camera);
  };

  animate();
})();
