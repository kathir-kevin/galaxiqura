/* GALAXIQURA — Core UI & Interaction Architecture
 * Author: Senior Creative Frontend Architect
 * Features:
 * - Dynamic data mounting with Bento Grid layout geometry
 * - Real-time liquid glass spotlight calculation (--mx, --my)
 * - 3D tactile perspective card tilting with realistic inertia
 * - Scroll-linked timeline progress tracker for AS-IS -> TO-BE
 * - Accessible static-host contact handler with validation
 */
(() => {
  "use strict";

  const { metrics, pillars, steps, verticals, focus } = window.GX_DATA || {};
  const ICONS = window.GX_ICONS || {};

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => (s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const mount = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };
  const icon = (k) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[k] || ""}"/></svg>`;

  /* 1. Mount Impact Metrics */
  if (metrics) {
    mount(
      "hero-metrics",
      metrics
        .map(
          (m, idx) => `
        <div class="metric-item" data-in style="--d:${6 + idx}">
          <span class="metric-val">${esc(m.n)}</span>
          <span class="metric-lbl">${esc(m.l)}</span>
        </div>`
        )
        .join("")
    );
  }

  /* 2. Mount Six Pillars of Transformation (Balanced, Responsive 3-Column Grid) */
  if (pillars) {
    mount(
      "pillars",
      pillars
        .map(
          ([icoKey, title, desc], idx) => `
        <div class="col-12 col-md-6 col-lg-4">
          <article class="gx-card glass pillar-card" data-fx>
            <span class="card-cross card-cross-tl">+</span>
            <span class="card-cross card-cross-br">+</span>
            <div class="card-inner">
              <div class="card-top">
                <div class="card-icon-wrap">${icon(icoKey)}</div>
                <span class="pillar-num">0${idx + 1}</span>
              </div>
              <h3 class="card-title">${esc(title)}</h3>
              <p class="card-desc">${esc(desc)}</p>
              <div class="card-bottom">
                <button type="button" class="card-link btn-explore-pillar" data-pillar="${idx}">Explore Pillar <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg></button>
              </div>
            </div>
          </article>
        </div>`
        )
        .join("")
    );
  }

  /* 3. Mount Signature 6-Step Approach (AS-IS -> TO-BE) */
  if (steps) {
    mount(
      "steps",
      steps
        .map(
          ([phase, detail], idx) => `
        <li class="step-item" data-step="${idx + 1}">
          <div class="step-header">
            <span class="step-badge">Phase 0${idx + 1}</span>
            <strong class="step-title">${esc(phase)}</strong>
          </div>
          <p class="step-desc">${esc(detail)}</p>
        </li>`
        )
        .join("")
    );
  }

  /* 4. Mount Five Verticals (Optimized Space Utilization: 3 + 2 Grid) */
  if (verticals) {
    mount(
      "verticals",
      verticals
        .map(
          (v, idx) => `
        <div class="col-12 col-md-6 col-lg-${idx < 3 ? 4 : 6}">
          <article class="gx-card glass vertical-card" data-fx>
            <span class="card-cross card-cross-tl">+</span>
            <span class="card-cross card-cross-br">+</span>
            <div class="card-inner">
              <div class="vertical-tag-wrap">
                <span class="badge-accent">${esc(v.tag)}</span>
              </div>
              <h3 class="card-title mt-2">${esc(v.t)}</h3>
              <p class="card-desc">${esc(v.d)}</p>
              <ul class="vertical-list">
                ${v.l.map((x) => `<li>${esc(x)}</li>`).join("")}
              </ul>
              ${v.f ? `<div class="vertical-foot glass">${esc(v.f)}</div>` : ""}
            </div>
          </article>
        </div>`
        )
        .join("")
    );
  }

  /* 5. Mount Leadership Focus */
  if (focus) {
    mount(
      "focus",
      focus
        .map(
          ([t, d]) => `
        <div class="col-sm-6">
          <div class="focus-item glass">
            <div class="focus-dot"></div>
            <div>
              <strong>${esc(t)}</strong>
              <span>${esc(d)}</span>
            </div>
          </div>
        </div>`
        )
        .join("")
    );
  }

  // Update dynamic year
  const yr = $("#yr");
  if (yr) yr.textContent = new Date().getFullYear();

  const isReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* 6. Liquid Glass Spotlight & 3D Perspective Tilt on pointer devices */
  if (isFinePointer) {
    document.addEventListener(
      "pointermove",
      (e) => {
        const glassTarget = e.target.closest?.(".glass");
        if (!glassTarget) return;

        const rect = glassTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        glassTarget.style.setProperty("--mx", `${mouseX}px`);
        glassTarget.style.setProperty("--my", `${mouseY}px`);

        if (!isReducedMotion && glassTarget.dataset.fx !== undefined) {
          const normX = mouseX / rect.width - 0.5;
          const normY = mouseY / rect.height - 0.5;
          const rotateX = normY * -9; // Tilt along X axis
          const rotateY = normX * 9;  // Tilt along Y axis
          glassTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        }
      },
      { passive: true }
    );

    // Reset transform on pointer leave
    document.addEventListener("pointerout", (e) => {
      const glassCard = e.target.closest?.("[data-fx]");
      if (glassCard && !glassCard.contains(e.relatedTarget)) {
        glassCard.style.transform = "";
      }
    });
  }

  /* 7. Scroll Progress & Timeline Tracker (AS-IS -> TO-BE) */
  const rootEl = document.documentElement;
  const timelineEl = $("#steps");
  let scrollTicking = false;

  const onScrollUpdate = () => {
    scrollTicking = false;
    const maxScroll = Math.max(1, rootEl.scrollHeight - innerHeight);
    const progress = (scrollY / maxScroll).toFixed(4);
    rootEl.style.setProperty("--sp", progress);

    if (timelineEl) {
      const rect = timelineEl.getBoundingClientRect();
      const triggerLine = innerHeight * 0.65;
      const timelineProgress = Math.min(1, Math.max(0, (triggerLine - rect.top) / rect.height)).toFixed(4);
      timelineEl.style.setProperty("--tp", timelineProgress);

      const stepItems = $$(".step-item", timelineEl);
      stepItems.forEach((li) => {
        const itemTop = li.getBoundingClientRect().top;
        li.classList.toggle("on", itemTop < triggerLine);
      });
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScrollUpdate);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", onScrollUpdate, { passive: true });
  onScrollUpdate();

  /* 8. Production-Grade Consultation Enquiry Form */
  const form = $("#enquiry");
  const note = $("#formNote");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        if (note) {
          note.innerHTML = `<span style="color:#ff7a7a">Please fill in all required fields.</span>`;
        }
        form.reportValidity();
        return;
      }

      const val = (id) => (document.getElementById(id)?.value || "").trim();
      const name = val("name");
      const phone = val("phone");
      const email = val("email");
      const topic = val("topic");
      const msg = val("msg");

      // Honeypot spam protection
      const honeypot = form.querySelector('input[name="hp_check"]')?.value;
      if (honeypot) {
        if (note) note.innerHTML = `<span style="color:var(--teal)">✓ Your message has been received.</span>`;
        form.reset();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const origBtnHtml = submitBtn ? submitBtn.innerHTML : "Send enquiry";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending enquiry…`;
      }
      if (note) {
        note.innerHTML = `<span style="color:var(--cyan)">Transmitting your consultation enquiry…</span>`;
      }

      let delivered = false;
      // Friendly protocol check: Detect if opened via file:/// instead of http:// web server
      if (window.location.protocol === "file:") {
        if (note) {
          note.innerHTML = `<span style="color:var(--gold)">⚠ Notice: You opened via <code>file:///</code>. Modern browsers block fetch on local files. To test live with Apache/PHP, open in your browser: <a href="http://localhost/galaxiqura/#contact" style="color:var(--teal);text-decoration:underline;font-weight:700;">http://localhost/galaxiqura/</a>. Directing via email client…</span>`;
        }
        const mailBody = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${msg}\n\n---\nSent via GALAXIQURA Strategic Consultation Portal`;
        const mailUrl = `mailto:kathirkjps007@gmail.com?subject=${encodeURIComponent("Strategic Consultation: " + topic)}&body=${encodeURIComponent(mailBody)}`;
        setTimeout(() => {
          window.location.href = mailUrl;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnHtml;
          }
        }, 600);
        return;
      }

      // Tier 1: Vercel Serverless Function (/api/contact)
      try {
        const apiResp = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (apiResp.ok) {
          const resData = await apiResp.json().catch(() => ({}));
          if (resData.success) {
            delivered = true;
            if (note) {
              note.innerHTML = `<span style="color:var(--teal)">✓ Thank you, ${esc(name)}! Your consultation enquiry has been received. Our partners will reach out within 24 hours.</span>`;
            }
            form.reset();
          }
        }
      } catch (err) {
        // Not on Vercel or /api/contact endpoint unavailable, proceed to Tier 2
      }

      // Tier 2: Native Server-Side PHP mailer (contact.php for Apache/cPanel)
      if (!delivered) {
        try {
          const phpResp = await fetch("contact.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (phpResp.ok) {
            const resData = await phpResp.json().catch(() => ({}));
            if (resData.success) {
              delivered = true;
              if (note) {
                note.innerHTML = `<span style="color:var(--teal)">✓ Thank you, ${esc(name)}! Your enquiry has been received and delivered. We will contact you within 24 hours.</span>`;
              }
              form.reset();
            }
          }
        } catch (err) {
          // Server offline or static host
        }
      }

      // Tier 3: Client-side mailto fallback if completely offline
      if (!delivered) {
        if (note) {
          note.innerHTML = `<span style="color:var(--gold)">Directing via secure email client…</span>`;
        }
        const mailBody = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${msg}\n\n---\nSent via GALAXIQURA Strategic Consultation Portal`;
        const mailUrl = `mailto:kathirkjps007@gmail.com?subject=${encodeURIComponent("Strategic Consultation: " + topic)}&body=${encodeURIComponent(mailBody)}`;
        setTimeout(() => {
          window.location.href = mailUrl;
        }, 300);
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHtml;
      }
    });
  }

  /* 9. Spatial Pillar Deep-Dive Drawer Controller */
  const drawer = $("#pillarDrawer");
  const backdrop = $("#pillarDrawerBackdrop");
  const drawerBody = $("#drawerBody");
  const drawerIdx = $("#drawerIdx");
  const drawerClose = $("#drawerClose");

  const closeDrawer = () => {
    if (drawer) {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    }
    if (backdrop) {
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "";
  };

  const openPillar = (idx) => {
    const details = (window.GX_DATA.pillarDetails || [])[idx];
    if (!details || !drawer || !drawerBody) return;

    if (drawerIdx) drawerIdx.textContent = `0${idx + 1}`;

    drawerBody.innerHTML = `
      <div class="drawer-inner">
        <h2 id="drawerTitle" class="drawer-title">${esc(details.title)}</h2>
        <p class="drawer-tagline">${esc(details.tagline)}</p>
        <p class="drawer-summary">${esc(details.summary)}</p>

        <div class="drawer-box">
          <h3 class="drawer-box-title">Verified KPI Impact Targets</h3>
          <div class="drawer-kpis-grid">
            ${details.kpis.map((k) => `
              <div class="drawer-kpi-card glass">
                <span class="kpi-num">${esc(k.val)}</span>
                <span class="kpi-lbl">${esc(k.lbl)}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="drawer-box">
          <h3 class="drawer-box-title">Scope of Operational Deliverables</h3>
          <ul class="drawer-checklist">
            ${details.deliverables.map((d) => `
              <li>
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                <span>${esc(d)}</span>
              </li>
            `).join("")}
          </ul>
        </div>

        <div class="drawer-box">
          <h3 class="drawer-box-title">4-Phase Transformation Roadmap</h3>
          <div class="drawer-roadmap">
            ${details.roadmap.map((step, i) => `
              <div class="roadmap-item">
                <span class="roadmap-badge">Phase 0${i + 1}</span>
                <span class="roadmap-text">${esc(step)}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="drawer-impact glass">
          <strong>Demonstrated Outcome:</strong> ${esc(details.impact)}
        </div>

        <div class="drawer-cta-wrap mt-4">
          <button type="button" class="btn btn-gx-gold btn-lg w-100 btn-drawer-consult" data-topic="${esc(details.title)}">
            Schedule Consultation on ${esc(details.title)} &rarr;
          </button>
        </div>
      </div>
    `;

    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    if (backdrop) {
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden", "false");
    }
    document.body.style.overflow = "hidden";

    // Direct consultation booking from inside drawer
    $(".btn-drawer-consult", drawer)?.addEventListener("click", () => {
      closeDrawer();
      const topicEl = $("#topic");
      if (topicEl) topicEl.value = "Consulting";
      const msgEl = $("#msg");
      if (msgEl) {
        msgEl.value = `Hello, I would like to schedule an executive consultation regarding ${details.title} for our organization.`;
      }
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        document.getElementById("name")?.focus();
      }, 200);
    });
  };

  window.GX_OPEN_PILLAR = openPillar;

  // Delegate click for Explore Pillar buttons
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-explore-pillar");
    if (btn) {
      e.preventDefault();
      const idx = parseInt(btn.dataset.pillar, 10);
      openPillar(idx);
    }
  });

  drawerClose?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer?.classList.contains("open")) {
      closeDrawer();
    }
  });

  /* 10. Responsive Mobile Navbar Collapse on Link Click */
  const navMenu = $("#navMenu");
  if (navMenu) {
    $$(".nav-link, .btn", navMenu).forEach((item) => {
      item.addEventListener("click", () => {
        if (window.innerWidth < 992 && navMenu.classList.contains("show")) {
          const toggler = $(".navbar-toggler");
          if (toggler) toggler.click();
        }
      });
    });
  }
})();
