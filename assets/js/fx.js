/**
 * GALAXIQURA — High-End FX Layer & Interactive Physics
 * Author: Senior Creative Frontend Architect
 * Features:
 * - Bespoke brand loader sequence
 * - Interactive Transformation Canvas (AS-IS Entropy -> TO-BE Geometric Crystalline Alignment)
 * - Kinetic magnetic cursor with elastic spring physics
 * - Magnetic tactile buttons with cursor attraction
 * - Scroll-staggered cinematic reveals with hardware acceleration
 */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const isReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

  /* 1. Loader Sequence */
  const loader = $("#loader");
  const startTime = performance.now();
  const dismissLoader = () => {
    if (!loader) return;
    const elapsed = performance.now() - startTime;
    const delay = Math.max(0, 850 - elapsed);
    setTimeout(() => {
      loader.classList.add("done");
      setTimeout(() => {
        loader.remove();
        document.body.classList.add("loaded");
      }, 750);
    }, delay);
  };

  if (document.readyState === "complete") {
    dismissLoader();
  } else {
    window.addEventListener("load", dismissLoader);
  }

  /* 2. Scroll-Triggered Staggered Reveals */
  const revealTargets = [
    ".section h2",
    ".section-sub",
    "#about p",
    ".chain",
    ".gx-card",
    ".step-item",
    ".ticks li",
    ".pills li",
    ".founder-frame",
    "#founder .col-md-8 > *",
    ".focus-item",
    ".contact-list",
    ".enquiry"
  ];

  const parentCounter = new Map();
  $$(revealTargets.join(",")).forEach((el) => {
    if (el.closest(".hero")) return;
    const parentContainer = el.parentElement?.parentElement?.classList.contains("gx-card")
      ? el.parentElement.parentElement
      : el.parentElement;
    const count = parentCounter.get(parentContainer) || 0;
    parentCounter.set(parentContainer, count + 1);

    el.dataset.rv = el.classList.contains("founder-frame") ? "l" : "";
    el.style.setProperty("--s", Math.min(count, 8));
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
  );

  $$("[data-rv]").forEach((el) => revealObserver.observe(el));

  /* 3. Brutalist Marquee Loop Seamless Duplicate */
  const marqueeTrack = $(".strip-track");
  if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
  }

  /* 4. Pointer & Scroll Shared Coordinates */
  const root = document.documentElement;
  const ptr = { x: -999, y: -999, nx: 0, ny: 0, targetNx: 0, targetNy: 0 };
  let scrollProgress = 0;

  window.addEventListener(
    "scroll",
    () => {
      scrollProgress = window.scrollY / Math.max(1, root.scrollHeight - innerHeight);
      root.style.setProperty("--sy", scrollProgress.toFixed(4));
    },
    { passive: true }
  );

  window.addEventListener(
    "pointermove",
    (e) => {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.targetNx = e.clientX / innerWidth - 0.5;
      ptr.targetNy = e.clientY / innerHeight - 0.5;
    },
    { passive: true }
  );

  /* 5. Interactive Transformation Canvas: AS-IS Chaos -> TO-BE Harmonic Crystalline Order
   * Context: Organizational Transformation.
   * Nodes drift in dynamic fluid entropy, but as the visitor approaches the Approach section,
   * they progressively lock into an aligned geometric lattice matrix with glowing energy connections.
   */
  const canvas = document.createElement("canvas");
  canvas.id = "net";
  canvas.setAttribute("aria-hidden", "true");
  const auroraEl = $(".aurora");
  if (auroraEl) {
    auroraEl.after(canvas);
  } else {
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const approachSection = $("#approach");

  let W = 0, H = 0;
  let nodes = [];

  const initNodes = () => {
    W = canvas.width = window.innerWidth * dpr;
    H = canvas.height = window.innerHeight * dpr;

    // Low-noise, clean celestial particle constellation (relaxed density)
    const count = window.innerWidth < 768 ? 16 : 28;
    const cols = Math.ceil(Math.sqrt((count * window.innerWidth) / window.innerHeight));
    const rows = Math.ceil(count / cols);

    nodes = Array.from({ length: count }, (_, i) => ({
      hx: Math.random() * W,
      hy: Math.random() * H,
      phase: Math.random() * Math.PI * 2,
      speed: 0.00012 + Math.random() * 0.0002,
      amplitude: 25 + Math.random() * 50,
      gx: (((i % cols) + 0.5) / cols) * W,
      gy: ((Math.floor(i / cols) + 0.5) / rows) * H,
      x: 0,
      y: 0,
      radius: (1.2 + Math.random() * 1.4) * dpr,
      isHot: i % 6 === 0
    }));
  };

  let orderStrength = 0;
  const renderCanvas = (time) => {
    const rect = approachSection ? approachSection.getBoundingClientRect() : { top: 1e5 };
    const targetOrder = clamp((window.innerHeight * 0.85 - rect.top) / (window.innerHeight * 0.75));
    orderStrength += (targetOrder - orderStrength) * 0.04;

    const easeOrder = orderStrength * orderStrength * (3 - 2 * orderStrength);

    ctx.clearRect(0, 0, W, H);

    // Update node positions smoothly
    for (const n of nodes) {
      const chaoticX = n.hx + Math.sin(time * n.speed + n.phase) * n.amplitude * dpr;
      const chaoticY = n.hy + Math.cos(time * n.speed * 1.2 + n.phase) * n.amplitude * dpr;
      n.x = chaoticX * (1 - easeOrder * 0.6) + n.gx * (easeOrder * 0.6);
      n.y = chaoticY * (1 - easeOrder * 0.6) + n.gy * (easeOrder * 0.6);
    }

    const mousePx = ptr.x * dpr;
    const mousePy = ptr.y * dpr;
    const maxLinkDist = (window.innerWidth < 768 ? 90 : 125) * dpr;

    // Subtle, whisper-quiet lines between nearby nodes (low-noise)
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < maxLinkDist) {
          const alpha = (1 - dist / maxLinkDist) * 0.09;
          ctx.strokeStyle = `rgba(47, 196, 178, ${alpha})`;
          ctx.lineWidth = dpr * 0.75;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Soft pointer glow link
      const mouseDist = Math.hypot(a.x - mousePx, a.y - mousePy);
      if (mouseDist < maxLinkDist * 1.1) {
        const mouseAlpha = (1 - mouseDist / (maxLinkDist * 1.1)) * 0.25;
        ctx.strokeStyle = `rgba(233, 162, 59, ${mouseAlpha})`;
        ctx.lineWidth = dpr * 1.0;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mousePx, mousePy);
        ctx.stroke();
      }

      // Clean glowing dust node
      ctx.fillStyle = a.isHot
        ? "rgba(233, 162, 59, 0.75)"
        : "rgba(47, 196, 178, 0.45)";
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  initNodes();
  window.addEventListener(
    "resize",
    () => {
      initNodes();
      if (isReducedMotion) renderCanvas(0);
    },
    { passive: true }
  );

  if (isReducedMotion) {
    orderStrength = 0;
    renderCanvas(0);
  } else {
    const loop = (time) => {
      if (!document.hidden) renderCanvas(time);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  if (!isFinePointer || isReducedMotion) return;

  /* 6. Kinetic Spring Cursor */
  const cursorRing = Object.assign(document.createElement("div"), { className: "cx cx-ring" });
  const cursorDot = Object.assign(document.createElement("div"), { className: "cx cx-dot" });
  document.body.append(cursorRing, cursorDot);

  let ringX = 0, ringY = 0;
  const updateCursor = () => {
    // Smooth spring follow
    ringX += (ptr.x - ringX) * 0.18;
    ringY += (ptr.y - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    cursorDot.style.transform = `translate3d(${ptr.x}px, ${ptr.y}px, 0)`;
    requestAnimationFrame(updateCursor);
  };

  window.addEventListener(
    "pointermove",
    () => {
      cursorRing.classList.add("on");
      cursorDot.classList.add("on");
    },
    { once: true }
  );

  document.addEventListener("pointerover", (e) => {
    const isInteractive = !!e.target.closest?.(
      "a, button, input, select, textarea, .gx-card, .pills li, .chain li, .step-item, .sat-badge"
    );
    cursorRing.classList.toggle("big", isInteractive);
  });

  document.addEventListener("pointerleave", () => {
    cursorRing.classList.remove("on");
    cursorDot.classList.remove("on");
  });

  updateCursor();

  /* 7. Magnetic Button Attractors */
  $$(".btn").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const rect = btn.getBoundingClientRect();
      const pullX = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
      const pullY = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      btn.style.translate = `${pullX}px ${pullY}px`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.translate = "";
    });
  });

  /* 8. Smooth Spatial Parallax Damping */
  const parallaxLayers = $$("[data-depth]");
  const updateParallax = () => {
    ptr.nx += (ptr.targetNx - ptr.nx) * 0.08;
    ptr.ny += (ptr.targetNy - ptr.ny) * 0.08;
    parallaxLayers.forEach((layer) => {
      const depthMultiplier = +layer.dataset.depth || 10;
      layer.style.translate = `${-ptr.nx * depthMultiplier}px ${-ptr.ny * depthMultiplier}px`;
    });
    requestAnimationFrame(updateParallax);
  };

  if (parallaxLayers.length) updateParallax();
})();
