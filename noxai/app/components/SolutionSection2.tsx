"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   Label data — positions matched to the reference image layout.
   dir3d: sphere-surface anchor for the connector line.
   isReverse: true if icon should be on the right of the text.
───────────────────────────────────────────────────────────────*/
const LABELS = [
  {
    id: 1,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v17M12 5h8M12 5H4M20 5v4M4 5v4M20 9c0 2-3 2-3 2s-3 0-3-2M4 9c0 2 3 2 3 2s3 0 3-2M12 20h4M12 20H8" />
      </svg>
    ),
    title: "Regulations",
    desc: "Global regulatory updates and obligations",
    pTop: 5, pLeft: 10,
    dir3d: [-0.68, 0.62, 0.38] as [number, number, number],
    isReverse: false,
  },
  {
    id: 2,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "Risks",
    desc: "Contextualized risk identification and scoring",
    pTop: 51, pLeft: -2,
    dir3d: [-0.96, 0.05, 0.28] as [number, number, number],
    isReverse: true, // Icon on the right to be closer to the sphere
  },
  {
    id: 3,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Controls",
    desc: "Control mapping, testing and effectiveness",
    pTop: 85, pLeft: 8,
    dir3d: [-0.65, -0.62, 0.44] as [number, number, number],
    isReverse: false,
  },
  {
    id: 4,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    title: "Threats",
    desc: "Real-time threat intelligence and indicators",
    pTop: 5, pLeft: 66,
    dir3d: [0.65, 0.62, 0.44] as [number, number, number],
    isReverse: false,
  },
  {
    id: 5,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: "Assets",
    desc: "Enterprise-wide asset visibility and classification",
    pTop: 34, pLeft: 82,
    dir3d: [0.95, 0.18, 0.28] as [number, number, number],
    isReverse: false,
  },
  {
    id: 6,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8M16 13H8M16 17H8" />
      </svg>
    ),
    title: "Evidence",
    desc: "Centralized evidence collection and automation",
    pTop: 63, pLeft: 79,
    dir3d: [0.76, -0.38, 0.52] as [number, number, number],
    isReverse: false,
  },
  {
    id: 7,
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Business Context",
    desc: "Align risk with business objectives and operational impact",
    pTop: 85, pLeft: 64,
    dir3d: [0.32, -0.84, 0.44] as [number, number, number],
    isReverse: false,
  },
];

const SPHERE_R = 2.0;

/* ─── Scroll-reveal hook ─── */
function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("ss2-visible"); obs.unobserve(el); }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ─── Fibonacci sphere distribution ─── */
function fibSphere(n: number, r: number): THREE.Vector3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y  = 1 - (i / (n - 1)) * 2;
    const rr = Math.sqrt(1 - y * y);
    const th = golden * i;
    return new THREE.Vector3(rr * Math.cos(th), y, rr * Math.sin(th)).multiplyScalar(r);
  });
}

/* ─── Reusable ellipse orbit line ─── */
function makeOrbitRing(rx: number, ry: number, rotateX: number, rotateY: number, rotateZ: number, color: number, opacity: number) {
  const curve = new THREE.EllipseCurve(
    0, 0,
    rx, ry,
    0, 2 * Math.PI,
    false,
    0
  );
  const pts = curve.getPoints(128);
  const geometry = new THREE.BufferGeometry().setFromPoints(pts);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
  });
  const line = new THREE.Line(geometry, material);
  line.rotation.set(rotateX, rotateY, rotateZ);
  return line;
}

/* ═══════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════ */
export default function SolutionSection2() {
  const headingRef    = useScrollReveal(0);
  const stageWrapRef  = useScrollReveal(150);
  const stageRef      = useRef<HTMLDivElement>(null);
  const lineCanvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs     = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stage      = stageRef.current;
    const lineCanvas = lineCanvasRef.current;
    if (!stage || !lineCanvas) return;

    let animId = 0;
    const cleanups: (() => void)[] = [];

    const init = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (w === 0 || h === 0) {
        const id = requestAnimationFrame(init);
        cleanups.push(() => cancelAnimationFrame(id));
        return;
      }

      /* ── Three.js Scene Setup ── */
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
      camera.position.z = 5.6;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      Object.assign(renderer.domElement.style, {
        position: "absolute", inset: "0",
        pointerEvents: "none", zIndex: "0",
      });
      stage.insertBefore(renderer.domElement, stage.firstChild);

      /* ── 1. Sphere Group (Rotates around itself) ── */
      const sphereGroup = new THREE.Group();
      scene.add(sphereGroup);

      // Dark glossy background sphere
      const baseGeo = new THREE.SphereGeometry(SPHERE_R, 64, 64);
      const baseMat = new THREE.MeshPhongMaterial({
        color: 0x04030f,
        emissive: 0x070420,
        specular: 0x6e4ef5,
        shininess: 95,
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      sphereGroup.add(baseMesh);

      // Star-field/Constellation points on sphere surface
      const starPts = fibSphere(350, SPHERE_R * 1.003);
      const starPos = new Float32Array(starPts.flatMap(p => [p.x, p.y, p.z]));
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xccbbff,
        size: 0.038,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });
      const starField = new THREE.Points(starGeo, starMat);
      sphereGroup.add(starField);

      // Constellation lines connecting nearby stars on sphere surface
      const connectThreshold = SPHERE_R * 0.45;
      const maxConnections = 3;
      const connectionCounts = new Array(starPts.length).fill(0);
      const linePts: THREE.Vector3[] = [];

      for (let i = 0; i < starPts.length; i++) {
        let count = 0;
        for (let j = i + 1; j < starPts.length && count < maxConnections; j++) {
          if (connectionCounts[j] >= maxConnections) continue;
          if (starPts[i].distanceTo(starPts[j]) < connectThreshold) {
            linePts.push(starPts[i], starPts[j]);
            connectionCounts[i]++;
            connectionCounts[j]++;
            count++;
          }
        }
      }

      const constellationGeo = new THREE.BufferGeometry().setFromPoints(linePts);
      const constellationMat = new THREE.LineBasicMaterial({
        color: 0x6644dd,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      });
      const constellationLines = new THREE.LineSegments(constellationGeo, constellationMat);
      sphereGroup.add(constellationLines);

      /* ── 2. Nox AI Central Logo (Stationary, faces camera) ── */
      const logoTex = new THREE.TextureLoader().load("/data/Logo.png");
      const logoMat = new THREE.SpriteMaterial({
        map: logoTex,
        transparent: true,
        color: 0xaa7cff, // Beautiful purple tint matching reference image
        depthTest: false,
        depthWrite: false,
      });
      const logoSprite = new THREE.Sprite(logoMat);
      logoSprite.scale.set(1.9, 1.9, 1);
      logoSprite.renderOrder = 10;
      scene.add(logoSprite);

      /* ── 3. Orbital Rings (Stationary orbits, with slow dot animation) ── */
      const orbitsGroup = new THREE.Group();
      scene.add(orbitsGroup);

      // Ring 1 (tilted left/top)
      const rx1 = 2.9, ry1 = 1.3;
      const ring1 = makeOrbitRing(rx1, ry1, Math.PI / 3, Math.PI / 10, -Math.PI / 12, 0x8e6eff, 0.45);
      orbitsGroup.add(ring1);

      // Ring 2 (tilted right/top)
      const rx2 = 3.0, ry2 = 1.25;
      const ring2 = makeOrbitRing(rx2, ry2, -Math.PI / 4, Math.PI / 6, Math.PI / 10, 0x7a5cff, 0.4);
      orbitsGroup.add(ring2);

      // Ring 3 (horizontal tilt)
      const rx3 = 2.85, ry3 = 1.35;
      const ring3 = makeOrbitRing(rx3, ry3, Math.PI / 6, -Math.PI / 4, -Math.PI / 8, 0x9f85ff, 0.35);
      orbitsGroup.add(ring3);

      // Orbital dots
      const dotGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({
        color: 0xbfa3ff,
        blending: THREE.AdditiveBlending,
      });

      const dotA = new THREE.Mesh(dotGeo, dotMat);
      const dotB = new THREE.Mesh(dotGeo, dotMat);
      const dotC = new THREE.Mesh(dotGeo, dotMat);

      scene.add(dotA);
      scene.add(dotB);
      scene.add(dotC);

      // Helper to project a point from ring-local to world space
      const getRingWorldPosition = (ring: THREE.Line, rx: number, ry: number, angle: number) => {
        const localPt = new THREE.Vector3(rx * Math.cos(angle), ry * Math.sin(angle), 0);
        return localPt.applyEuler(ring.rotation);
      };

      /* ── 4. Edge Atmosphere Glow ── */
      const atmoGeo = new THREE.SphereGeometry(SPHERE_R * 1.15, 32, 32);
      const atmoMat = new THREE.MeshPhongMaterial({
        side: THREE.BackSide,
        color: 0x5a3bff,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
      });
      scene.add(new THREE.Mesh(atmoGeo, atmoMat));

      /* ── Lights ── */
      scene.add(new THREE.AmbientLight(0x0a071f, 1.0));
      const light1 = new THREE.PointLight(0xffffff, 2.0, 20);
      light1.position.set(-3, 3, 5);
      scene.add(light1);

      const light2 = new THREE.PointLight(0x6c4ff5, 3.5, 22);
      light2.position.set(3, -2, -5);
      scene.add(light2);

      const light3 = new THREE.PointLight(0x4422cc, 1.0, 18);
      light3.position.set(0, 5, 2);
      scene.add(light3);

      /* ── Pre-compute anchor positions for lines (sphere relative) ── */
      const anchors = LABELS.map(l =>
        new THREE.Vector3(...l.dir3d).normalize().multiplyScalar(SPHERE_R * 1.05)
      );

      /* ── Canvas context setup ── */
      lineCanvas.width  = w;
      lineCanvas.height = h;
      const ctx = lineCanvas.getContext("2d")!;

      /* ── Resize Handler ── */
      const ro = new ResizeObserver(() => {
        const nw = stage.clientWidth;
        const nh = stage.clientHeight;
        if (nw === 0 || nh === 0) return;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
        lineCanvas.width  = nw;
        lineCanvas.height = nh;
      });
      ro.observe(stage);

      /* ── Animation Loop ── */
      let angleA = 0;
      let angleB = Math.PI * 0.7;
      let angleC = Math.PI * 1.4;

      const animate = () => {
        animId = requestAnimationFrame(animate);

        // Ball rotates around itself
        sphereGroup.rotation.y += 0.0035;

        // Orbital dots update positions
        angleA += 0.006;
        angleB += 0.004;
        angleC += 0.005;

        dotA.position.copy(getRingWorldPosition(ring1, rx1, ry1, angleA));
        dotB.position.copy(getRingWorldPosition(ring2, rx2, ry2, angleB));
        dotC.position.copy(getRingWorldPosition(ring3, rx3, ry3, angleC));

        renderer.render(scene, camera);

        // 2D lines overlay drawing
        const cw = lineCanvas.width;
        const ch = lineCanvas.height;
        ctx.clearRect(0, 0, cw, ch);
        const sRect = stage.getBoundingClientRect();

        anchors.forEach((anchor, i) => {
          const el = labelRefs.current[i];
          if (!el) return;

          // Project sphere surface point to 2D screen coordinate
          const ndc = anchor.clone().project(camera);
          const sx  = (ndc.x * 0.5 + 0.5) * cw;
          const sy  = (-ndc.y * 0.5 + 0.5) * ch;

          // Find exact center of the circular icon
          const iconEl = el.querySelector(".ss2-label-icon");
          if (!iconEl) return;
          const iconRect = iconEl.getBoundingClientRect();
          const lx = iconRect.left - sRect.left + iconRect.width / 2;
          const ly = iconRect.top - sRect.top + iconRect.height / 2;

          // Calculate line direction and intersection with circle border
          const dx = lx - sx;
          const dy = ly - sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const circleRadius = 25; // 50px width / 2

          let targetX = lx;
          let targetY = ly;
          if (dist > circleRadius) {
            targetX = lx - (dx / dist) * circleRadius;
            targetY = ly - (dy / dist) * circleRadius;
          }

          // Draw gradient connector line
          const grad = ctx.createLinearGradient(sx, sy, targetX, targetY);
          grad.addColorStop(0, "rgba(167,139,250,0.85)");
          grad.addColorStop(1, "rgba(108,99,255,0.3)");

          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(targetX, targetY);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = 0.9;
          ctx.stroke();

          // Draw Arrowhead at circle border pointing to circle center
          if (dist > circleRadius) {
            const arrowSize = 6;
            const angle = Math.atan2(dy, dx);
            ctx.beginPath();
            ctx.moveTo(targetX, targetY);
            ctx.lineTo(
              targetX - arrowSize * Math.cos(angle - Math.PI / 6),
              targetY - arrowSize * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
              targetX - arrowSize * Math.cos(angle + Math.PI / 6),
              targetY - arrowSize * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = "rgba(167, 139, 250, 0.95)";
            ctx.fill();
          }

          // Surface contact dot
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(180,155,255,0.95)";
          ctx.fill();

        });
      };
      animate();

      /* ── Cleanup resources ── */
      cleanups.push(() => {
        ro.disconnect();
        cancelAnimationFrame(animId);
        renderer.dispose();
        baseGeo.dispose(); baseMat.dispose();
        starGeo.dispose(); starMat.dispose();
        constellationGeo.dispose(); constellationMat.dispose();
        logoTex.dispose(); logoMat.dispose();
        ring1.geometry.dispose(); (ring1.material as THREE.Material).dispose();
        ring2.geometry.dispose(); (ring2.material as THREE.Material).dispose();
        ring3.geometry.dispose(); (ring3.material as THREE.Material).dispose();
        dotGeo.dispose(); dotMat.dispose();
        atmoGeo.dispose(); atmoMat.dispose();
        renderer.domElement.parentNode?.removeChild(renderer.domElement);
      });
    };

    init();
    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <>
      <style>{`
        /* ─── Section ─── */
        .ss2-section {
          width: 100%;
          padding: 100px 0 120px;
          background: #050508;
          position: relative;
          overflow: hidden;
        }
        .ss2-section::before {
          content: "";
          position: absolute;
          top: -10%; left: -6%;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .ss2-section::after {
          content: "";
          position: absolute;
          bottom: -8%; right: -5%;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 65%);
          pointer-events: none;
        }

        /* ─── Inner container ─── */
        .ss2-inner {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
          padding: 0 2rem;
          display: flex; flex-direction: column;
          align-items: center; gap: 52px;
        }

        /* ─── Heading ─── */
        .ss2-heading { text-align: center; }
        .ss2-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 999px;
          border: 1px solid rgba(108,99,255,0.35);
          background: rgba(108,99,255,0.08);
          backdrop-filter: blur(6px);
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(167,139,250,0.9); margin-bottom: 18px;
        }
        .ss2-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 6px rgba(167,139,250,0.8);
          animation: ss2-pulse 2s ease-in-out infinite;
        }
        @keyframes ss2-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        .ss2-title {
          font-size: clamp(1.8rem, 3.5vw, 2.9rem);
          font-weight: 700; color: #fff;
          line-height: 1.18; letter-spacing: -0.03em;
          margin-bottom: 12px;
        }
        .ss2-gradient {
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ss2-subtitle {
          font-size: clamp(0.88rem, 1.5vw, 1.02rem);
          color: rgba(240,240,245,0.55);
          max-width: 580px; line-height: 1.7; margin: 0 auto;
        }

        /* ─── Stage — adjusted aspect ratio to give space around the ball ─── */
        .ss2-stage-wrap { width: 100%; }
        .ss2-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 0.9;
          max-width: 940px;
          margin: 0 auto;
          user-select: none;
        }

        .ss2-line-canvas {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 1;
          width: 100%; height: 100%;
        }

        /* ─── Circle Label styling matching the exact picture ─── */
        .ss2-label {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 14px;
          z-index: 2;
          cursor: default;
          pointer-events: auto;
        }

        .ss2-label-icon {
          flex-shrink: 0;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid rgba(139, 92, 246, 0.4);
          background: rgba(8, 6, 20, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(196, 181, 253, 0.9);
          backdrop-filter: blur(8px);
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.15) inset;
        }

        .ss2-label:hover .ss2-label-icon {
          border-color: rgba(167, 139, 250, 0.95);
          box-shadow: 0 0 16px rgba(139, 92, 246, 0.45);
          transform: scale(1.05);
        }

        .ss2-label-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ss2-label-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          white-space: nowrap;
        }

        .ss2-label-desc {
          font-size: 0.68rem;
          line-height: 1.4;
          color: rgba(220, 210, 245, 0.55);
          max-width: 144px;
        }

        /* Reverse alignment for Risks (middle-left) */
        .ss2-label-reverse {
          flex-direction: row-reverse;
          text-align: right;
        }

        /* ─── Scroll reveal ─── */
        .ss2-reveal {
          opacity: 0; transform: translateY(30px);
          transition:
            opacity 0.75s cubic-bezier(0.22,1,0.36,1),
            transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .ss2-reveal.ss2-visible { opacity: 1; transform: translateY(0); }

        /* ─── Mobile layout ─── */
        @media (max-width: 520px) {
          .ss2-section { padding: 64px 0 72px; }
          .ss2-stage {
            display: flex; flex-direction: column;
            align-items: center; gap: 24px;
            aspect-ratio: unset; min-height: unset;
          }
          .ss2-label {
            position: relative !important;
            top: auto !important; left: auto !important;
            max-width: 100%;
            flex-direction: row !important;
            text-align: left !important;
          }
          .ss2-line-canvas { display: none; }
          .ss2-labels-mobile {
            display: grid; grid-template-columns: 1fr;
            gap: 16px; width: 100%; padding: 0 0.5rem;
          }
        }
        @media (min-width: 521px) {
          .ss2-labels-mobile { display: contents; }
        }
      `}</style>

      <section className="ss2-section" id="solution-overview" aria-label="Platform overview">
        <div className="ss2-inner">

          {/* Heading */}
          <div ref={headingRef} className="ss2-heading ss2-reveal">
            <div className="ss2-eyebrow">
              <span className="ss2-eyebrow-dot" />
              Platform Overview
            </div>
            <h2 className="ss2-title">
              One Platform.{" "}
              <span className="ss2-gradient">Every Dimension</span>
              <br />of Cyber Risk.
            </h2>
            <p className="ss2-subtitle">
              Nox AI unifies regulations, threats, assets, controls, evidence, and
              business context into a single, continuously-reasoned intelligence layer.
            </p>
          </div>

          {/* 3D Stage */}
          <div ref={stageWrapRef} className="ss2-stage-wrap ss2-reveal">
            <div ref={stageRef} className="ss2-stage">
              {/* Three.js WebGL canvas is injected here by useEffect */}

              {/* 2D connector-line overlay */}
              <canvas ref={lineCanvasRef} className="ss2-line-canvas" />

              {/* Label cards */}
              <div className="ss2-labels-mobile">
                {LABELS.map((label, i) => (
                  <div
                    key={label.id}
                    ref={el => { labelRefs.current[i] = el; }}
                    className={`ss2-label ${label.isReverse ? "ss2-label-reverse" : ""}`}
                    style={{ top: `${label.pTop}%`, left: `${label.pLeft}%` }}
                    aria-label={`${label.title}: ${label.desc}`}
                  >
                    <div className="ss2-label-icon" aria-hidden="true">{label.icon}</div>
                    <div className="ss2-label-text">
                      <span className="ss2-label-title">{label.title}</span>
                      <span className="ss2-label-desc">{label.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
